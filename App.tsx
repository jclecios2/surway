import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { LandingPage } from './components/LandingPage';
import { ActiveCallInterface } from './components/ActiveCallInterface';
import { createBlob, decode, decodeAudioData } from './utils/audio-utils';
import { translations, Language } from './utils/translations';

const GEMINI_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';

function App() {
  // Application State
  const [isCallActive, setIsCallActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [lang, setLang] = useState<Language>('pt');

  // Audio & Gemini Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null); 
  
  // Cleanup function to stop all audio processing
  const stopAudioProcessing = useCallback(() => {
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
        processorRef.current = null;
    }
    if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
  }, []);

  const handleStartDemo = async () => {
    setIsCallActive(true);
    setConnectionStatus('connecting');
    setErrorMsg(null);
    setIsMicOn(true);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY not found in environment.");
        }

        const ai = new GoogleGenAI({ apiKey });

        // Initialize Audio Contexts
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        // Get Microphone Access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Select system instructions based on language
        const systemInstruction = lang === 'pt' 
          ? `Você é a Surfway, uma agente de viagens de IA avançada, profissional e amigável.
             Seu objetivo é ajudar os usuários a simular a reserva de voos, encontrar hotéis e planejar viagens.
             Mantenha suas respostas relativamente concisas e conversacionais, adequadas para uma chamada de voz.
             Responda sempre em Português do Brasil.
             Comece cumprimentando o usuário calorosamente e perguntando como você pode ajudar com os planos de viagem hoje.`
          : `You are Surfway, an advanced, professional, and friendly AI travel agent. 
             Your goal is to help users simulate booking flights, finding hotels, and planning trips.
             Keep your responses relatively concise and conversational, suitable for a voice call.
             Start by greeting the user warmly and asking how you can help with their travel plans today.`;

        // Establish Live Connection
        const sessionPromise = ai.live.connect({
            model: GEMINI_MODEL,
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
                systemInstruction: systemInstruction,
            },
            callbacks: {
                onopen: () => {
                    setConnectionStatus('connected');
                    console.log('Gemini Live Connection Opened');
                    
                    if (!inputAudioContextRef.current || !mediaStreamRef.current) return;

                    // Setup Input Stream Processing
                    const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                    sourceNodeRef.current = source;
                    
                    // Using ScriptProcessor as per guidelines
                    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    processorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        if (!isMicOn) return; 
                        
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        
                        sessionPromise.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };

                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const outputCtx = outputAudioContextRef.current;
                    if (!outputCtx) return;

                    // Handle Audio Output
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    
                    if (base64Audio) {
                        nextStartTimeRef.current = Math.max(
                            nextStartTimeRef.current,
                            outputCtx.currentTime
                        );

                        const audioBuffer = await decodeAudioData(
                            decode(base64Audio),
                            outputCtx,
                            24000,
                            1
                        );

                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        const gainNode = outputCtx.createGain();
                        source.connect(gainNode);
                        gainNode.connect(outputCtx.destination);
                        
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                    }

                    if (message.serverContent?.interrupted) {
                        console.log('Model interrupted');
                        nextStartTimeRef.current = outputCtx.currentTime; 
                    }
                },
                onclose: () => {
                    console.log('Gemini Live Connection Closed');
                    setConnectionStatus('disconnected');
                    stopAudioProcessing();
                },
                onerror: (e) => {
                    console.error('Gemini Live Connection Error', e);
                    setConnectionStatus('error');
                    setErrorMsg(translations[lang].activeCall.error);
                }
            }
        });
        
        sessionRef.current = sessionPromise;

    } catch (err: any) {
        console.error("Setup failed", err);
        setConnectionStatus('error');
        setErrorMsg(err.message || translations[lang].activeCall.error);
        stopAudioProcessing();
    }
  };

  const handleEndCall = () => {
    if (sessionRef.current) {
        sessionRef.current.then((session: any) => {
             if(session.close) session.close();
        }).catch(() => {});
    }
    stopAudioProcessing();
    setIsCallActive(false);
    setConnectionStatus('disconnected');
  };

  const toggleMic = () => {
    setIsMicOn(prev => !prev);
  };

  useEffect(() => {
    return () => {
        stopAudioProcessing();
    };
  }, [stopAudioProcessing]);


  return (
    <>
      <LandingPage 
        onStartDemo={handleStartDemo} 
        lang={lang} 
        setLang={setLang} 
      />
      <ActiveCallInterface 
        isActive={isCallActive}
        onEndCall={handleEndCall}
        connectionStatus={connectionStatus}
        isMicOn={isMicOn}
        toggleMic={toggleMic}
        errorMsg={errorMsg}
        lang={lang}
      />
    </>
  );
}

export default App;
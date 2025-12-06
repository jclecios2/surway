import React, { useEffect, useState } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface ActiveCallInterfaceProps {
  isActive: boolean;
  onEndCall: () => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  isMicOn: boolean;
  toggleMic: () => void;
  errorMsg: string | null;
  lang: Language;
}

export const ActiveCallInterface: React.FC<ActiveCallInterfaceProps> = ({
  isActive,
  onEndCall,
  connectionStatus,
  isMicOn,
  toggleMic,
  errorMsg,
  lang
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const t = translations[lang];

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (isActive && connectionStatus === 'connected') {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isActive, connectionStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center text-white/50">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
          <span className="text-sm font-medium uppercase tracking-widest">
            {connectionStatus === 'connected' ? t.activeCall.liveSession : t.activeCall.connecting}
          </span>
        </div>
        <button 
          onClick={onEndCall}
          className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md px-6">
        
        {/* Error Message */}
        {errorMsg && (
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center text-sm">
                {errorMsg}
            </div>
        )}

        {/* Avatar / Orb */}
        <div className="relative mb-12 group">
          <div className={`absolute -inset-4 bg-surf-500/30 rounded-full blur-2xl transition-all duration-1000 ${connectionStatus === 'connected' ? 'scale-150 animate-pulse-slow' : 'scale-100'}`}></div>
          <div className="relative w-40 h-40 bg-gradient-to-br from-surf-900 to-slate-900 rounded-full border border-surf-500/50 flex items-center justify-center shadow-2xl shadow-surf-500/20">
             {/* Visualizer Bars */}
             <div className="flex items-center space-x-1 h-12">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1.5 bg-surf-400 rounded-full transition-all duration-300 ${connectionStatus === 'connected' ? 'animate-wave' : 'h-1'}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                ))}
             </div>
          </div>
          
          <div className="absolute -bottom-10 left-0 right-0 text-center">
            <h3 className="text-2xl font-light text-white">Surfway</h3>
            <p className="text-surf-300 text-sm mt-1">{connectionStatus === 'connected' ? formatTime(elapsedTime) : t.activeCall.initializing}</p>
          </div>
        </div>

        {/* Hint Text */}
        <div className="h-16 flex items-center justify-center text-center">
             {connectionStatus === 'connected' && (
                 <p className="text-slate-400 text-sm animate-pulse">
                    {t.activeCall.hint}
                 </p>
             )}
        </div>
      </div>

      {/* Controls */}
      <div className="pb-12 w-full max-w-sm px-6">
        <div className="flex justify-center items-center space-x-6">
            <button 
                onClick={toggleMic}
                className={`p-5 rounded-full transition-all duration-200 ${isMicOn ? 'bg-white text-slate-900 hover:bg-gray-100' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}
            >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button 
                onClick={onEndCall}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-full font-medium transition-colors flex items-center space-x-2"
            >
                <span className="whitespace-nowrap">{t.activeCall.endCall}</span>
            </button>
        </div>
        <p className="text-center text-slate-500 text-xs mt-6">
            {t.activeCall.micSecure}
        </p>
      </div>
    </div>
  );
};
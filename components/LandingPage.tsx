import React from 'react';
import { Plane, Mic, Globe, ShieldCheck, PlayCircle, Globe2 } from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface LandingPageProps {
  onStartDemo: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo, lang, setLang }) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-surf-600 p-1.5 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Surfway</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-surf-600 transition-colors">{t.nav.platform}</a>
              <a href="#solutions" className="text-slate-600 hover:text-surf-600 transition-colors">{t.nav.solutions}</a>
              <a href="#pricing" className="text-slate-600 hover:text-surf-600 transition-colors">{t.nav.pricing}</a>
              
              <button 
                onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
                className="flex items-center space-x-1 text-slate-600 hover:text-surf-600 font-medium"
              >
                <Globe2 className="w-4 h-4" />
                <span>{lang === 'pt' ? 'EN' : 'PT'}</span>
              </button>

              <button 
                onClick={onStartDemo}
                className="bg-surf-600 hover:bg-surf-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-surf-600/20"
              >
                {t.nav.testDrive}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-surf-50 border border-surf-100 rounded-full px-4 py-1.5">
                <span className="flex h-2 w-2 rounded-full bg-surf-500 animate-pulse"></span>
                <span className="text-sm font-medium text-surf-700">{t.hero.tag}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1]">
                {t.hero.titleStart} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-surf-600 to-indigo-600">
                  {t.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                {t.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onStartDemo}
                  className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <PlayCircle className="w-6 h-6" />
                  <span>{t.hero.startBtn}</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white border border-slate-200 hover:border-surf-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
                  <span>{t.hero.caseStudiesBtn}</span>
                </button>
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-center space-x-8 text-slate-400">
                <span className="text-sm font-medium uppercase tracking-wider">{t.hero.trustedBy}</span>
                <div className="flex space-x-6 grayscale opacity-60">
                  {/* Placeholder Logos */}
                  <div className="h-6 w-20 bg-slate-300 rounded"></div>
                  <div className="h-6 w-20 bg-slate-300 rounded"></div>
                  <div className="h-6 w-20 bg-slate-300 rounded"></div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-surf-200 to-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">live_agent_session.ts</div>
                </div>
                <div className="p-8 space-y-6">
                   <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="font-bold text-slate-500">U</span>
                      </div>
                      <div className="bg-slate-100 rounded-2xl rounded-tl-none px-6 py-4 text-slate-700 max-w-[80%]">
                        {t.demo.user}
                      </div>
                   </div>
                   <div className="flex items-start space-x-4 flex-row-reverse space-x-reverse">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surf-600 flex items-center justify-center shadow-lg shadow-surf-600/30">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-surf-600 text-white rounded-2xl rounded-tr-none px-6 py-4 max-w-[80%] shadow-md">
                        {t.demo.agent}
                      </div>
                   </div>
                   <div className="flex justify-center pt-4">
                     <span className="text-xs font-medium text-surf-600 bg-surf-50 px-3 py-1 rounded-full animate-pulse">
                        {t.demo.listening}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.features.sectionTitle}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t.features.sectionSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="w-6 h-6 text-surf-600" />,
                title: t.features.humanVoice.title,
                desc: t.features.humanVoice.desc
              },
              {
                icon: <Globe className="w-6 h-6 text-surf-600" />,
                title: t.features.gds.title,
                desc: t.features.gds.desc
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-surf-600" />,
                title: t.features.pci.title,
                desc: t.features.pci.desc
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-surf-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-slate-800 p-1.5 rounded-lg">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Surfway</span>
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.contact}</a>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-slate-500 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-center md:text-right">
              <span>{t.footer.copyright}</span>
              <span className="text-surf-400">{t.footer.developedBy}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
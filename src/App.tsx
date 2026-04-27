import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  ChevronRight, 
  Upload, 
  ArrowRight, 
  Lock, 
  BarChart3, 
  Activity, 
  CheckCircle2, 
  User, 
  Sparkles,
  Bolt, 
  CircleHelp, 
  MessagesSquare, 
  Moon, 
  Sun,
  Info, 
  History, 
  Brain, 
  ShieldAlert, 
  LogOut,
  Smile,
  Timer,
  Type,
  Share2,
  Image as ImageIcon,
  MessageSquareDashed,
  Home
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { cn } from './lib/utils';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie } from 'recharts';
import { translations, Language } from './locales';
import { parseChatFile, ChatStats } from './lib/parser';
import { generateLocalSynthesis } from './lib/analyzer';

// Types
type ViewState = 'welcome' | 'login' | 'upload' | 'processing' | 'insights' | 'profile' | 'dashboard' | 'pricing';

export default function App() {
  const [view, setView] = useState<ViewState>(() => {
    return localStorage.getItem('readr-onboarded') === 'true' ? 'dashboard' : 'welcome';
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('insight-lang');
    return (saved as Language) || 'tr';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('readr-dark') === 'true';
  });
  const [currentStats, setCurrentStats] = useState<ChatStats | null>(null);
  const [analysisTarget, setAnalysisTarget] = useState<'self' | 'partner'>('self');

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('readr-dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('insight-lang', lang);
  }, [lang]);

  // Simulate processing for the demo
  useEffect(() => {
    if (view === 'processing') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setView('insights'), 1000);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setProcessingProgress(0);
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-parchment text-ink font-serif selection:bg-sepia/20 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col min-w-0">
        <Header setView={setView} currentView={view} t={t} darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main className="max-w-4xl mx-auto px-6 py-12 pb-32">
          <AnimatePresence mode="wait">
            {view === 'welcome' && <WelcomeView key="welcome" onStart={() => {
              localStorage.setItem('readr-onboarded', 'true');
              setView('login');
            }} t={t} />}
            {view === 'dashboard' && <DashboardView key="dashboard" setView={setView} t={t} lang={lang} />}
            {view === 'login' && <LoginView key="login" onLogin={() => setView('upload')} t={t} />}
            {view === 'upload' && <UploadView key="upload" onUpload={(stats) => {
              setCurrentStats(stats);
              setView('processing');
            }} t={t} analysisTarget={analysisTarget} setAnalysisTarget={setAnalysisTarget} lang={lang} />}
            {view === 'processing' && <ProcessingView key="processing" progress={processingProgress} t={t} />}
            {view === 'insights' && currentStats && <InsightsView stats={currentStats} lang={lang} t={t} analysisTarget={analysisTarget} key="insights" />}
            {view === 'profile' && <ProfileView key="profile" setView={setView} t={t} lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />}
            {view === 'pricing' && <PricingView key="pricing" setView={setView} t={t} lang={lang} />}
          </AnimatePresence>
        </main>

        <Navigation setView={setView} currentView={view} t={t} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </div>
  );
}

// Sub-components

function Header({ setView, currentView, t, darkMode, setDarkMode }: { setView: (v: ViewState) => void, currentView: ViewState, t: any, darkMode: boolean, setDarkMode: (v: boolean) => void, key?: string }) {
  const isLanding = currentView === 'welcome' || currentView === 'login';
  const letters = Array.from(t.appName);

  return (
    <header className="sticky top-0 z-50 bg-parchment/80 backdrop-blur-sm flex items-center justify-between px-6 py-6 md:py-8 border-b border-sepia/10">
      <div className="w-10"></div> 
      
      <div className="flex items-center gap-3 cursor-pointer absolute left-1/2 -translate-x-1/2" onClick={() => setView(localStorage.getItem('readr-onboarded') === 'true' ? 'dashboard' : 'welcome')}>
        {!isLanding && (
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src="/logo.png" 
            alt="Readr Logo" 
            className="w-10 h-10 object-contain mix-blend-multiply grayscale contrast-125" 
          />
        )}
        <motion.h1 
          className="text-5xl md:text-6xl font-display leading-none flex text-sepia"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.5 }
            }
          }}
        >
          {letters.map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 8, x: -5, rotate: -20, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, x: 0, rotate: 0, filter: "blur(0px)" }
              }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="w-10 h-10 rounded-xl parchment-sheet border border-sepia/20 shadow-sm flex items-center justify-center text-sepia hover:bg-sepia/10 transition-all active:scale-95"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}

function DashboardView({ setView, t, lang }: { setView: (v: ViewState) => void, t: any, lang: string }) {
  const recentChats = [
    { name: "Julianne Moore", date: "Bugün", emoji: "✨", color: "bg-sepia/10" },
    { name: "Mark Zuckerberg", date: "2 gün önce", emoji: "⚡", color: "bg-ink/10" },
    { name: "Bilinmeyen Kullanıcı", date: "1 hafta önce", emoji: "🌙", color: "bg-ink/5" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12 py-4"
    >
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold text-sepia uppercase tracking-[0.4em]">{t.dashboard.title}</span>
          <h2 className="text-6xl font-display text-sepia tracking-tighter">Dashboard</h2>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-sepia/5 border border-sepia/20 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-sepia" />
            <span className="text-[10px] font-bold text-sepia uppercase tracking-widest">
              {lang === 'tr' ? '%100 Cihaz İçi Şifreleme' : '100% On-Device Encryption'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setView('upload')}
          className="bg-sepia text-parchment px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-widest hover:-translate-y-1 hover:shadow-lg hover:shadow-sepia/30 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-xl">➕</span>
          {t.dashboard.newAnalysis}
        </button>
      </section>

      {/* Mini Stats & Persona */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Persona Card */}
        <div className="md:col-span-2 parchment-sheet border border-sepia/20 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-sepia/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-sepia uppercase tracking-[0.3em]">
                {lang === 'tr' ? 'İletişim Karakterin' : 'Communication Persona'}
              </p>
              <h4 className="text-3xl font-display text-sepia">Gece Kuşu 🌙</h4>
              <p className="text-sm text-ink/70 font-serif italic max-w-sm">
                {lang === 'tr' ? 'Genelde gece saatlerinde aktifsiniz ve mesajlara ortalama 4 dakika içinde ışık hızında dönüyorsunuz.' : 'You are highly active at night and respond to messages at lightning speed, averaging 4 minutes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-rows-2 gap-6">
          <div className="parchment-sheet border border-sepia/20 rounded-[2rem] p-6 shadow-xl flex items-center gap-4 group">
             <div className="w-12 h-12 bg-sepia/10 text-sepia rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
               💬
             </div>
             <div>
               <p className="text-[9px] font-bold text-sepia/60 uppercase tracking-widest">{lang === 'tr' ? 'Analiz Edilen Mesaj' : 'Analyzed Messages'}</p>
               <p className="text-2xl font-display text-sepia mt-0.5">14,500</p>
             </div>
          </div>
          <div className="parchment-sheet border border-sepia/20 rounded-[2rem] p-6 shadow-xl flex items-center gap-4 group">
             <div className="w-12 h-12 bg-sepia/10 text-sepia rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
               😊
             </div>
             <div>
               <p className="text-[9px] font-bold text-sepia/60 uppercase tracking-widest">{lang === 'tr' ? 'Favori Emoji' : 'Favorite Emoji'}</p>
               <p className="text-2xl font-display text-sepia mt-0.5">😂</p>
             </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-sepia uppercase tracking-[0.4em]">{t.dashboard.recentChats}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentChats.map((chat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="parchment-sheet border border-sepia/20 rounded-3xl p-8 shadow-xl group hover:bg-sepia/5 transition-colors flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-2xl border border-sepia/20", chat.color)}>
                  {chat.emoji}
                </div>
                <div>
                  <h4 className="text-2xl font-display text-sepia">{chat.name}</h4>
                  <p className="text-[10px] font-bold text-sepia/40 uppercase tracking-widest mt-1">{t.dashboard.lastAnalyzed} {chat.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setView('insights')}
                className="w-12 h-12 rounded-xl border border-sepia/20 flex items-center justify-center group-hover:bg-sepia group-hover:border-sepia group-hover:text-parchment transition-all shadow-sm group-hover:shadow-sepia/20 group-hover:scale-105"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="parchment-sheet border border-sepia/20 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sepia/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="w-20 h-20 bg-sepia/10 text-sepia rounded-[2rem] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
          <Brain className="w-10 h-10" />
        </div>
        <div className="relative z-10 space-y-2 flex-grow text-center md:text-left">
          <p className="text-[10px] font-bold text-sepia uppercase tracking-[0.3em]">
            {lang === 'tr' ? 'Son Analizden İçgörü' : 'Latest Insight'}
          </p>
          <h4 className="text-2xl font-display text-sepia max-w-lg">
            {lang === 'tr' ? '"Mark ile olan konuşmalarında %65 oranında sohbeti başlatan taraf sensin."' : '"You initiate 65% of the conversations with Mark."'}
          </h4>
        </div>
        <button onClick={() => setView('insights')} className="shrink-0 bg-sepia text-parchment px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-sepia/80 transition-colors relative z-10">
          {lang === 'tr' ? 'Detayları Gör' : 'View Details'}
        </button>
      </section>
    </motion.div>
  );
}

function WelcomeView({ onStart, t }: { onStart: () => void, t: any, key?: string }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 150], [1, 0]);
  const bgOpacity = useTransform(x, [0, 150], [0.1, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 180) {
      onStart();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-12 py-10"
    >
      <div className="relative w-72 h-72 flex items-center justify-center mb-4">
        <div className="absolute inset-0 bg-sepia/20 rounded-full blur-3xl animate-pulse"></div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-10 w-64 h-64 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-sepia/20 bg-parchment"
        >
          <img src="/character.png" alt="3D Tech Character" className="w-full h-full object-cover mix-blend-multiply grayscale contrast-125" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-display text-sepia max-w-md mx-auto leading-tight">
          {t.welcome.headline}
        </h2>
        <p className="text-lg text-ink/80 max-w-sm mx-auto leading-relaxed italic">
          {t.welcome.description}
        </p>
      </div>

      <div className="w-full max-w-[300px] pt-4">
        <div className="relative w-full h-[68px] parchment-sheet rounded-full shadow-inner border border-sepia/20 flex items-center overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-sepia rounded-full" 
            style={{ width: useTransform(x, (val) => val + 64), opacity: bgOpacity }} 
          />
          
          <motion.span 
            className="absolute w-full text-center text-xs font-display font-bold uppercase tracking-[0.2em] text-sepia/40 pointer-events-none pl-12"
            style={{ opacity }}
          >
            {t.welcome.getStarted}
            <span className="inline-block ml-2 opacity-50 animate-pulse">&gt;&gt;&gt;</span>
          </motion.span>
          
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 226 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="w-14 h-14 bg-sepia text-parchment rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing z-10 ml-1.5"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-sepia/20 parchment-sheet shadow-sm">
        <ShieldCheck className="text-sepia w-5 h-5 shrink-0" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-sepia/70">
          {t.welcome.securityNote}
        </p>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16 text-left relative"
      >
        {t.welcome.features.map((item: any, i: number) => (
          <motion.div 
            key={i} 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
            }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative parchment-sheet p-8 rounded-[2.5rem] border border-sepia/20 shadow-xl flex flex-col gap-5 group overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-sepia/5 rounded-full blur-3xl group-hover:bg-sepia/10 group-hover:scale-150 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-sepia uppercase tracking-widest leading-none bg-sepia/10 w-fit px-4 py-2 rounded-2xl group-hover:bg-sepia group-hover:text-parchment transition-colors duration-300">
                {item.label}
              </span>
              <h3 className="text-3xl font-display text-sepia mt-6 group-hover:text-gold transition-colors duration-300">{item.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed font-serif mt-3 italic">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function LoginView({ onLogin, t }: { onLogin: () => void, t: any, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-md mx-auto space-y-8 py-10"
    >
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-display text-sepia tracking-tight">{t.appFullName}</h1>
        <p className="text-ink/70 max-w-[280px] mx-auto leading-relaxed italic">{t.login.subtitle}</p>
      </div>

      <div className="parchment-sheet border border-sepia/20 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sepia/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-3 w-full py-4 px-4 bg-parchment text-sepia font-bold border border-sepia/20 rounded-2xl hover:bg-sepia/5 transition-all active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5 object-contain mix-blend-multiply grayscale" />
              <span className="font-display uppercase tracking-widest text-xs">{t.login.google}</span>
            </button>
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-3 w-full py-4 px-4 bg-sepia text-parchment font-bold rounded-2xl hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              <div className="w-5 h-5 bg-parchment rounded-full flex items-center justify-center">
                 <span className="text-[10px] text-sepia font-bold">A</span>
              </div>
              <span className="font-display uppercase tracking-widest text-xs">{t.login.apple}</span>
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-sepia/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-sepia/40 uppercase tracking-widest font-display">{t.login.or}</span>
            <div className="flex-grow border-t border-sepia/10"></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-sepia/60 px-1 uppercase tracking-widest font-display" htmlFor="email">{t.login.emailLabel}</label>
              <input 
                className="w-full px-5 py-4 bg-parchment border border-sepia/20 focus:ring-2 focus:ring-sepia/10 focus:border-sepia rounded-2xl font-serif text-ink placeholder:text-sepia/30 transition-all outline-none italic" 
                id="email" 
                placeholder={t.login.emailPlaceholder} 
                type="email"
              />
            </div>
            <button 
              onClick={onLogin}
              className="w-full bg-sepia text-parchment py-4 rounded-2xl font-display font-bold uppercase tracking-widest shadow-lg shadow-sepia/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-sepia/30 active:scale-95 transition-all"
            >
              {t.login.signIn}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-sepia/5 border border-sepia/10 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-sepia/10 text-sepia rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sepia">{t.login.securityTitle}</h3>
            <p className="text-xs text-ink/70 leading-relaxed font-serif italic">{t.login.securityDesc}</p>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[10px] font-bold text-sepia/40 uppercase tracking-widest font-display">{t.login.encryption}</span>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 font-display">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
              {t.login.activeStatus}
            </span>
          </div>
          <div className="h-1.5 w-full bg-sepia/5 rounded-full overflow-hidden">
            <div className="h-full bg-gold w-full"></div>
          </div>
        </div>
      </div>

      <footer className="flex flex-col items-center space-y-4 pt-4 opacity-40">
        <div className="flex gap-6 uppercase text-[10px] font-bold tracking-widest font-display">
          {t.login.links.map((link: string, i: number) => (
            <button key={i} className="hover:text-sepia transition-colors">{link}</button>
          ))}
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] font-display text-sepia">© 2026 Kollektiv x Readr</p>
      </footer>
    </motion.div>
  );
}

function UploadView({ onUpload, t, analysisTarget, setAnalysisTarget, lang }: { onUpload: (stats: ChatStats) => void, t: any, analysisTarget: 'self' | 'partner', setAnalysisTarget: (v: 'self'|'partner') => void, lang: string, key?: string }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const stats = await parseChatFile(content);
      onUpload(stats);
    };
    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center max-w-2xl mx-auto space-y-16 py-10"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".txt" 
        className="hidden" 
      />
      
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-display text-sepia tracking-tight">{t.upload.title}</h2>
        <p className="text-ink/70 max-w-md mx-auto leading-relaxed italic">
          {t.upload.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <button 
          onClick={() => setAnalysisTarget('self')}
          className={cn(
            "relative h-48 rounded-[2rem] border-4 transition-all overflow-hidden flex flex-col items-center justify-center group",
            analysisTarget === 'self' ? "border-sepia shadow-xl scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-sepia/40 z-10 group-hover:bg-sepia/30 transition-colors"></div>
          <img src="/self.png" alt="Self Analysis" className="absolute inset-0 w-full h-full object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-500 mix-blend-multiply" />
          <div className="relative z-20 flex flex-col items-center gap-3">
            <div className={cn("p-3 rounded-2xl backdrop-blur-md bg-white/20 border border-white/20 transition-colors", analysisTarget === 'self' ? "text-white" : "text-white/80")}>
              <User className="w-8 h-8" />
            </div>
            <span className="font-display font-bold text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {lang === 'tr' ? 'Kendini Analiz Et' : 'Analyze Yourself'}
            </span>
          </div>
        </button>

        <button 
          onClick={() => setAnalysisTarget('partner')}
          className={cn(
            "relative h-48 rounded-[2rem] border-4 transition-all overflow-hidden flex flex-col items-center justify-center group",
            analysisTarget === 'partner' ? "border-gold shadow-xl scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-sepia/40 z-10 group-hover:bg-sepia/30 transition-colors"></div>
          <img src="/peer.png" alt="Partner Analysis" className="absolute inset-0 w-full h-full object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-500 mix-blend-multiply" />
          <div className="relative z-20 flex flex-col items-center gap-3">
            <div className={cn("p-3 rounded-2xl backdrop-blur-md bg-white/20 border border-white/20 transition-colors", analysisTarget === 'partner' ? "text-white" : "text-white/80")}>
              <User className="w-8 h-8" />
            </div>
            <span className="font-display font-bold text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {lang === 'tr' ? 'Karşındakini Analiz Et' : 'Analyze Partner'}
            </span>
          </div>
        </button>
      </div>

      <div 
        onClick={triggerFileSelect}
        className="w-full parchment-sheet border-2 border-dashed border-sepia/30 rounded-[3rem] p-16 flex flex-col items-center justify-center transition-all hover:border-sepia/50 hover:bg-sepia/5 group cursor-pointer shadow-xl hover:-translate-y-1"
      >
        <div className="w-20 h-20 bg-sepia/10 text-sepia rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-sepia group-hover:text-parchment transition-all duration-300">
          <Upload className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-display text-sepia mb-4">{t.upload.selectTitle}</h3>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60 text-sepia">{t.upload.selectSubtitle}</p>
      </div>

      <div className="w-full parchment-sheet border border-sepia/20 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-sepia to-gold"></div>
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-sepia w-6 h-6" />
          <span className="text-xs font-display font-bold uppercase text-sepia tracking-[0.2em]">{t.upload.checklistTitle}</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.upload.checklist.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <CheckCircle2 className="text-sepia w-5 h-5 shrink-0" />
              <div>
                <p className="font-display font-bold text-sepia uppercase text-[10px] tracking-widest mb-1">{item.title}</p>
                <p className="text-xs text-ink/60 leading-relaxed font-serif italic">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full flex flex-col gap-6">
        <button 
          onClick={() => onUpload({} as ChatStats)} // Or handle properly
          className="w-full py-5 parchment-sheet border border-sepia/30 text-sepia rounded-2xl font-display font-bold uppercase tracking-[0.3em] hover:bg-sepia hover:text-parchment active:scale-[0.98] shadow-lg transition-all flex items-center justify-center gap-3"
        >
          {t.upload.demoAnalysis}
          <ArrowRight className="w-5 h-5" />
        </button>
        <button 
          disabled 
          className="w-full py-5 bg-sepia/5 text-sepia/40 rounded-2xl font-display font-bold uppercase tracking-[0.3em] cursor-not-allowed flex items-center justify-center gap-3"
        >
          {t.upload.button}
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-[10px] font-display font-bold uppercase tracking-wider opacity-40 text-sepia">
          {t.upload.supported}
        </p>
      </div>
    </motion.div>
  );
}

function ProcessingView({ progress, t }: { progress: number, t: any, key?: string }) {
  const dashArray = 502; // 2 * pi * r (r=80)
  const dashOffset = dashArray - (dashArray * progress) / 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-10 space-y-12"
    >
      <div className="parchment-sheet border border-sepia/20 p-12 max-w-md w-full shadow-2xl relative z-10 rounded-[3rem]">
        <div className="flex flex-col items-center mb-12">
          <div className="relative flex items-center justify-center mb-10">
            <svg className="w-52 h-52">
              <circle className="text-sepia/5 stroke-current" cx="104" cy="104" r="80" strokeWidth="1" fill="transparent" />
              <motion.circle 
                className="text-sepia stroke-current" 
                cx="104" cy="104" r="80" 
                strokeWidth="12" 
                strokeDasharray={dashArray}
                animate={{ strokeDashoffset: dashOffset }}
                strokeLinecap="round" 
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-display text-sepia">{Math.round(progress)}%</span>
              <span className="text-[10px] font-bold text-sepia/40 uppercase tracking-[0.3em] mt-2">{t.processing.decoding}</span>
            </div>
          </div>
          <h2 className="text-4xl font-display text-sepia text-center mb-4">{t.processing.headline}</h2>
          <p className="text-sm text-ink/70 text-center px-4 leading-relaxed font-serif italic">
            {t.processing.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="text-sepia w-4 h-4" />
            <span className="text-[10px] font-bold text-sepia uppercase tracking-widest leading-none font-display">{t.processing.logTitle}</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-sepia w-5 h-5 shrink-0" />
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-sepia uppercase tracking-widest font-display">01 / {t.processing.step1}</p>
                <div className="h-1 w-full bg-sepia/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-sepia w-full" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {progress > 40 ? <CheckCircle2 className="text-sepia w-5 h-5" /> : <div className="w-2 h-2 bg-sepia rounded-full animate-ping" />}
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-sepia uppercase tracking-widest font-display">02 / {t.processing.step2}</p>
                <div className="h-1 w-full bg-sepia/10 mt-1.5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: progress > 40 ? '100%' : `${(progress/40)*100}%` }} className="h-full bg-sepia" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <div className={cn("w-2 h-2 rounded-full", progress > 70 ? "bg-sepia animate-ping" : "bg-sepia/10")} />
              </div>
              <div className={cn("flex-grow", progress > 70 ? "opacity-100" : "opacity-30")}>
                <p className="text-[10px] font-bold text-sepia uppercase tracking-widest font-display">03 / {t.processing.step3}</p>
                <div className="h-1 w-full bg-sepia/10 mt-1.5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: progress > 70 ? `${(progress-70)*3.33}%` : '0%' }} className="h-full bg-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 pt-8 border-t border-sepia/10">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain mix-blend-multiply grayscale" />
          <span className="text-[10px] font-bold text-sepia uppercase tracking-[0.2em] font-display">{t.processing.badge}</span>
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sepia/40 max-w-xs text-center leading-relaxed font-display">
        {t.processing.note}
      </p>
    </motion.div>
  );
}

function ComparisonCard({ 
  title, 
  meValue, 
  partnerValue, 
  unit, 
  t, 
  inverse = false,
  emoji
}: { 
  title: string, 
  meValue: number, 
  partnerValue: number, 
  unit: string, 
  t: any,
  inverse?: boolean,
  emoji: string
}) {
  const meColor = "var(--color-sepia)";
  const partnerColor = "var(--color-gold)";
  
  // Normalized values for the donut chart
  const total = meValue + partnerValue;
  const data = [
    { name: 'Me', value: meValue, fill: meColor },
    { name: 'Partner', value: partnerValue, fill: partnerColor },
  ];

  const mePercent = Math.round((meValue / (total || 1)) * 100);
  const partnerPercent = 100 - mePercent;

  const meIsHigher = inverse ? meValue < partnerValue : meValue > partnerValue;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="parchment-sheet border border-sepia/20 rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden group transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <p className="text-[10px] font-bold text-sepia/40 uppercase tracking-[0.2em] font-display">{title}</p>
          </div>
          <h5 className="text-2xl font-display text-sepia">{mePercent}% vs {partnerPercent}%</h5>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold text-gold uppercase tracking-widest font-display">{meIsHigher ? "PROMINENT" : "RECEPTIVE"}</p>
        </div>
      </div>

      <div className="relative h-40 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-sm" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-display text-sepia">{unit}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sepia/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meColor }}></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-sepia/40 font-display">{t.insights.comparison.me}</span>
          </div>
          <p className="text-lg font-bold text-sepia font-display">{meValue.toLocaleString()}</p>
        </div>
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[9px] font-bold uppercase tracking-widest text-sepia/40 font-display">{t.insights.comparison.partner}</span>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: partnerColor }}></div>
          </div>
          <p className="text-lg font-bold text-sepia font-display">{partnerValue.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-sepia/5 rounded-full blur-3xl group-hover:bg-sepia/10 transition-colors"></div>
    </motion.div>
  );
}

function InsightsView({ t, stats, lang, analysisTarget }: { t: any, stats: ChatStats | null, lang: Language, analysisTarget: 'self' | 'partner', key?: string }) {
  if (!stats) return null;

  const me = analysisTarget === 'self' ? stats.participants[0] : (stats.participants[1] || stats.participants[0]);
  const partner = analysisTarget === 'self' ? (stats.participants[1] || "Partner") : stats.participants[0];

  const meMetrics = {
    words: stats.wordCountPerPerson[me] || 0,
    responseTime: stats.averageResponseTime[me] || 0,
    emojis: stats.emojiCountPerPerson[me] || 0,
    doubleText: stats.doubleTextingCount[me] || 0,
    messages: stats.messagesPerPerson[me] || 0
  };

  const partnerMetrics = {
    words: stats.wordCountPerPerson[partner] || 0,
    responseTime: stats.averageResponseTime[partner] || 0,
    emojis: stats.emojiCountPerPerson[partner] || 0,
    doubleText: stats.doubleTextingCount[partner] || 0,
    messages: stats.messagesPerPerson[partner] || 0
  };

  const chartData = Object.keys(stats.hourlyActivity).map(h => ({
    name: `${h}:00`,
    value: stats.hourlyActivity[parseInt(h)]
  })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-16 py-4"
    >
      <section className="space-y-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold text-sepia uppercase tracking-[0.4em] font-display">{t.insights.category} / {new Date().getFullYear()}</span>
          <h2 className="text-7xl font-display text-sepia tracking-tighter">{t.insights.headline} {partner}</h2>
          <div className="h-1 w-32 bg-sepia mt-4" />
        </div>
        <button className="bg-sepia text-parchment px-6 py-3 rounded-2xl font-display font-bold uppercase tracking-widest hover:-translate-y-1 hover:shadow-lg hover:shadow-sepia/30 active:scale-95 transition-all flex items-center gap-2">
          📤 {t.insights.shareToStory}
        </button>
      </section>

      <section className="parchment-sheet border border-sepia/20 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sepia/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-sepia">
          <span className="text-2xl">✨</span>
          <h3 className="text-3xl font-display underline decoration-sepia decoration-1 underline-offset-8">{t.insights.synthesisTitle}</h3>
          </div>
          <div className="space-y-6 text-ink/80 text-lg leading-[1.8] font-serif italic">
            {generateLocalSynthesis(stats, lang).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="pt-8 flex flex-col gap-3 relative z-10">
            <div className="w-full h-[1px] bg-sepia/10" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-sepia/40 uppercase tracking-[0.3em] font-display">{t.insights.study}</span>
              <span className="text-[9px] font-bold text-gold uppercase tracking-[0.3em] font-display">{t.insights.confidence}: 94%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-sepia uppercase tracking-[0.3em] font-display">{t.insights.comparison.title}</h4>
          <p className="text-sm text-ink/60 font-serif italic">{t.insights.comparison.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ComparisonCard title={t.insights.comparison.wordCount} meValue={meMetrics.words} partnerValue={partnerMetrics.words} unit={t.insights.comparison.metrics.words} emoji="📝" t={t} />
          <ComparisonCard title={t.insights.comparison.responseTime} meValue={meMetrics.responseTime} partnerValue={partnerMetrics.responseTime} unit={t.insights.comparison.metrics.minutes} emoji="⏱️" inverse t={t} />
          <ComparisonCard title={t.insights.comparison.emojis} meValue={meMetrics.emojis} partnerValue={partnerMetrics.emojis} unit={t.insights.comparison.metrics.emojis} emoji="😊" t={t} />
          <ComparisonCard title={t.insights.comparison.doubleTexting} meValue={meMetrics.doubleText} partnerValue={partnerMetrics.doubleText} unit="Times" emoji="⏭️" inverse t={t} />
          <ComparisonCard title={t.insights.comparison.messages} meValue={meMetrics.messages} partnerValue={partnerMetrics.messages} unit="Msg" emoji="💬" t={t} />
        </div>
        
        {/* Activity Chart */}
        <div className="parchment-sheet border border-sepia/20 rounded-3xl p-8 shadow-xl mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h5 className="text-xl font-display text-sepia">Hourly Activity Density</h5>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sepia)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-sepia)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-sepia)" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: 'var(--color-sepia)', opacity: 0.5, fontFamily: 'Cinzel' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: 'var(--color-sepia)', opacity: 0.5, fontFamily: 'Cinzel' }}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--color-sepia)', opacity: 0.05 }}
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    backgroundColor: 'var(--color-parchment)',
                    border: '1px solid var(--color-sepia)',
                    opacity: 0.9,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontFamily: 'Cinzel',
                    color: 'var(--color-sepia)'
                  }}
                />
                <Bar dataKey="value" fill="url(#colorValue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-[10px] font-bold text-sepia uppercase tracking-[0.3em] font-display">{t.insights.signaturesTitle}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              emoji: '🌙', 
              label: t.insights.signatures.nightOwl.label, 
              title: t.insights.signatures.nightOwl.title, 
              desc: (stats.hourlyActivity[23] || 0) + (stats.hourlyActivity[0] || 0) > stats.totalMessages * 0.2 
                ? (lang === 'tr' ? "Gece saatlerinde oldukça aktifsiniz." : "Highly active during night hours.")
                : (lang === 'tr' ? "Düzenli bir uyku rutininiz var gibi görünüyor." : "You seem to have a regular sleep routine.")
            },
            { 
              emoji: '⚡', 
              label: t.insights.signatures.quickResponder.label, 
              title: t.insights.signatures.quickResponder.title, 
              desc: meMetrics.responseTime < 10 
                ? (lang === 'tr' ? "Mesajlara ışık hızında yanıt veriyorsunuz." : "You respond to messages at lightning speed.")
                : (lang === 'tr' ? "Yanıt vermeden önce düşünmeyi tercih ediyorsunuz." : "You prefer to reflect before responding.")
            },
            { 
              emoji: '❓', 
              label: t.insights.signatures.questioner.label, 
              title: t.insights.signatures.questioner.title, 
              desc: meMetrics.words / meMetrics.messages > 15
                ? (lang === 'tr' ? "Uzun ve açıklayıcı cümleler kuruyorsunuz." : "You write long and descriptive sentences.")
                : (lang === 'tr' ? "Kısa ve öz bir iletişim tarzınız var." : "You have a concise communication style.")
            },
            { 
              emoji: '💬', 
              label: t.insights.signatures.starter.label, 
              title: t.insights.signatures.starter.title, 
              desc: stats.doubleTextingCount[me] > 5
                ? (lang === 'tr' ? "Sohbeti başlatan ve sürüren taraf sizsiniz." : "You are the one starting and maintaining the chat.")
                : (lang === 'tr' ? "Dengeli bir katılım sergiliyorsunuz." : "you show balanced participation.")
            },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="parchment-sheet border border-sepia/20 rounded-3xl p-6 flex items-start gap-6 hover:-translate-y-1 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-sepia/10 text-sepia rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>
              <div>
                <p className="text-[9px] font-bold text-gold uppercase tracking-widest mb-2 leading-none font-display">{item.label}</p>
                <h5 className="text-2xl font-display text-sepia mb-2">{item.title}</h5>
                <p className="text-sm text-ink/70 leading-relaxed font-serif italic">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-sepia text-parchment p-12 flex flex-col md:flex-row items-center gap-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sepia to-gold"></div>
        <div className="absolute right-[-40px] top-[-40px] opacity-10 rotate-12 text-parchment">
          <ShieldAlert className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex-1 space-y-4">
          <h4 className="text-4xl font-display text-parchment">{t.insights.privacyGuaranteed}</h4>
          <p className="text-base text-parchment/60 leading-relaxed max-w-lg font-serif italic">
            {t.insights.privacyDesc}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button className="bg-parchment text-sepia px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-parchment transition-all active:scale-95 shadow-lg">
            {t.insights.auditSecurity}
          </button>
        </div>
      </section>
    </motion.div>
  );
}

function ProfileView({ setView, t, lang, setLang, darkMode, setDarkMode }: { setView: (v: ViewState) => void, t: any, lang: Language, setLang: (l: Language) => void, darkMode: boolean, setDarkMode: (v: boolean) => void, key?: string }) {
  const [notifications, setNotifications] = useState(true);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-12 py-10"
    >
      {/* Profile Header */}
      <section className="relative p-10 rounded-[3rem] parchment-sheet border border-sepia/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sepia/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-sepia rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl bg-parchment">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full object-cover filter grayscale contrast-125 mix-blend-multiply hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-sepia text-parchment p-2 rounded-xl shadow-lg border-2 border-parchment">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-5xl font-display text-sepia tracking-tighter">Julianne Moore</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-sepia/5 rounded-xl text-[10px] font-display font-bold text-sepia hover:bg-sepia/10 transition-colors uppercase tracking-widest">
                <Lock className="w-4 h-4" />
                {lang === 'tr' ? 'Şifreyi Değiştir' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Settings Tiles */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-sepia uppercase tracking-[0.4em] opacity-40 px-2 font-display">{t.profile.configTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Language Selection Tile */}
          <div className="p-8 parchment-sheet rounded-3xl border border-sepia/20 flex items-center justify-between group hover:border-sepia/40 transition-colors shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sepia/5 text-sepia rounded-2xl flex items-center justify-center text-xl">
                🌍
              </div>
              <div>
                <h4 className="text-lg font-display text-sepia">{t.profile.language}</h4>
                <p className="text-[9px] font-bold text-sepia/40 uppercase tracking-widest font-display">Active: {lang.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex gap-2 p-1.5 bg-sepia/5 rounded-xl border border-sepia/10">
              <button 
                onClick={() => setLang('en')}
                className={cn("px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all font-display tracking-widest", lang === 'en' ? 'bg-sepia shadow-md text-parchment' : 'text-sepia/40')}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('tr')}
                className={cn("px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all font-display tracking-widest", lang === 'tr' ? 'bg-sepia shadow-md text-parchment' : 'text-sepia/40')}
              >
                TR
              </button>
            </div>
          </div>

          {/* Other Settings Tiles */}
          <button className="p-8 parchment-sheet rounded-3xl border border-sepia/20 flex items-center justify-between group hover:bg-sepia/5 transition-all shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sepia/5 text-sepia rounded-2xl flex items-center justify-center text-xl transition-all">
                🔒
              </div>
              <div className="text-left">
                <h4 className="text-lg font-display text-sepia">{t.profile.privacy}</h4>
                <p className="text-[9px] font-bold text-sepia/40 uppercase tracking-widest font-display">{t.profile.privacyDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-sepia/20 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => setNotifications(!notifications)}
            className="p-8 parchment-sheet rounded-3xl border border-sepia/20 flex items-center justify-between group hover:bg-sepia/5 transition-all shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sepia/5 text-sepia rounded-2xl flex items-center justify-center text-xl transition-all">
                🔔
              </div>
              <div className="text-left">
                <h4 className="text-lg font-display text-sepia">{t.profile.notifications}</h4>
                <p className="text-[9px] font-bold text-sepia/40 uppercase tracking-widest font-display">{t.profile.notificationsDesc}</p>
              </div>
            </div>
            <div className={cn("w-10 h-6 rounded-full p-1 transition-colors flex shrink-0 items-center", notifications ? "bg-sepia" : "bg-sepia/20")}>
              <div className={cn("w-4 h-4 rounded-full bg-parchment transition-transform", notifications ? "translate-x-4" : "translate-x-0")} />
            </div>
          </button>
        </div>
      </section>

      <div className="pt-10 flex flex-col items-center space-y-6">
        <button 
          onClick={() => setView('welcome')}
          className="px-12 py-5 rounded-2xl bg-sepia/5 text-sepia font-display font-bold uppercase tracking-[0.3em] hover:bg-sepia hover:text-parchment transition-all active:scale-95 flex items-center gap-3 border border-sepia/20 shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          {t.profile.signOut}
        </button>
        <p className="text-[10px] font-display font-bold text-sepia/20 uppercase tracking-[0.5em]">{t.profile.aboutDesc}</p>
      </div>
    </motion.div>
  );
}

function Navigation({ setView, currentView, t }: { setView: (v: ViewState) => void, currentView: ViewState, t: any }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (currentView === 'login' || currentView === 'welcome') return null;

  const tabs = [
    { id: 'dashboard', label: t.nav.home, emoji: '🏠' },
    { id: 'upload', label: t.nav.analyze, emoji: '📂' },
    { id: 'insights', label: t.nav.insights, emoji: '✨' },
    { id: 'profile', label: t.nav.settings, emoji: '⚙️' },
  ];

  return (
    <nav className={cn(
      "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-parchment/80 backdrop-blur-md border border-sepia/20 rounded-3xl flex justify-around items-center px-4 py-3 shadow-2xl transition-transform duration-300 w-[90%] max-w-lg",
      isVisible ? "translate-y-0" : "translate-y-32"
    )}>
      {tabs.map(tab => {
        const isActive = currentView === tab.id || (tab.id === 'upload' && currentView === 'processing');
        return (
          <button 
            key={tab.id}
            onClick={() => setView(tab.id as ViewState)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 relative",
              isActive ? "text-sepia font-bold" : "text-sepia/60 hover:text-sepia"
            )}
          >
            {isActive && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 bg-sepia/10 -z-10 rounded-2xl" />
            )}
            <span className={cn("text-xl mb-0.5", isActive ? "" : "opacity-90")}>{tab.emoji}</span>
            <span className="text-[8px] font-display font-bold uppercase tracking-[0.2em]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PricingView({ setView, t }: { setView: (v: ViewState) => void, t: any, lang: Language, key?: string }) {
  const plans = [
    { id: 'free', icon: <Smile className="w-8 h-8" />, color: 'parchment-sheet', textColor: 'text-sepia' },
    { id: 'pro', icon: <Sparkles className="w-8 h-8" />, color: 'bg-sepia', textColor: 'text-parchment', popular: true },
    { id: 'unlimited', icon: <Bolt className="w-8 h-8" />, color: 'bg-gold', textColor: 'text-parchment' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-16 py-10"
    >
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-display text-sepia tracking-tight">{t.pricing.title}</h2>
        <p className="text-ink/70 leading-relaxed font-serif text-lg italic">
          {t.pricing.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => {
          const planData = t.pricing.plans[plan.id as keyof typeof t.pricing.plans];
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-[2.5rem] p-10 flex flex-col justify-between transition-all duration-300 shadow-2xl",
                plan.color,
                plan.textColor,
                plan.popular ? "scale-105 z-10 ring-4 ring-gold/20" : "opacity-90 hover:opacity-100 hover:-translate-y-2"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-parchment px-6 py-1.5 rounded-full text-[10px] font-display font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] opacity-70">{planData.name}</p>
                    <h3 className="text-4xl font-display">{planData.price}</h3>
                    <p className="text-[9px] font-display font-bold uppercase tracking-widest opacity-60 bg-current/10 w-fit px-4 py-1.5 rounded-full">{planData.limit}</p>
                  </div>
                  <div className="opacity-80">
                    {plan.icon}
                  </div>
                </div>

                <div className="space-y-5 pt-8 border-t border-current/10">
                  {planData.features.map((feature: string, j: number) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 opacity-70" />
                      <span className="text-sm font-serif italic">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={cn(
                "w-full py-5 mt-12 rounded-2xl font-display font-bold uppercase tracking-widest transition-all hover:scale-[0.98] active:scale-95 shadow-xl",
                plan.popular ? "bg-parchment text-sepia hover:bg-gold hover:text-parchment" : "bg-sepia text-parchment hover:bg-gold transition-colors"
              )}>
                {plan.id === 'free' ? t.pricing.current : t.pricing.cta}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-center pt-8">
        <button 
          onClick={() => setView('dashboard')}
          className="text-[10px] font-display font-bold text-sepia/40 uppercase tracking-widest hover:text-sepia transition-colors flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

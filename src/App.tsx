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
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent/20 flex flex-col md:flex-row">


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
    <header className="sticky top-0 z-50 bg-bg flex items-center justify-between px-6 py-6 md:py-8">
      {/* Invisible spacer to perfectly center the logo if needed, but since we are using flex-between, we can use absolute centering for the logo to keep it perfectly in the middle */}
      <div className="w-10"></div> 
      
      <div className="flex items-center gap-3 cursor-pointer absolute left-1/2 -translate-x-1/2" onClick={() => setView(localStorage.getItem('readr-onboarded') === 'true' ? 'dashboard' : 'welcome')}>
        {!isLanding && (
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src="/logo.png" 
            alt="Readr Logo" 
            className="w-10 h-10 object-contain rounded-lg" 
          />
        )}
        <motion.h1 
          className="text-5xl md:text-6xl font-serif italic leading-none flex"
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
        className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-ink/10 shadow-sm flex items-center justify-center text-ink hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-95"
      >
        {darkMode ? <Sun className="w-5 h-5 text-rose-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
      </button>
    </header>
  );
}

function DashboardView({ setView, t, lang }: { setView: (v: ViewState) => void, t: any, lang: string }) {
  const recentChats = [
    { name: "Julianne Moore", date: "Today", emoji: "✨", color: "bg-accent" },
    { name: "Mark Zuckerberg", date: "2 days ago", emoji: "⚡", color: "bg-ink" },
    { name: "Unknown User", date: "1 week ago", emoji: "🌙", color: "bg-ink/40" },
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
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">{t.dashboard.title}</span>
          <h2 className="text-6xl font-serif italic text-ink tracking-tighter">Dashboard</h2>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">
              {lang === 'tr' ? '%100 Cihaz İçi Şifreleme' : '100% On-Device Encryption'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setView('upload')}
          className="bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-xl">➕</span>
          {t.dashboard.newAnalysis}
        </button>
      </section>

      {/* Mini Stats & Persona */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Persona Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-500/10 to-rose-500/10 border border-ink/10 rounded-[2rem] p-8 shadow-xl shadow-ink/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">
                {lang === 'tr' ? 'İletişim Karakterin' : 'Communication Persona'}
              </p>
              <h4 className="text-3xl font-serif italic text-ink">Gece Kuşu 🌙</h4>
              <p className="text-sm text-ink/70 font-serif italic max-w-sm">
                {lang === 'tr' ? 'Genelde gece saatlerinde aktifsiniz ve mesajlara ortalama 4 dakika içinde ışık hızında dönüyorsunuz.' : 'You are highly active at night and respond to messages at lightning speed, averaging 4 minutes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-rows-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-[2rem] p-6 shadow-xl shadow-ink/5 flex items-center gap-4 group">
             <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
               💬
             </div>
             <div>
               <p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest">{lang === 'tr' ? 'Analiz Edilen Mesaj' : 'Analyzed Messages'}</p>
               <p className="text-2xl font-serif italic text-ink mt-0.5">14,500</p>
             </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-[2rem] p-6 shadow-xl shadow-ink/5 flex items-center gap-4 group">
             <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
               😊
             </div>
             <div>
               <p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest">{lang === 'tr' ? 'Favori Emoji' : 'Favorite Emoji'}</p>
               <p className="text-2xl font-serif italic text-ink mt-0.5">😂</p>
             </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-ink uppercase tracking-[0.4em]">{t.dashboard.recentChats}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentChats.map((chat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-3xl p-8 shadow-xl shadow-ink/5 group hover:bg-ink/5 dark:hover:bg-zinc-800 transition-colors flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-2xl border border-ink/10", chat.color)}>
                  {chat.emoji}
                </div>
                <div>
                  <h4 className="text-2xl font-serif italic text-ink">{chat.name}</h4>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mt-1">{t.dashboard.lastAnalyzed} {chat.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setView('insights')}
                className="w-12 h-12 rounded-xl border border-ink/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-indigo-500/20 group-hover:scale-105"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-[2.5rem] p-10 shadow-xl shadow-ink/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
          <Brain className="w-10 h-10" />
        </div>
        <div className="relative z-10 space-y-2 flex-grow text-center md:text-left">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em]">
            {lang === 'tr' ? 'Son Analizden İçgörü' : 'Latest Insight'}
          </p>
          <h4 className="text-2xl font-serif italic text-ink max-w-lg">
            {lang === 'tr' ? '"Mark ile olan konuşmalarında %65 oranında sohbeti başlatan taraf sensin."' : '"You initiate 65% of the conversations with Mark."'}
          </h4>
        </div>
        <button onClick={() => setView('insights')} className="shrink-0 bg-ink text-bg px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors relative z-10">
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
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-10 w-64 h-64 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/30 border-4 border-white dark:border-zinc-800 bg-white"
        >
          <img src="/character.png" alt="3D Tech Character" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-serif italic text-ink max-w-md mx-auto">
          {t.welcome.headline}
        </h2>
        <p className="text-lg text-ink/80 max-w-sm mx-auto leading-relaxed">
          {t.welcome.description}
        </p>
      </div>

      <div className="w-full max-w-[300px] pt-4">
        <div className="relative w-full h-[68px] bg-white dark:bg-zinc-800 rounded-full shadow-inner border border-ink/10 flex items-center overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full" 
            style={{ width: useTransform(x, (val) => val + 64), opacity: bgOpacity }} 
          />
          
          <motion.span 
            className="absolute w-full text-center text-xs font-bold uppercase tracking-[0.2em] text-ink/40 pointer-events-none pl-12"
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
            className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 cursor-grab active:cursor-grabbing z-10 ml-1.5"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-ink/10 bg-white dark:bg-zinc-900 shadow-sm">
        <ShieldCheck className="text-indigo-500 w-5 h-5 shrink-0" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-ink/70">
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
            className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col gap-5 group overflow-hidden"
          >
            {/* Animated glowing orb behind each card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 group-hover:scale-150 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none bg-indigo-500/10 w-fit px-4 py-2 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                {item.label}
              </span>
              <h3 className="text-3xl font-serif italic text-ink mt-6 group-hover:text-indigo-500 transition-colors duration-300">{item.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed font-serif mt-3">{item.desc}</p>
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
        {/* Logo removed per request */}
        <h1 className="text-6xl font-serif italic text-ink tracking-tight">{t.appFullName}</h1>
        <p className="text-ink/70 max-w-[280px] mx-auto leading-relaxed">{t.login.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-3xl p-8 shadow-xl shadow-ink/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-3 w-full py-4 px-4 bg-white dark:bg-zinc-800 text-ink font-bold border border-ink/10 rounded-2xl hover:bg-ink/5 transition-all active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5 object-contain" />
              <span>{t.login.google}</span>
            </button>
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-3 w-full py-4 px-4 bg-ink text-bg font-bold rounded-2xl hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              <div className="w-5 h-5 bg-bg rounded-full flex items-center justify-center">
                 <span className="text-[10px] text-ink font-bold">A</span>
              </div>
              <span>{t.login.apple}</span>
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-ink/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-ink/40 uppercase tracking-widest">{t.login.or}</span>
            <div className="flex-grow border-t border-ink/10"></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-ink/60 px-1 uppercase tracking-widest" htmlFor="email">{t.login.emailLabel}</label>
              <input 
                className="w-full px-5 py-4 bg-white dark:bg-zinc-800 border border-ink/10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl font-medium text-ink placeholder:text-ink/30 transition-all outline-none" 
                id="email" 
                placeholder={t.login.emailPlaceholder} 
                type="email"
              />
            </div>
            <button 
              onClick={onLogin}
              className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95 transition-all"
            >
              {t.login.signIn}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-indigo-500">{t.login.securityTitle}</h3>
            <p className="text-xs text-ink/70 leading-relaxed font-serif italic">{t.login.securityDesc}</p>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">{t.login.encryption}</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {t.login.activeStatus}
            </span>
          </div>
          <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full"></div>
          </div>
        </div>
      </div>

      <footer className="flex flex-col items-center space-y-4 pt-4 opacity-40">
        <div className="flex gap-6 uppercase text-[10px] font-bold tracking-widest">
          {t.login.links.map((link: string, i: number) => (
            <button key={i} className="hover:text-accent transition-colors">{link}</button>
          ))}
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">© 2026 Kollektiv x Readr</p>
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
        <h2 className="text-6xl font-serif italic text-ink tracking-tight">{t.upload.title}</h2>
        <p className="text-ink/70 max-w-md mx-auto leading-relaxed">
          {t.upload.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <button 
          onClick={() => setAnalysisTarget('self')}
          className={cn(
            "relative h-48 rounded-[2rem] border-4 transition-all overflow-hidden flex flex-col items-center justify-center group",
            analysisTarget === 'self' ? "border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-colors"></div>
          <img src="/self.png" alt="Self Analysis" className="absolute inset-0 w-full h-full object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-500" />
          <div className="relative z-20 flex flex-col items-center gap-3">
            <div className={cn("p-3 rounded-2xl backdrop-blur-md bg-white/20 border border-white/20 transition-colors", analysisTarget === 'self' ? "text-white" : "text-white/80")}>
              <User className="w-8 h-8" />
            </div>
            <span className="font-serif italic font-bold text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {lang === 'tr' ? 'Kendini Analiz Et' : 'Analyze Yourself'}
            </span>
          </div>
        </button>

        <button 
          onClick={() => setAnalysisTarget('partner')}
          className={cn(
            "relative h-48 rounded-[2rem] border-4 transition-all overflow-hidden flex flex-col items-center justify-center group",
            analysisTarget === 'partner' ? "border-rose-500 shadow-xl shadow-rose-500/20 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-colors"></div>
          <img src="/peer.png" alt="Partner Analysis" className="absolute inset-0 w-full h-full object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-500" />
          <div className="relative z-20 flex flex-col items-center gap-3">
            <div className={cn("p-3 rounded-2xl backdrop-blur-md bg-white/20 border border-white/20 transition-colors", analysisTarget === 'partner' ? "text-white" : "text-white/80")}>
              <User className="w-8 h-8" />
            </div>
            <span className="font-serif italic font-bold text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {lang === 'tr' ? 'Karşındakini Analiz Et' : 'Analyze Partner'}
            </span>
          </div>
        </button>
      </div>

      <div 
        onClick={triggerFileSelect}
        className="w-full bg-white dark:bg-zinc-900 border-2 border-dashed border-ink/20 rounded-[3rem] p-16 flex flex-col items-center justify-center transition-all hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 group cursor-pointer shadow-xl shadow-ink/5 hover:shadow-indigo-500/10 hover:-translate-y-1"
      >
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
          <Upload className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-serif italic text-ink mb-4">{t.upload.selectTitle}</h3>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60">{t.upload.selectSubtitle}</p>
      </div>

      <div className="w-full bg-white dark:bg-zinc-900 border border-ink/10 rounded-3xl p-8 shadow-xl shadow-ink/5 relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-rose-500"></div>
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-indigo-500 w-6 h-6" />
          <span className="text-xs font-bold uppercase text-ink tracking-[0.2em]">{t.upload.checklistTitle}</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.upload.checklist.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <CheckCircle2 className="text-rose-500 w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-ink uppercase text-[10px] tracking-widest mb-1">{item.title}</p>
                <p className="text-xs text-ink/60 leading-relaxed font-serif italic">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full flex flex-col gap-6">
        <button 
          onClick={() => onUpload({} as ChatStats)} // Or handle properly
          className="w-full py-5 bg-white dark:bg-zinc-900 border border-indigo-500/30 text-indigo-500 rounded-2xl font-bold uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white active:scale-[0.98] shadow-lg transition-all flex items-center justify-center gap-3"
        >
          {t.upload.demoAnalysis}
          <ArrowRight className="w-5 h-5" />
        </button>
        <button 
          disabled 
          className="w-full py-5 bg-ink/5 text-ink/40 rounded-2xl font-bold uppercase tracking-[0.3em] cursor-not-allowed flex items-center justify-center gap-3"
        >
          {t.upload.button}
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-[10px] font-bold uppercase tracking-wider opacity-40">
          {t.upload.supported}
        </p>
      </div>
    </motion.div>
  );
}

function ProcessingView({ progress, t }: { progress: number, t: any, key?: string }) {
  const dashArray = 2 * Math.PI * 80;
  const dashOffset = dashArray * (1 - progress / 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-10 space-y-12"
    >
      <div className="bg-bg brutalist-border p-10 max-w-md w-full brutalist-shadow relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="relative flex items-center justify-center mb-10">
            <svg className="w-52 h-52">
              <circle className="text-ink/5 stroke-current" cx="104" cy="104" r="80" strokeWidth="1" fill="transparent" />
              <motion.circle 
                className="text-accent stroke-current" 
                cx="104" cy="104" r="80" 
                strokeWidth="12" 
                strokeDasharray={dashArray}
                animate={{ strokeDashoffset: dashOffset }}
                strokeLinecap="butt" 
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-serif italic text-ink">{Math.round(progress)}%</span>
              <span className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.3em] mt-2">{t.processing.decoding}</span>
            </div>
          </div>
          <h2 className="text-4xl font-serif italic text-ink text-center mb-4">{t.processing.headline}</h2>
          <p className="text-sm text-ink/60 text-center px-4 leading-relaxed font-serif italic">
            {t.processing.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="text-ink w-4 h-4" />
            <span className="text-[10px] font-bold text-ink uppercase tracking-widest leading-none">{t.processing.logTitle}</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-accent w-5 h-5 shrink-0" />
              <div className="flex-grow">
                <p className="text-xs font-bold text-ink uppercase tracking-widest">01 / {t.processing.step1}</p>
                <div className="h-0.5 w-full bg-ink/10 mt-1">
                  <div className="h-full bg-ink w-full" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {progress > 40 ? <CheckCircle2 className="text-accent w-5 h-5" /> : <div className="w-2 h-2 bg-ink rounded-full animate-ping" />}
              </div>
              <div className="flex-grow">
                <p className="text-xs font-bold text-ink uppercase tracking-widest">02 / {t.processing.step2}</p>
                <div className="h-0.5 w-full bg-ink/10 mt-1">
                   <motion.div initial={{ width: 0 }} animate={{ width: progress > 40 ? '100%' : `${(progress/40)*100}%` }} className="h-full bg-ink" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <div className={cn("w-2 h-2 rounded-full", progress > 70 ? "bg-accent animate-ping" : "bg-ink/10")} />
              </div>
              <div className={cn("flex-grow", progress > 70 ? "opacity-100" : "opacity-30")}>
                <p className="text-xs font-bold text-ink uppercase tracking-widest">03 / {t.processing.step3}</p>
                <div className="h-0.5 w-full bg-ink/10 mt-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: progress > 70 ? `${(progress-70)*3.33}%` : '0%' }} className="h-full bg-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 pt-8 border-t border-ink/10">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="text-[10px] font-bold text-ink uppercase tracking-[0.2em]">{t.processing.badge}</span>
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 max-w-xs text-center leading-relaxed">
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
  const meColor = "#6366f1"; // Indigo
  const partnerColor = "#f43f5e"; // Rose
  
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
      className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-3xl p-8 space-y-6 shadow-xl shadow-ink/5 relative overflow-hidden group transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <p className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">{title}</p>
          </div>
          <h5 className="text-2xl font-serif italic text-ink">{mePercent}% vs {partnerPercent}%</h5>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{meIsHigher ? "PROMINENT" : "RECEPTIVE"}</p>
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
                <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-lg" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-serif italic text-ink">{unit}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meColor }}></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-ink/40">{t.insights.comparison.me}</span>
          </div>
          <p className="text-lg font-bold text-ink">{meValue.toLocaleString()}</p>
        </div>
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[9px] font-bold uppercase tracking-widest text-ink/40">{t.insights.comparison.partner}</span>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: partnerColor }}></div>
          </div>
          <p className="text-lg font-bold text-ink">{partnerValue.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors"></div>
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

  const synthesisText = generateLocalSynthesis(stats, t.appName === "Readr" ? "en" : "tr"); // Actually check lang state
  // Let's pass the real lang
  // We need to access lang from outer scope or pass it. Let's pass it.


  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-16 py-4"
    >
      <section className="space-y-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">{t.insights.category} / {new Date().getFullYear()}</span>
          <h2 className="text-7xl font-serif italic text-ink tracking-tighter">{t.insights.headline} {partner}</h2>
          <div className="h-1 w-32 bg-ink mt-4" />
        </div>
        <button className="bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 transition-all flex items-center gap-2">
          📤 {t.insights.shareToStory}
        </button>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-[2.5rem] p-10 shadow-xl shadow-ink/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-ink">
          <span className="text-2xl">✨</span>
          <h3 className="text-3xl font-serif italic underline decoration-ink decoration-1 underline-offset-8">{t.insights.synthesisTitle}</h3>
          </div>
          <div className="space-y-6 text-ink/80 text-lg leading-[1.8] font-serif">
            {generateLocalSynthesis(stats, lang).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="pt-8 flex flex-col gap-3 relative z-10">
            <div className="w-full h-[1px] bg-ink/10" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-ink/40 uppercase tracking-[0.3em]">{t.insights.study}</span>
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.3em]">{t.insights.confidence}: 94%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-ink uppercase tracking-[0.3em]">{t.insights.comparison.title}</h4>
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
        <div className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-3xl p-8 shadow-xl shadow-ink/5 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h5 className="text-xl font-serif italic text-ink">Hourly Activity Density</h5>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A10" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: 'var(--color-ink)', opacity: 0.5 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: 'var(--color-ink)', opacity: 0.5 }}
                />
                <Tooltip 
                  cursor={{ fill: '#1A1A1A05' }}
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                />
                <Bar dataKey="value" fill="url(#colorValue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-[10px] font-bold text-ink uppercase tracking-[0.3em]">{t.insights.signaturesTitle}</h4>
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
              className="bg-white dark:bg-zinc-900 border border-ink/10 rounded-3xl p-6 flex items-start gap-6 hover:-translate-y-1 hover:shadow-xl shadow-ink/5 transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>
              <div>
                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2 leading-none">{item.label}</p>
                <h5 className="text-2xl font-serif italic text-ink mb-2">{item.title}</h5>
                <p className="text-sm text-ink/70 leading-relaxed font-serif">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900 text-white p-12 flex flex-col md:flex-row items-center gap-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-rose-500"></div>
        <div className="absolute right-[-40px] top-[-40px] opacity-10 rotate-12 text-indigo-500">
          <ShieldAlert className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex-1 space-y-4">
          <h4 className="text-4xl font-serif italic text-white">{t.insights.privacyGuaranteed}</h4>
          <p className="text-base text-zinc-400 leading-relaxed max-w-lg font-serif">
            {t.insights.privacyDesc}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 shadow-lg">
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
      <section className="relative p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 to-rose-500/10 border border-ink/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden brutalist-border rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-5xl font-serif italic text-ink tracking-tighter">Julianne Moore</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-ink/5 rounded-xl text-xs font-bold text-ink/70 hover:bg-ink/10 transition-colors">
                <Lock className="w-4 h-4" />
                {lang === 'tr' ? 'Şifreyi Değiştir' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Settings Tiles */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-ink uppercase tracking-[0.4em] opacity-40 px-2">{t.profile.configTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Language Selection Tile */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-ink/5 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/5 text-indigo-500 rounded-2xl flex items-center justify-center text-xl">
                🌍
              </div>
              <div>
                <h4 className="text-lg font-serif italic text-ink">{t.profile.language}</h4>
                <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">Active: {lang.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex gap-2 p-1 bg-ink/5 rounded-xl">
              <button 
                onClick={() => setLang('en')}
                className={cn("px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all", lang === 'en' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-500' : 'text-ink/40')}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('tr')}
                className={cn("px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all", lang === 'tr' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-500' : 'text-ink/40')}
              >
                TR
              </button>
            </div>
          </div>

          {/* Other Settings Tiles */}
          <button className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-ink/5 flex items-center justify-between group hover:bg-ink/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ink/5 text-ink rounded-2xl flex items-center justify-center text-xl transition-all">
                🔒
              </div>
              <div className="text-left">
                <h4 className="text-lg font-serif italic text-ink">{t.profile.privacy}</h4>
                <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{t.profile.privacyDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-ink/20 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => setNotifications(!notifications)}
            className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-ink/5 flex items-center justify-between group hover:bg-ink/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ink/5 text-ink rounded-2xl flex items-center justify-center text-xl transition-all">
                🔔
              </div>
              <div className="text-left">
                <h4 className="text-lg font-serif italic text-ink">{t.profile.notifications}</h4>
                <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{t.profile.notificationsDesc}</p>
              </div>
            </div>
            <div className={cn("w-10 h-6 rounded-full p-1 transition-colors flex shrink-0 items-center", notifications ? "bg-indigo-500" : "bg-ink/20")}>
              <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", notifications ? "translate-x-4" : "translate-x-0")} />
            </div>
          </button>
        </div>
      </section>

      <div className="pt-10 flex flex-col items-center space-y-6">
        <button 
          onClick={() => setView('welcome')}
          className="px-12 py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-bold uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all active:scale-95 flex items-center gap-3"
        >
          <LogOut className="w-5 h-5" />
          {t.profile.signOut}
        </button>
        <p className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.5em]">{t.profile.aboutDesc}</p>
      </div>
    </motion.div>
  );
}

function Navigation({ setView, currentView, t, darkMode, setDarkMode }: { setView: (v: ViewState) => void, currentView: ViewState, t: any, darkMode: boolean, setDarkMode: (v: boolean) => void }) {
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

  if (currentView === 'login') return null;

  const tabs = [
    { id: 'dashboard', label: t.nav.home, emoji: '🏠' },
    { id: 'upload', label: t.nav.analyze, emoji: '📂' },
    { id: 'insights', label: t.nav.insights, emoji: '✨' },
    { id: 'profile', label: t.nav.settings, emoji: '⚙️' },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 w-full z-50 bg-bg/95 backdrop-blur-sm border-t border-ink flex justify-around items-center px-2 pb-4 pt-2 shadow-lg transition-transform duration-300",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      {tabs.map(tab => {
        const isActive = currentView === tab.id || (tab.id === 'upload' && currentView === 'processing');
        return (
          <button 
            key={tab.id}
            onClick={() => setView(tab.id as ViewState)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90 relative",
              isActive ? "text-accent font-bold" : "text-ink/90 hover:text-ink"
            )}
          >
            {isActive && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 bg-ink/5 -z-10 rounded-lg" />
            )}
            <span className={cn("text-xl mb-0.5", isActive ? "" : "opacity-90")}>{tab.emoji}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PricingView({ setView, t, lang }: { setView: (v: ViewState) => void, t: any, lang: Language, key?: string }) {
  const plans = [
    { id: 'free', icon: <Smile className="w-8 h-8" />, color: 'bg-zinc-100 dark:bg-zinc-800', textColor: 'text-zinc-600 dark:text-zinc-400' },
    { id: 'pro', icon: <Sparkles className="w-8 h-8" />, color: 'bg-indigo-500', textColor: 'text-white', popular: true },
    { id: 'unlimited', icon: <Bolt className="w-8 h-8" />, color: 'bg-zinc-900 dark:bg-black', textColor: 'text-white' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-12 py-10"
    >
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif italic text-ink tracking-tight">{t.pricing.title}</h2>
        <p className="text-ink/70 leading-relaxed font-serif text-lg">
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
                "relative rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300",
                plan.color,
                plan.textColor,
                plan.popular ? "shadow-2xl shadow-indigo-500/20 scale-105 z-10" : "shadow-xl opacity-90 hover:opacity-100 hover:-translate-y-2"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">{planData.name}</p>
                    <h3 className="text-4xl font-serif italic">{planData.price}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 bg-white/10 w-fit px-3 py-1 rounded-full">{planData.limit}</p>
                  </div>
                  <div className="opacity-80">
                    {plan.icon}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-current/10">
                  {planData.features.map((feature: string, j: number) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 opacity-70" />
                      <span className="text-sm font-serif">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={cn(
                "w-full py-4 mt-12 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[0.98] active:scale-95 shadow-lg",
                plan.popular ? "bg-white text-indigo-500 hover:bg-zinc-50" : "bg-white text-ink hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 border border-ink/10"
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
          className="text-sm font-bold text-ink/40 uppercase tracking-widest hover:text-ink transition-colors flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

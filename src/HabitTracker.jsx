import React, { useState, useEffect, useMemo } from 'react';
import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously, 
  updateProfile, 
  linkWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Check, Plus, Trash2, BarChart2, Calendar, 
  Flame, Activity, X,  TrendingUp, Target,
  Play, Pause, RotateCcw, Clock, ChevronLeft, ChevronRight, Maximize2, AlertTriangle,
  Trophy, Medal, Award, Coffee, BrainCircuit, SkipForward, PlusCircle, MinusCircle, ToggleLeft, ToggleRight,
  Edit3, User, LogOut, Mail, Lock, LogIn, ArrowRight, Star, Zap, Shield
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "___",
  projectId: "___",
  storageBucket: "___",
  messagingSenderId: "___",
  appId: "___",
  measurementId: "___"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- CRITICAL: CENTRALIZED APP ID ---
const appId = 'habit-tracker-master'; 

// --- Utility Functions ---

const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const calculateStreak = (history) => {
  if (!history) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (i === 0 && !history[dateStr]) continue; 
    if (history[dateStr]) { streak++; } else { break; }
  }
  return streak;
};

const formatDurationDisplay = (minutes) => {
  if (!minutes) return '15m';
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

// --- Constants ---
const DEFAULT_CATEGORIES = ['Health', 'Productivity', 'Learning', 'Mindfulness', 'Finance'];
const CATEGORY_COLORS = {
  Health: '#10b981',      
  Productivity: '#3b82f6', 
  Learning: '#8b5cf6',     
  Mindfulness: '#f43f5e',  
  Finance: '#f59e0b',      
  Other: '#64748b'         
};

// --- Components ---

// 1. Landing Page
const LandingPage = ({ onGuestLogin, onAuthOpen }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="w-full p-4 flex justify-between items-center relative z-20 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Check className="text-white" size={20} strokeWidth={3} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">doit</span>
        </div>
        <button 
          onClick={onAuthOpen}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 hover:border-slate-600 flex items-center gap-2 text-sm"
        >
          Log In / Sign Up <User size={16} />
        </button>
      </nav>

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-medium mb-6 shadow-lg">
            <SparkleIcon /> <span>The Ultimate Habit Companion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Build Habits That <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Actually Stick.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Visualize your progress with GitHub-style heatmaps, stay focused with a built-in Pomodoro timer, and track your streaks like a pro.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={onGuestLogin}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            Start as Guest <ArrowRight size={18} />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">Visual Analytics</h3>
            <p className="text-slate-500 text-sm">See your consistency at a glance with beautiful heatmaps and charts.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">Focus Mode</h3>
            <p className="text-slate-500 text-sm">Built-in Pomodoro timer with distraction-free "Tunnel Vision" UI.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-4">
              <Trophy size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">Gamified Streaks</h3>
            <p className="text-slate-500 text-sm">Track your best streaks and earn medals for consistency.</p>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-12">
          Your data is saved locally for guests, or securely in the cloud when you sign up.
        </p>
      </div>
    </div>
  );
};

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

// 2. Auth Modal
const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (auth.currentUser && auth.currentUser.isAnonymous) {
          const credential = EmailAuthProvider.credential(email, password);
          const userCredential = await linkWithCredential(auth.currentUser, credential);
          if (name) await updateProfile(userCredential.user, { displayName: name });
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (name) await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      let msg = "Authentication failed.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/credential-already-associated') msg = "Account already linked.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "User not found.";
      if (err.code === 'auth/weak-password') msg = "Password too weak.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 custom-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-8 rounded-2xl shadow-2xl custom-slide-up relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-white">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {isSignUp && (
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-500" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Name" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="hello@example.com" required />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all mt-6 flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        <div className="mt-6 text-center relative z-10">
          <p className="text-slate-400 text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">{isSignUp ? "Log In" : "Sign Up"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// 3. Focus Timer
const FocusTimer = ({ habit, onClose, onComplete }) => {
  const isPomodoro = habit.isPomodoro || (habit.duration || 0) >= 60;
  const estimatedCycles = Math.ceil((habit.duration || 25) / 25);
  const getInitialTime = () => isPomodoro ? 25 * 60 : (habit.duration || 25) * 60;

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(getInitialTime());
  const [pomodoroMode, setPomodoroMode] = useState('work'); 
  const [pomodoroCycle, setPomodoroCycle] = useState(1);
  const [isMounted, setIsMounted] = useState(false); 
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const bgTimer = setTimeout(() => setIsMounted(true), 50);
    const contentTimer = setTimeout(() => setShowContent(true), 1050);
    return () => { clearTimeout(bgTimer); clearTimeout(contentTimer); };
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      try { new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-bell-notification-929.mp3').play().catch(()=>{}); } catch (e) {}
      
      if (isPomodoro) {
        if (pomodoroMode === 'work') {
          setPomodoroMode('break'); setTimeLeft(5 * 60); setInitialTime(5 * 60);
        } else {
          setPomodoroMode('work'); setPomodoroCycle(c => c + 1); setTimeLeft(25 * 60); setInitialTime(25 * 60);
        }
      } else {
        onComplete(habit); 
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isPomodoro, pomodoroMode, habit, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    if (isPomodoro) {
      setPomodoroMode('work'); setPomodoroCycle(1); setTimeLeft(25 * 60); setInitialTime(25 * 60);
    } else {
      setTimeLeft((habit.duration || 25) * 60); setInitialTime((habit.duration || 25) * 60);
    }
  };
  const skipPhase = () => {
    setIsActive(false);
    if (pomodoroMode === 'work') {
      setPomodoroMode('break'); setTimeLeft(5 * 60); setInitialTime(5 * 60);
    } else {
      setPomodoroMode('work'); setPomodoroCycle(c => c + 1); setTimeLeft(25 * 60); setInitialTime(25 * 60);
    }
  };
  const adjustTime = (mins) => {
    setTimeLeft(prev => Math.max(60, prev + mins * 60));
    setInitialTime(prev => Math.max(60, prev + mins * 60));
  };
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const timeString = formatTime(timeLeft);
  const fontSizeClass = timeString.length > 5 ? 'text-6xl' : 'text-8xl';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isMounted ? 'bg-slate-950/60 backdrop-blur-3xl opacity-100' : 'bg-slate-950/0 backdrop-blur-none opacity-0'}`}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.5)_60%,rgba(2,6,23,0.9)_100%)] z-0" />
      <button onClick={onClose} className={`absolute top-6 right-6 text-slate-500 hover:text-white transition-all duration-1000 z-20 ${showContent ? 'opacity-100' : 'opacity-0'}`}><X size={32} /></button>
      <div className={`text-center space-y-8 relative z-10 transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="space-y-3">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-2xl text-center line-clamp-2 break-words leading-tight">{habit.title}</h2>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            {isPomodoro ? (
              <>
                 {pomodoroMode === 'work' ? (
                  <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20"><BrainCircuit size={16} /><span className="uppercase tracking-widest text-xs font-bold shadow-black drop-shadow-lg">Focus Cycle {pomodoroCycle}</span></div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20"><Coffee size={16} /><span className="uppercase tracking-widest text-xs font-bold shadow-black drop-shadow-lg">Break Time</span></div>
                )}
                <div className="flex items-center gap-1.5 mt-2 opacity-70">
                  {Array.from({ length: Math.max(estimatedCycles, pomodoroCycle + 1) }).map((_, i) => {
                    const isPast = i + 1 < pomodoroCycle; const isCurrent = i + 1 === pomodoroCycle;
                    return <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${isCurrent ? 'w-6 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'w-1.5 bg-slate-700'} ${isPast ? 'bg-blue-900' : ''}`} />
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-blue-400"><Activity size={18} /><span className="uppercase tracking-widest text-sm font-semibold shadow-black drop-shadow-lg">Focus Mode</span></div>
            )}
          </div>
        </div>
        {/* Added mx-auto to fix the alignment issue with long titles */}
        <div className="relative w-80 h-80 flex items-center justify-center group mx-auto">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke={isPomodoro && pomodoroMode === 'break' ? '#10b981' : '#3b82f6'} strokeWidth="2" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} className="transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          </svg>
          <div className="flex flex-col items-center z-10">
            <div className={`${fontSizeClass} font-mono font-bold text-white tabular-nums tracking-tighter transition-all drop-shadow-2xl`}>{timeString}</div>
            <div className="text-slate-400 font-mono text-sm mt-2 tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{Math.round(progress)}%</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6 justify-center">
            <button onClick={resetTimer} className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"><RotateCcw size={24} /></button>
            <button onClick={toggleTimer} className={`p-6 rounded-full transition-all transform hover:scale-105 ${isActive ? 'bg-amber-500 hover:bg-amber-400 text-slate-900' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" ml="1" />}</button>
            {isPomodoro && <button onClick={skipPhase} className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"><SkipForward size={24} /></button>}
          </div>
          {isPomodoro && <div className="flex items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300"><button onClick={() => adjustTime(-5)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full hover:bg-slate-800 transition-colors"><MinusCircle size={14} /> 5m</button><button onClick={() => adjustTime(5)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full hover:bg-slate-800 transition-colors"><PlusCircle size={14} /> 5m</button></div>}
        </div>
      </div>
    </div>
  );
};

// 4. Heatmap (Unchanged)
const Heatmap = ({ habits }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const startYear = useMemo(() => {
    if (!habits || habits.length === 0) return new Date().getFullYear();
    const years = habits.map(h => h.createdAt?.seconds ? new Date(h.createdAt.seconds * 1000).getFullYear() : new Date().getFullYear()).filter(y => !isNaN(y));
    return years.length > 0 ? Math.min(...years) : new Date().getFullYear();
  }, [habits]);

  const yearData = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const weeks = [];
    let currentWeek = new Array(7).fill(null);
    for (let i = 0; i < startDate.getDay(); i++) currentWeek[i] = null; 
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().split('T')[0];
      let completedCount = 0;
      habits.forEach(h => { if (h.history && h.history[dateStr]) completedCount++; });
      let intensity = 0;
      if (habits.length > 0) {
        const ratio = completedCount / habits.length;
        if (ratio > 0) intensity = 1;
        if (ratio > 0.25) intensity = 2;
        if (ratio > 0.5) intensity = 3;
        if (ratio > 0.75) intensity = 4;
      }
      currentWeek[dayOfWeek] = { date: dateStr, intensity, count: completedCount };
      if (dayOfWeek === 6) { weeks.push(currentWeek); currentWeek = new Array(7).fill(null); }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.some(d => d !== null)) weeks.push(currentWeek);
    return weeks;
  }, [habits, selectedYear]);

  const getColor = (intensity) => {
    switch(intensity) {
      case 0: return 'bg-slate-800/50 border-slate-800';
      case 1: return 'bg-green-900/40 border-green-900';
      case 2: return 'bg-green-700/60 border-green-700';
      case 3: return 'bg-green-500/80 border-green-500';
      case 4: return 'bg-green-400 border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]';
      default: return 'bg-transparent border-transparent';
    }
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-300 text-sm font-bold tracking-wider flex items-center gap-2"><Calendar size={16} className="text-blue-400" /> YEARLY CONSISTENCY</h3>
        <div className="flex items-center gap-4 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button onClick={() => setSelectedYear(y => y - 1)} disabled={selectedYear <= startYear} className={`p-1 hover:text-white text-slate-400 transition-colors ${selectedYear <= startYear ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronLeft size={16}/></button>
          <span className="text-sm font-bold text-white min-w-[3rem] text-center">{selectedYear}</span>
          <button onClick={() => setSelectedYear(y => y + 1)} className="p-1 hover:text-white text-slate-400 transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-1.5 min-w-max mx-auto">
          <div className="flex flex-col gap-1.5 mr-2 pt-[2px] sticky left-0 bg-slate-900/50 backdrop-blur-sm z-10 pr-2">
            {['', 'M', '', 'W', '', 'F', ''].map((d, i) => <div key={i} className="h-3 text-[10px] text-slate-500 leading-3 text-right w-4">{d}</div>)}
          </div>
          {yearData.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((day, dIndex) => (
                <div key={day ? day.date : `empty-${wIndex}-${dIndex}`} title={day ? `${day.date}: ${day.count} habits` : ''} className={`w-3 h-3 rounded-[2px] border ${day ? getColor(day.intensity) : 'border-transparent'} ${day ? 'transition-all duration-300 hover:scale-125 hover:z-10' : ''}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Add Habit Modal (Unchanged)
const AddHabitModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [duration, setDuration] = useState(15); 
  const [isPomodoro, setIsPomodoro] = useState(false);

  useEffect(() => {
    if (isOpen) { setTitle(''); setDuration(15); setIsPomodoro(false); setCategory(DEFAULT_CATEGORIES[0]); setIsCustomCat(false); setCustomCategory(''); }
  }, [isOpen]);

  useEffect(() => { if (parseInt(duration) < 60 && isPomodoro) setIsPomodoro(false); }, [duration, isPomodoro]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = isCustomCat ? (customCategory || 'Other') : category;
    onAdd({ title, category: finalCategory, duration: parseInt(duration), isPomodoro });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 custom-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl custom-slide-up">
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">New Habit</h2><button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-slate-400 text-sm mb-1">Habit Name</label><input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Read Book" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-slate-400 text-sm mb-1">Duration (mins)</label><div className="relative"><input type="number" min="1" max="300" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500" /><Clock size={16} className="absolute left-3 top-3.5 text-slate-500" /></div></div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => { setCategory(cat); setIsCustomCat(false); }} className={`p-2 rounded-lg text-xs font-medium border transition-all ${!isCustomCat && category === cat ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{cat}</button>
              ))}
              <button type="button" onClick={() => setIsCustomCat(true)} className={`p-2 rounded-lg text-xs font-medium border transition-all ${isCustomCat ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>Other...</button>
            </div>
            {isCustomCat && <div className="mt-2 custom-fade-in"><input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Enter category name..." className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus /></div>}
          </div>
          {parseInt(duration) >= 60 && (
            <div onClick={() => setIsPomodoro(!isPomodoro)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isPomodoro ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
              <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${isPomodoro ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}><BrainCircuit size={20} /></div><div><div className={`font-medium ${isPomodoro ? 'text-blue-400' : 'text-slate-300'}`}>Pomodoro Mode</div><div className="text-xs text-slate-500">Focus cycles + Break intervals</div></div></div>
              {isPomodoro ? <ToggleRight size={24} className="text-blue-500" /> : <ToggleLeft size={24} className="text-slate-500" />}
            </div>
          )}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 mt-2">Create Habit</button>
        </form>
      </div>
    </div>
  );
};

// 6. Confirmation Modal (Unchanged)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
     <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 custom-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm p-6 rounded-2xl shadow-2xl custom-slide-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-red-500" size={24} /></div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3><p className="text-slate-400 text-sm mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
            <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Stats View (Unchanged)
const StatsView = ({ habits }) => {
  const metrics = useMemo(() => {
    const totalHabits = habits.length; let maxStreak = 0; let completedToday = 0; const today = getTodayStr();
    habits.forEach(h => { if (h.streak > maxStreak) maxStreak = h.streak; if (h.history && h.history[today]) completedToday++; });
    return { totalHabits, maxStreak, completionRate: totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0 };
  }, [habits]);

  const sortedHabits = useMemo(() => [...habits].sort((a, b) => b.streak - a.streak).slice(0, 6), [habits]);
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; const data = []; const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i); const dayName = days[d.getDay()]; const dateStr = d.toISOString().split('T')[0];
      const dayStats = { name: dayName, Other: 0 }; DEFAULT_CATEGORIES.forEach(cat => dayStats[cat] = 0);
      habits.forEach(h => { if (h.history && h.history[dateStr]) { const cat = DEFAULT_CATEGORIES.includes(h.category) ? h.category : 'Other'; dayStats[cat]++; } });
      data.push(dayStats);
    }
    return data; 
  }, [habits]);
  const categoryData = useMemo(() => { const counts = {}; habits.forEach(h => { counts[h.category] = (counts[h.category] || 0) + 1; }); return Object.keys(counts).map(key => ({ name: key, value: counts[key] })); }, [habits]);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-500" /> Overall Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center"><Target className="text-blue-400 mb-2" size={24} /><div className="text-3xl font-bold text-white">{metrics.completionRate}%</div><div className="text-xs text-slate-500 font-medium">Daily Completion</div></div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center"><TrendingUp className="text-emerald-400 mb-2" size={24} /><div className="text-3xl font-bold text-white">{metrics.maxStreak}</div><div className="text-xs text-slate-500 font-medium">Best Current Streak</div></div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center"><Activity className="text-violet-400 mb-2" size={24} /><div className="text-3xl font-bold text-white">{metrics.totalHabits}</div><div className="text-xs text-slate-500 font-medium">Active Habits</div></div>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> Streak Leaderboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedHabits.map((h, i) => {
             let RankIcon = null; let rankColor = "text-slate-500"; let ringColor = "border-slate-800";
             if (i === 0) { RankIcon = Trophy; rankColor = "text-yellow-400"; ringColor = "border-yellow-500/30"; }
             else if (i === 1) { RankIcon = Medal; rankColor = "text-slate-300"; ringColor = "border-slate-400/30"; }
             else if (i === 2) { RankIcon = Medal; rankColor = "text-amber-700"; ringColor = "border-amber-700/30"; }
             return (
               <div key={h.id} className={`flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border ${ringColor} transition-all`}>
                  <div className="flex items-center gap-4"><div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold bg-slate-800/50 ${rankColor}`}>{RankIcon ? <RankIcon size={18} /> : <span>{i + 1}</span>}</div><div><div className="font-semibold text-slate-200">{h.title}</div><div className="text-xs text-slate-500">{h.category}</div></div></div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800"><Flame size={14} className={h.streak > 0 ? "text-orange-500" : "text-slate-600"} fill={h.streak > 0 ? "currentColor" : "none"} /><span className="font-mono font-bold text-white">{h.streak}</span></div>
               </div>
             );
          })}
          {habits.length === 0 && <div className="col-span-2 text-center text-slate-500 py-8 italic">No active habits to rank.</div>}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-indigo-500" /> Analytics</h3>
        <div className="space-y-6">
          <Heatmap habits={habits} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
              <h4 className="text-slate-300 text-xs font-bold tracking-wider mb-6">WEEKLY BREAKDOWN</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} /><YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} /><Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} cursor={{fill: '#1e293b'}} />
                    {DEFAULT_CATEGORIES.map((cat, index) => <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} radius={index === DEFAULT_CATEGORIES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
              <h4 className="text-slate-300 text-xs font-bold tracking-wider mb-6">FOCUS AREAS</h4>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value" stroke="none">{categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Other']} />)}</Pie>
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} /><Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={8} formatter={(value) => <span className="text-slate-400 text-xs ml-1">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// 8. Main App Controller
export default function HabitTracker() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTimerHabit, setActiveTimerHabit] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, habitId: null });

  // Manually injected CSS styles for consistent animations
  const animationStyles = `
    @keyframes customFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes customSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes customSlideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes customSlideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
    .custom-fade-in { animation: customFadeIn 0.4s ease-out forwards; }
    .custom-slide-up { animation: customSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .custom-slide-in-right { animation: customSlideInRight 0.5s ease-out forwards; }
    .custom-slide-in-left { animation: customSlideInLeft 0.5s ease-out forwards; }
    .custom-scrollbar::-webkit-scrollbar { height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
  `;

  useEffect(() => {
    // Removed the automatic guest login here.
    // Now, it just listens. If no user (null), it sets user to null, loading false.
    // This triggers the Landing Page render.
    const initAuth = async () => {
      try {
        // We still check for the environment token just in case it's present, 
        // but we don't fallback to anonymous auth anymore.
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.log("Auth init check failed, staying logged out.");
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setHabits([]); // Clear habits if no user
      return;
    }
    // Sync habits for the logged-in user
    const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'habits'));
    const unsubscribeSnapshot = onSnapshot(q, 
      (snapshot) => {
        const habitsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHabits(habitsList);
      },
      (error) => console.error("Error fetching habits:", error)
    );
    return () => unsubscribeSnapshot();
  }, [user]);

  const addHabit = async (habitData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'habits'), {
        ...habitData, createdAt: serverTimestamp(), history: {}, streak: 0
      });
    } catch (err) { console.error(err); }
  };

  const confirmDeleteHabit = (id) => { setConfirmModal({ isOpen: true, habitId: id }); };
  const executeDeleteHabit = async () => {
    if (!confirmModal.habitId) return;
    try { await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'habits', confirmModal.habitId)); } catch (err) { console.error(err); }
  };

  const toggleHabit = async (habit, forceComplete = false) => {
    const today = getTodayStr();
    const newHistory = { ...habit.history };
    const isCompletedToday = !!newHistory[today];
    if (forceComplete) { newHistory[today] = true; } else { if (isCompletedToday) { delete newHistory[today]; } else { newHistory[today] = true; } }
    const newStreak = calculateStreak(newHistory);
    try { await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'habits', habit.id), { history: newHistory, streak: newStreak }); } catch (err) { console.error(err); }
  };

  const handleTimerComplete = (habit) => {
    setActiveTimerHabit(null);
    if (!habit.history || !habit.history[getTodayStr()]) { toggleHabit(habit, true); }
  };

  const handleSignOut = async () => {
    try { await signOut(auth); setIsUserMenuOpen(false); } catch (error) { console.error("Error signing out:", error); }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try { await signInAnonymously(auth); } catch (error) { console.error("Guest login failed:", error); }
  };

  const getCategoryColorClass = (cat) => {
    switch (cat) {
      case 'Health': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Productivity': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Learning': return 'text-violet-400 bg-violet-400/10 border-violet-400/20';
      case 'Mindfulness': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Finance': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-sans">
        <Activity className="animate-spin mr-2" /> Loading do_it app...
      </div>
    );
  }

  // If not logged in, show Landing Page
  if (!user) {
    return (
      <>
        <style>{animationStyles}</style>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <LandingPage onGuestLogin={handleGuestLogin} onAuthOpen={() => setIsAuthModalOpen(true)} />
      </>
    );
  }

  // Logged In View (Dashboard/Stats)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <style>{animationStyles}</style>
      {activeTimerHabit && <FocusTimer habit={activeTimerHabit} onClose={() => setActiveTimerHabit(null)} onComplete={handleTimerComplete} />}
      <ConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={executeDeleteHabit} title="Delete Habit?" message="This action cannot be undone." />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20"><Check className="text-white" size={20} strokeWidth={3} /></div>
            <span className="text-xl font-bold text-white tracking-tight">do_it</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Habits</button>
            <button onClick={() => setView('stats')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'stats' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Stats</button>
          </div>
          <div className="relative">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"><User size={20} /></button>
            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 custom-fade-in">
                <div className="px-4 py-2 border-b border-slate-800 mb-2"><div className="font-bold text-white truncate">{user.isAnonymous ? 'Guest' : user.displayName || 'User'}</div><div className="text-xs text-slate-500 truncate">{user.isAnonymous ? 'Anonymous Session' : user.email}</div></div>
                {!user.isAnonymous ? (
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2"><LogOut size={16} /> Sign Out</button>
                ) : (
                  <button onClick={() => { setIsAuthModalOpen(true); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-slate-800 flex items-center gap-2 font-medium"><User size={16} /> Link Account</button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 overflow-hidden">
        <div key={view} className={view === 'dashboard' ? 'custom-slide-in-left' : 'custom-slide-in-right'}>
          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div><h1 className="text-3xl font-bold text-white mb-2">Today's Focus</h1><p className="text-slate-400">You have {habits.filter(h => !h.history[getTodayStr()]).length} habits left to complete.</p></div>
                <button onClick={() => setIsModalOpen(true)} className="group flex items-center gap-2 bg-white text-slate-950 px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-all active:scale-95"><Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> New Habit</button>
              </div>
              {habits.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20"><div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 shadow-inner"><Target size={32} /></div><h3 className="text-xl font-bold text-white mb-2">No habits yet</h3><p className="text-slate-500 max-w-sm mx-auto mb-8">Consistency starts with a single step.</p><button onClick={() => setIsModalOpen(true)} className="text-blue-400 hover:text-blue-300 font-semibold">Create Habit &rarr;</button></div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {habits.map(habit => {
                    const isCompleted = !!habit.history[getTodayStr()];
                    const colorClass = getCategoryColorClass(habit.category);
                    return (
                      <div key={habit.id} className={`group relative flex items-center justify-between bg-slate-900/80 border ${isCompleted ? 'border-emerald-500/20' : 'border-slate-800'} rounded-2xl p-4 transition-all hover:bg-slate-900 hover:border-slate-700`}>
                        <div className="flex items-center gap-4 z-10 w-full">
                          <button onClick={() => toggleHabit(habit)} className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105' : 'bg-slate-800 text-slate-600 hover:bg-slate-700 hover:text-slate-400 border border-slate-700'}`}><Check size={26} strokeWidth={isCompleted ? 4 : 3} /></button>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-lg truncate transition-all ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{habit.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5"><span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${colorClass}`}>{habit.category}</span><span className={`flex items-center gap-1 text-xs font-medium ${isCompleted ? 'text-slate-600' : 'text-orange-400'}`}><Flame size={12} fill={isCompleted ? "none" : "currentColor"} /> {habit.streak} day streak</span><span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {formatDurationDisplay(habit.duration)} goal</span></div>
                          </div>
                          <div className="flex items-center gap-2">
                             {!isCompleted && <button onClick={() => setActiveTimerHabit(habit)} className="p-3 rounded-xl bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:opacity-100" title="Start Focus Timer"><Play size={20} fill="currentColor" /></button>}
                             <button onClick={() => confirmDeleteHabit(habit.id)} className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                          </div>
                        </div>
                        {isCompleted && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {view === 'stats' && <div><StatsView habits={habits} /></div>}
        </div>
      </main>
      <AddHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addHabit} />
    </div>
  );
}
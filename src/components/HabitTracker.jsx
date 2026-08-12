import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signOut 
} from 'firebase/auth';
import { 
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
  Check, Plus, Trash2, Target,
  Play, User, LogOut, Flame, Clock, Settings, Moon, Sun
} from 'lucide-react';

import { createPortal } from 'react-dom';
import { auth, db, appId } from '../firebase/config';
import { getTodayStr, calculateStreak, formatDurationDisplay } from '../utils/helpers';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

import LandingPage from './LandingPage';
import AuthModal from './AuthModal';
import EditProfileModal from './EditProfileModal';
import FocusTimer from './FocusTimer';
import AddHabitModal from './AddHabitModal';
import ConfirmationModal from './ConfirmationModal';
import StatsView from './StatsView';
import BackgroundGlow from './BackgroundGlow';

// 8. Main App Controller
export default function HabitTracker() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [view, setView] = useState('dashboard');
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'new' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTimerHabit, setActiveTimerHabit] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, habitId: null });
  const userButtonRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const initAuth = async () => {
      try {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <BackgroundGlow />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-border border-t-foreground rounded-full mb-4"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <BackgroundGlow />
        <LandingPage onGuestLogin={handleGuestLogin} onAuthOpen={() => setIsAuthModalOpen(true)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-foreground/20 transition-colors duration-500 pb-20">
      <BackgroundGlow />
      <AnimatePresence>
        {activeTimerHabit && (
          <FocusTimer habit={activeTimerHabit} onClose={() => setActiveTimerHabit(null)} onComplete={handleTimerComplete} />
        )}
      </AnimatePresence>
      
      <ConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ isOpen: false, habitId: null })} onConfirm={executeDeleteHabit} title="Delete Habit" message="Are you sure you want to delete this habit? This action cannot be undone." />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} user={user} />

      <nav className="sticky top-0 z-40 border-b border-white/20 dark:border-white/10 transition-colors bg-[rgba(255,255,255,0.15)] dark:bg-transparent backdrop-blur-[40px] backdrop-saturate-[1.8]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg border border-border flex items-center justify-center bg-foreground/5 dark:bg-transparent">
              <img src="/logo.png" alt="doit logo" className="w-5 h-5 object-contain drop-shadow-md" />
            </div>
            <span className="text-xl font-bold tracking-tight">doit</span>
          </div>
          <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border border-border">
            <button onClick={() => setView('dashboard')} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", view === 'dashboard' ? "shadow-sm" : "text-foreground/60 hover:text-foreground")} style={view === 'dashboard' ? {background:'#0f172a', color:'#fff'} : {}}>Habits</button>
            <button onClick={() => setView('stats')} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", view === 'stats' ? "shadow-sm" : "text-foreground/60 hover:text-foreground")} style={view === 'stats' ? {background:'#0f172a', color:'#fff'} : {}}>Stats</button>
          </div>
          <div className="relative flex items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button ref={userButtonRef} onClick={() => { const r = userButtonRef.current?.getBoundingClientRect(); if(r) setMenuPos({ top: r.bottom + 8, right: window.innerWidth - r.right }); setIsUserMenuOpen(!isUserMenuOpen); }} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors bg-[rgba(255,255,255,0.2)] dark:bg-slate-800/40 backdrop-blur-[20px] border border-[rgba(255,255,255,0.35)] dark:border-white/10"><User size={20} /></button>
          </div>
        </div>
      </nav>

      {/* User Menu rendered via portal so z-index is never clipped by stacking context */}
      {createPortal(
        <AnimatePresence>
          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-[998]" onClick={() => setIsUserMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 999 }}
                className="w-60 rounded-2xl py-2 overflow-hidden bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(15,23,42,0.85)] backdrop-blur-[40px] backdrop-saturate-200 border border-[rgba(255,255,255,0.5)] dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              >
                <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 mb-1">
                  <div className="font-semibold text-foreground truncate text-sm">{user?.isAnonymous ? 'Guest Account' : user?.displayName || 'User'}</div>
                  <div className="text-xs text-foreground/50 truncate mt-0.5">{user?.isAnonymous ? 'Local Storage Only' : user?.email}</div>
                </div>
                <div className="flex flex-col px-1">
                  {!user?.isAnonymous && (
                    <button onClick={() => { setIsEditProfileModalOpen(true); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-3 font-medium transition-colors rounded-xl"><User size={15} /> Edit Profile</button>
                  )}
                  {user?.isAnonymous && (
                    <button onClick={() => { setIsAuthModalOpen(true); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-3 font-medium transition-colors rounded-xl"><User size={15} /> Link Account</button>
                  )}
                  <button onClick={() => { handleSignOut(); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 font-medium transition-colors rounded-xl"><LogOut size={15} /> {user?.isAnonymous ? 'Leave Guest Mode' : 'Sign Out'}</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <main className="max-w-4xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Today's Focus</h1>
                  <p className="text-foreground/50 font-medium">You have {habits.filter(h => !h.history[getTodayStr()]).length} habits left to complete.</p>
                </div>
                <button 
                  onClick={() => setModalState({ isOpen: true, mode: 'new' })} 
                  className="group flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95" style={{background:'#0f172a', color:'#fff'}}
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
                  <span className="hidden sm:inline">New Habit</span>
                </button>
              </div>
              
              {habits.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 glass-card border-dashed rounded-3xl"
                >
                  <div className="w-20 h-20 bg-background/50 border border-border rounded-full flex items-center justify-center mx-auto mb-6 text-foreground/40 shadow-inner">
                    <Target size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No habits yet</h3>
                  <p className="text-foreground/50 max-w-sm mx-auto mb-8">Consistency starts with a single step. Create your first habit today.</p>
                  <button onClick={() => setModalState({ isOpen: true, mode: 'new' })} className="text-foreground hover:opacity-70 font-semibold underline decoration-foreground/30 underline-offset-4">Create Habit</button>
                </motion.div>
              ) : (
                <motion.div layout className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {habits.map(habit => {
                      const isCompleted = !!habit.history[getTodayStr()];
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3 }}
                          key={habit.id} 
                          className={cn(
                            "group relative flex items-center justify-between p-5 transition-all rounded-2xl glass-card glass-glow border overflow-hidden",
                            isCompleted ? "border-cyan-400/30" : "border-border hover:border-foreground/30 hover:bg-background/80"
                          )}
                        >
                          <div className="flex items-center gap-5 z-10 w-full">
                            <button 
                              onClick={() => toggleHabit(habit)} 
                              className={cn(
                                "w-14 h-14 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500",
                                isCompleted ? "border-transparent scale-105" : "border-border hover:border-foreground/30 hover:bg-black/5 dark:hover:bg-white/5"
                              )} style={isCompleted 
                                ? {background:'linear-gradient(135deg, #0ea5e9, #3b82f6)', color:'#fff', boxShadow:'0 4px 20px rgba(14,165,233,0.45)'} 
                                : {}}
                            >
                              <Check size={26} strokeWidth={isCompleted ? 4 : 2} />
                            </button>
                            <div className="flex-1 min-w-0">
                              <h3 className={cn("font-bold text-lg truncate transition-all duration-500", isCompleted ? "text-foreground/40 line-through" : "text-foreground")}>{habit.title}</h3>
                              <div className="flex flex-wrap items-center gap-4 mt-2">
                                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md border border-border bg-background/50 text-foreground/70">{habit.category}</span>
                                <span className={cn("flex items-center gap-1.5 text-xs font-semibold", isCompleted ? "text-foreground/40" : "text-foreground/80")}>
                                  <Flame size={14} fill={isCompleted ? "none" : "currentColor"} /> {habit.streak} streak
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
                                  <Clock size={14} /> {formatDurationDisplay(habit.duration)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {!isCompleted && (
                                 <button 
                                   onClick={() => setActiveTimerHabit(habit)} 
                                   className="p-3 rounded-xl bg-background/50 text-foreground hover:bg-sky-500 hover:text-white transition-all border border-border hover:border-transparent group-hover:opacity-100 shadow-sm" 
                                   title="Start Focus Timer"
                                 >
                                   <Play size={20} fill="currentColor" />
                                 </button>
                               )}
                               <button 
                                 onClick={() => confirmDeleteHabit(habit.id)} 
                                 className="p-3 text-foreground/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                               >
                                 <Trash2 size={20} />
                               </button>
                            </div>
                          </div>
                          {isCompleted && <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent pointer-events-none" />}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StatsView habits={habits} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {createPortal(<AddHabitModal isOpen={modalState.isOpen} mode={modalState.mode} onClose={() => setModalState(s => ({ ...s, isOpen: false }))} onRequestOpen={(m) => setModalState({ isOpen: true, mode: m })} onAdd={addHabit} />, document.body)}
    </div>
  );
}

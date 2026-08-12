import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Coffee, Activity, X, RotateCcw, Pause, Play, SkipForward, MinusCircle, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const FocusTimer = ({ habit, onClose, onComplete }) => {
  const isPomodoro = habit.isPomodoro || (habit.duration || 0) >= 60;
  const estimatedCycles = Math.ceil((habit.duration || 25) / 25);
  const getInitialTime = () => isPomodoro ? 25 * 60 : (habit.duration || 25) * 60;

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(getInitialTime());
  const [pomodoroMode, setPomodoroMode] = useState('work'); 
  const [pomodoroCycle, setPomodoroCycle] = useState(1);

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-background/90 backdrop-blur-3xl z-0" 
      />
      
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute top-8 right-8 text-foreground/50 hover:text-foreground transition-all z-20"
      >
        <X size={32} />
      </motion.button>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-12 relative z-10 w-full max-w-xl px-4"
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground tracking-wide text-center line-clamp-2 leading-tight">
            {habit.title}
          </h2>
          
          <div className="flex flex-col items-center gap-3">
            {isPomodoro ? (
              <>
                 {pomodoroMode === 'work' ? (
                  <div className="flex items-center gap-2 text-foreground bg-foreground/10 px-4 py-1.5 rounded-full border border-foreground/20">
                    <BrainCircuit size={16} />
                    <span className="uppercase tracking-widest text-xs font-bold">Focus Cycle {pomodoroCycle}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-foreground bg-foreground/10 px-4 py-1.5 rounded-full border border-foreground/20">
                    <Coffee size={16} />
                    <span className="uppercase tracking-widest text-xs font-bold">Break Time</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 opacity-80">
                  {Array.from({ length: Math.max(estimatedCycles, pomodoroCycle + 1) }).map((_, i) => {
                    const isPast = i + 1 < pomodoroCycle; const isCurrent = i + 1 === pomodoroCycle;
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          isCurrent ? "w-8 bg-foreground shadow-[0_0_10px_currentColor]" : "w-2 bg-foreground/20",
                          isPast ? "bg-foreground/60" : ""
                        )} 
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-foreground/80">
                <Activity size={18} />
                <span className="uppercase tracking-widest text-sm font-semibold">Focus Mode</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative w-80 h-80 flex items-center justify-center group mx-auto">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-border opacity-50" strokeWidth="1" />
            <motion.circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke="currentColor" 
              className="text-foreground drop-shadow-[0_0_10px_currentColor]"
              strokeWidth="2" 
              strokeDasharray="289" 
              animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <div className={cn(fontSizeClass, "font-mono font-bold text-foreground tabular-nums tracking-tighter transition-all drop-shadow-xl")}>
              {timeString}
            </div>
            <div className="text-foreground/40 font-mono text-sm mt-2 tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 items-center">
          <div className="flex items-center gap-8">
            <button onClick={resetTimer} className="p-4 rounded-full bg-background/50 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-all border border-border">
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={toggleTimer} 
              className={cn(
                "p-6 rounded-full transition-all transform hover:scale-105 shadow-xl",
                isActive ? "bg-white/20 text-foreground border border-white/30 backdrop-blur-md" : ""
              )}
              style={!isActive ? { background: '#0f172a', color: '#fff' } : {}}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            {isPomodoro && (
              <button onClick={skipPhase} className="p-4 rounded-full bg-background/50 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-all border border-border">
                <SkipForward size={24} />
              </button>
            )}
          </div>
          
          {isPomodoro && (
            <div className="flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => adjustTime(-5)} className="text-xs text-foreground/50 hover:text-foreground flex items-center gap-1 px-4 py-1.5 rounded-full hover:bg-foreground/5 transition-colors border border-transparent hover:border-border">
                <MinusCircle size={14} /> 5m
              </button>
              <button onClick={() => adjustTime(5)} className="text-xs text-foreground/50 hover:text-foreground flex items-center gap-1 px-4 py-1.5 rounded-full hover:bg-foreground/5 transition-colors border border-transparent hover:border-border">
                <PlusCircle size={14} /> 5m
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FocusTimer;

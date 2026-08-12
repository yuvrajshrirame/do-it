import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, CheckCircle, Sun, Moon, Zap, CloudLightning, Timer, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

const LandingPage = ({ onGuestLogin, onAuthOpen }) => {
  const { theme, toggleTheme } = useTheme();

  const reviews = [
    "Finally, a tracker that isn't a spreadsheet.",
    "The glass design is absolutely stunning.",
    "Fast, minimal, and gets out of my way.",
    "Streaks actually feel rewarding now.",
    "The Pomodoro timer integration is genius.",
    "Seamless sync across all my devices."
  ];

  return (
    <div className="min-h-screen flex flex-col relative font-sans items-center justify-start pt-24 overflow-x-hidden">
      
      {/* Absolute Minimal Navbar */}
      <nav className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-border flex items-center justify-center bg-foreground/5 dark:bg-transparent">
            <img src="/logo.png" alt="doit logo" className="w-5 h-5 object-contain drop-shadow-md" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">doit.</span>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors hidden sm:flex"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-5xl px-6 relative z-20 flex flex-col items-center">
        
        {/* 1. Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mb-10 mt-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">routine.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 font-medium">
            Track habits, build streaks, and achieve your goals with a fluid, beautiful experience designed for deep focus.
          </p>
        </motion.div>

        {/* The 2 Core Buttons Centered Above Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center items-center gap-6 mb-16"
        >
          <button 
            onClick={onGuestLogin}
            className="px-8 py-3 rounded-xl font-semibold text-sm transition-transform shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-[#0f172a] dark:bg-sky-500 text-[#ffffff]"
          >
            Continue as Guest
          </button>
          <button 
            onClick={onAuthOpen}
            className="px-8 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm bg-[rgba(255,255,255,0.18)] dark:bg-slate-800/50 backdrop-blur-[20px] border border-[rgba(255,255,255,0.4)] dark:border-white/10 text-inherit"
          >
            Sign In with Account
          </button>
        </motion.div>

        {/* High-Fidelity Apple-Style App Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          {/* Floating UI Debris for Spatial Depth */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -left-12 top-20 z-30 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl hidden md:flex"
          >
            <Flame className="text-orange-500" size={20} />
            <div className="font-semibold text-sm">12 Day Streak!</div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -right-8 bottom-32 z-30 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl hidden md:flex"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
              <CheckCircle size={14} />
            </div>
            <div className="font-semibold text-sm">Task Completed</div>
          </motion.div>

          {/* Original Mockup */}
          <div className="rounded-2xl overflow-hidden relative bg-[rgba(255,255,255,0.18)] dark:bg-[rgba(15,23,42,0.6)] backdrop-blur-[40px] backdrop-saturate-[1.8] backdrop-brightness-105 border border-[rgba(255,255,255,0.45)] dark:border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.15),0_8px_32px_rgba(6,182,212,0.08),inset_0_1px_0_rgba(255,255,255,0.55)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.4),0_8px_32px_rgba(6,182,212,0.15)]">
            
            {/* macOS Style Window Header */}
            <div className="h-12 border-b border-white/10 dark:border-white/5 bg-background/40 flex items-center px-4 gap-2 relative backdrop-blur-md">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-medium text-foreground/40 font-mono">
                doit.uraj.dev
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-transparent to-background/10">
              
              {/* Sidebar/Stats Mockup */}
              <div className="col-span-1 space-y-6">
                <div className="p-5 rounded-2xl border border-white/10 bg-background/50 shadow-sm flex flex-col gap-1">
                  <div className="text-sm font-medium text-foreground/50">Current Streak</div>
                  <div className="text-3xl font-bold flex items-center gap-2 text-foreground">
                    <Flame className="text-orange-500" size={28} /> 42 Days
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-background/50 shadow-sm flex flex-col gap-1">
                  <div className="text-sm font-medium text-foreground/50">Completion Rate</div>
                  <div className="text-3xl font-bold flex items-center gap-2 text-cyan-500">
                    <Activity size={28} /> 94%
                  </div>
                </div>
              </div>

              {/* Main Feed Mockup */}
              <div className="col-span-1 md:col-span-2 space-y-4 pointer-events-none">
                {/* Habit Item */}
                <div className="p-4 rounded-2xl border border-white/10 bg-background/60 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Deep Work (Coding)</div>
                      <div className="text-xs text-foreground/50">2 hours daily</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 text-xs font-semibold">
                    Done
                  </div>
                </div>

                {/* Habit Item */}
                <div className="p-4 rounded-2xl border border-white/10 bg-background/30 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-background/50 flex items-center justify-center text-foreground/30">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Read 10 Pages</div>
                      <div className="text-xs text-foreground/50">Morning routine</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-white/10 text-foreground/50 text-xs font-semibold">
                    Pending
                  </div>
                </div>
                
                {/* Fake Heatmap */}
                <div className="mt-8 p-5 rounded-2xl border border-white/10 bg-background/50 shadow-sm">
                  <div className="text-sm font-medium text-foreground/50 mb-4">Activity</div>
                  <div className="grid grid-rows-7 grid-flow-col gap-1 overflow-x-auto pb-4 custom-scrollbar">
                    {Array.from({length: 84}).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-3 h-3 rounded-sm border",
                          Math.random() > 0.3 ? "bg-cyan-500 border-cyan-400" : "bg-gray-200 border-gray-300 dark:bg-white/10 dark:border-white/5",
                          Math.random() > 0.8 && "bg-cyan-400 border-cyan-300"
                        )}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Wide */}
          <div className="col-span-1 md:col-span-2 p-8 rounded-3xl glass-card relative overflow-hidden group flex flex-col justify-end min-h-[250px]">
            <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
              <CloudLightning size={80} className="text-sky-500 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Seamless Cloud Sync</h3>
            <p className="text-foreground/60 max-w-sm">
              Your habits sync instantly across all your devices using real-time Firebase architecture. Start on your phone, finish on your desktop.
            </p>
          </div>

          {/* Card 2: Square */}
          <div className="col-span-1 p-8 rounded-3xl glass-card relative overflow-hidden group flex flex-col justify-end min-h-[250px]">
            <div className="absolute top-8 right-8 opacity-50 group-hover:opacity-100 transition-opacity">
              <Timer size={60} className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Deep Focus</h3>
            <p className="text-foreground/60">
              Built-in Pomodoro timer to crush your intense habits.
            </p>
          </div>

          {/* Card 3: Square */}
          <div className="col-span-1 p-8 rounded-3xl glass-card relative overflow-hidden group flex flex-col justify-end min-h-[250px]">
            <div className="absolute top-8 right-8 opacity-50 group-hover:opacity-100 transition-opacity">
              <Flame size={60} className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Smart Streaks</h3>
            <p className="text-foreground/60">
              Visual activity heatmaps and intelligent streak tracking.
            </p>
          </div>

          {/* Card 4: Wide */}
          <div className="col-span-1 md:col-span-2 p-8 rounded-3xl glass-card relative overflow-hidden group flex flex-col justify-end min-h-[250px]">
            <div className="absolute top-8 right-8 opacity-50 group-hover:opacity-100 transition-opacity">
              <Zap size={80} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Keyboard First</h3>
            <p className="text-foreground/60 max-w-sm">
              Navigate, check off habits, and start timers entirely with your keyboard. Designed for power users who hate touching the mouse.
            </p>
          </div>
        </motion.div>

      </div>

      {/* Social Proof Marquee */}
      <div className="w-full mt-32 relative overflow-hidden flex flex-col items-center py-10 border-y border-white/5 bg-[rgba(255,255,255,0.02)] dark:bg-[rgba(0,0,0,0.1)]">
        
        {/* Gradient Fades for edges */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#f0f4ff] dark:from-[#020817] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#f0f4ff] dark:from-[#020817] to-transparent z-10"></div>
        
        <div className="flex w-max group">
          
          {/* First Set */}
          <div className="flex gap-8 px-4 min-w-max animate-marquee group-hover:[animation-play-state:paused]">
            {reviews.map((review, i) => (
              <div key={`set1-${i}`} className="flex items-center gap-3 px-6 py-3 rounded-full glass border border-white/20 whitespace-nowrap shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-foreground/80">{review}</span>
              </div>
            ))}
          </div>

          {/* Second Identical Set for Seamless Loop */}
          <div className="flex gap-8 px-4 min-w-max animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
            {reviews.map((review, i) => (
              <div key={`set2-${i}`} className="flex items-center gap-3 px-6 py-3 rounded-full glass border border-white/20 whitespace-nowrap shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-foreground/80">{review}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-auto pt-16 pb-8 px-6 text-sm text-foreground/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="doit logo" className="w-4 h-4 opacity-50 grayscale" />
          <span>© 2026 doit. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/yuvrajshrirame/do-it" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="https://github.com/yuvrajshrirame/do-it" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="https://github.com/yuvrajshrirame/do-it" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

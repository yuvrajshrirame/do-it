import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BrainCircuit, ToggleRight, ToggleLeft, Check, PenLine, Maximize2 } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../constants';
import { cn } from '../lib/utils';



const AddHabitModal = ({ isOpen, mode, onClose, onRequestOpen, onAdd }) => {
  const getSavedDraft = () => {
    const saved = localStorage.getItem('habitDraft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Failed to parse draft", e); }
    }
    return null;
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [duration, setDuration] = useState(15);
  const [isPomodoro, setIsPomodoro] = useState(false);
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHoveringBar, setIsHoveringBar] = useState(false);
  
  // Track if we currently have a saved draft to show the chip when closed
  const [hasDraft, setHasDraft] = useState(() => getSavedDraft() !== null);
  const [draftName, setDraftName] = useState(() => getSavedDraft()?.title || 'New Habit');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'draft') {
        const d = getSavedDraft();
        if (d) {
          setTitle(d.title ?? '');
          setCategory(d.category ?? DEFAULT_CATEGORIES[0]);
          setCustomCategory(d.customCategory ?? '');
          setIsCustomCat(d.isCustomCat ?? false);
          setDuration(d.duration ?? 15);
          setIsPomodoro(d.isPomodoro ?? false);
        }
      } else if (mode === 'new') {
        setTitle('');
        setCategory(DEFAULT_CATEGORIES[0]);
        setCustomCategory('');
        setIsCustomCat(false);
        setDuration(15);
        setIsPomodoro(false);
      }
      setIsMinimized(false); 
      setIsMaximized(false);
    }
  }, [isOpen, mode]);

  const checkIsEmpty = () => {
    return title.trim() === '' && 
           parseInt(duration) === 15 && 
           category === DEFAULT_CATEGORIES[0] && 
           !isCustomCat && 
           !isPomodoro;
  };

  const handleClose = () => {
    localStorage.removeItem('habitDraft');
    setHasDraft(false);
    onClose();
  };

  const handleMinimize = () => {
    if (checkIsEmpty()) {
      handleClose();
    } else {
      setIsMinimized(true);
    }
  };

  // Keep localStorage updated ONLY if we are editing the draft, OR if we minimize a 'new' habit
  useEffect(() => {
    if (isOpen && (mode === 'draft' || isMinimized)) {
      if (checkIsEmpty()) {
        localStorage.removeItem('habitDraft');
        setHasDraft(false);
      } else {
        const draft = { title, duration, isPomodoro, category, customCategory, isCustomCat };
        localStorage.setItem('habitDraft', JSON.stringify(draft));
        setHasDraft(true);
        setDraftName(title.trim() ? title : 'New Habit');
      }
    }
  }, [title, duration, isPomodoro, category, customCategory, isCustomCat, isOpen, mode, isMinimized]);

  useEffect(() => {
    if (parseInt(duration) < 60 && isPomodoro) setIsPomodoro(false);
  }, [duration, isPomodoro]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = isCustomCat ? (customCategory || 'Other') : category;
    onAdd({ title, category: finalCategory, duration: parseInt(duration), isPomodoro });
    
    // If we submitted the draft (or a minimized habit that became a draft), clear it
    if (mode === 'draft' || isMinimized) {
      localStorage.removeItem('habitDraft');
      setHasDraft(false);
    }
    
    onClose();
  };

  const windowAnimate = isMaximized
    ? { opacity: 1, scale: 1, y: 0, width: '90vw' }
    : { opacity: 1, scale: 1, y: 0, width: '28rem' };

  const windowTransition = {
    type: 'spring', bounce: 0.18, duration: 0.5,
    width: { type: 'spring', bounce: 0.15, duration: 0.5 },
  };

  // Draft chip should show if the modal is explicitly minimized, OR if it's closed but a draft exists
  const showDraftChip = (isOpen && isMinimized) || (!isOpen && hasDraft);

  return (
    <>
      {/* ── Floating Draft Chip ── */}
      <AnimatePresence>
        {showDraftChip && (
          <motion.button
            key="draft-chip"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.85 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            onClick={() => {
              if (!isOpen) {
                onRequestOpen('draft');
              } else {
                setIsMinimized(false);
              }
            }}
            className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer group bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(15,23,42,0.85)] backdrop-blur-[30px] border border-[rgba(200,210,230,0.6)] dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15),0_0_0_1px_rgba(14,165,233,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(14,165,233,0.15)] text-[#0f172a] dark:text-slate-200"
          >
            {/* Pulsing dot to indicate it's a live draft */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#0ea5e9' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#0ea5e9' }} />
            </span>

            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] dark:text-slate-400">Draft</span>
              <span className="text-sm font-semibold truncate max-w-[140px] text-[#0f172a] dark:text-slate-200">{isOpen ? (title.trim() ? title : 'New Habit') : draftName}</span>
            </div>

            <Maximize2
              size={14}
              className="ml-1 transition-transform group-hover:scale-110 text-[#94a3b8] dark:text-slate-400"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Full Modal (shown when not minimized) ── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              style={{ background: 'rgba(2,6,23,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              onClick={handleMinimize}
            />

            {/* macOS Window */}
            <motion.div
              key="window"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={windowAnimate}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={windowTransition}
              className="relative z-10 rounded-2xl bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(15,23,42,0.85)] backdrop-blur-[20px] border border-[rgba(200,210,230,0.6)] dark:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.18)] text-[#0f172a] dark:text-slate-100"
              style={{
                maxWidth: '90vw',
                overflow: 'hidden',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* ── macOS Title Bar ── */}
              <div
                className="flex items-center px-4 h-11 relative select-none border-b border-[rgba(0,0,0,0.08)] dark:border-white/10 bg-[rgba(240,243,250,0.95)] dark:bg-slate-800/80"
                onMouseEnter={() => setIsHoveringBar(true)}
                onMouseLeave={() => setIsHoveringBar(false)}
              >
                <div className="flex gap-2">
                  {/* Red — Close */}
                  <button type="button" onClick={handleClose}
                    className="w-3 h-3 rounded-full flex items-center justify-center transition-all hover:brightness-90"
                    style={{ background: '#ff5f57', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)' }}
                  >
                    {isHoveringBar && <span className="text-[7px] font-black text-red-900 leading-none">✕</span>}
                  </button>
                  {/* Yellow — Minimize to corner */}
                  <button type="button" onClick={handleMinimize}
                    className="w-3 h-3 rounded-full flex items-center justify-center transition-all hover:brightness-90"
                    style={{ background: '#febc2e', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)' }}
                    title="Minimize to corner"
                  >
                    {isHoveringBar && <span className="text-[7px] font-black text-yellow-900 leading-none">−</span>}
                  </button>
                  {/* Green — Maximize */}
                  <button type="button" onClick={() => setIsMaximized(v => !v)}
                    className="w-3 h-3 rounded-full flex items-center justify-center transition-all hover:brightness-90"
                    style={{ background: '#28c840', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)' }}
                    title={isMaximized ? 'Restore' : 'Maximize'}
                  >
                    {isHoveringBar && <span className="text-[7px] font-black text-green-900 leading-none">+</span>}
                  </button>
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wide flex items-center gap-1.5 text-[#64748b] dark:text-slate-400">
                  <PenLine size={11} /> {mode === 'draft' || isMinimized ? (title.trim() ? title : 'New Habit') : 'New Habit'}
                </span>
              </div>

              {/* ── Form Content ── */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Habit Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#64748b] dark:text-slate-400">Habit Name</label>
                  <input
                    type="text" required value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Read 10 pages"
                    className="rounded-xl p-3 text-sm placeholder:text-slate-400 transition-all w-full outline-none focus:ring-2 focus:ring-sky-500/50 bg-[rgba(255,255,255,0.5)] dark:bg-slate-800/60 border border-[rgba(0,0,0,0.1)] dark:border-white/10 text-[#0f172a] dark:text-slate-200"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#64748b] dark:text-slate-400">Duration (mins)</label>
                  <div className="relative">
                    <input
                      type="number" min="1" max="300" value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="rounded-xl p-3 pl-10 text-sm transition-all w-full outline-none focus:ring-2 focus:ring-sky-500/50 bg-[rgba(255,255,255,0.5)] dark:bg-slate-800/60 border border-[rgba(0,0,0,0.1)] dark:border-white/10 text-[#0f172a] dark:text-slate-200"
                    />
                    <Clock size={15} className="absolute left-3 top-3.5 text-[#94a3b8] dark:text-slate-400" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#64748b] dark:text-slate-400">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DEFAULT_CATEGORIES.map(cat => {
                      const isSelected = !isCustomCat && category === cat;
                      return (
                        <button key={cat} type="button"
                          onClick={() => { setCategory(cat); setIsCustomCat(false); }}
                          className={cn(
                            "p-2.5 rounded-xl text-xs font-semibold transition-all relative border",
                            isSelected 
                              ? "bg-gradient-to-br from-sky-500 to-blue-500 text-white border-sky-400/40 shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
                              : "bg-[rgba(248,250,252,0.9)] dark:bg-slate-800/80 border-[rgba(0,0,0,0.08)] dark:border-white/10 text-[#475569] dark:text-slate-300 hover:brightness-95 dark:hover:bg-slate-700"
                          )}
                        >
                          {isSelected && <Check size={9} className="absolute top-1 right-1 opacity-70" />}
                          {cat}
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => setIsCustomCat(true)}
                      className={cn(
                        "p-2.5 rounded-xl text-xs font-semibold transition-all border",
                        isCustomCat 
                          ? "bg-gradient-to-br from-sky-500 to-blue-500 text-white border-sky-400/40 shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
                          : "bg-[rgba(248,250,252,0.9)] dark:bg-slate-800/80 border-[rgba(0,0,0,0.08)] dark:border-white/10 text-[#475569] dark:text-slate-300 hover:brightness-95 dark:hover:bg-slate-700"
                      )}
                    >
                      + Custom
                    </button>
                  </div>

                  <AnimatePresence>
                    {isCustomCat && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-3"
                      >
                        <input
                          type="text" value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Type category name..."
                          className="rounded-xl p-3 text-sm placeholder:text-slate-400 transition-all w-full outline-none focus:ring-2 focus:ring-sky-500/50 bg-[rgba(255,255,255,0.5)] dark:bg-slate-800/60 border border-[rgba(0,0,0,0.1)] dark:border-white/10 text-[#0f172a] dark:text-slate-200"
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Pomodoro */}
                <AnimatePresence>
                  {parseInt(duration) >= 60 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        onClick={() => setIsPomodoro(!isPomodoro)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border",
                          isPomodoro
                            ? "bg-[rgba(14,165,233,0.1)] dark:bg-sky-500/20 border-[rgba(14,165,233,0.25)] dark:border-sky-500/40"
                            : "bg-[rgba(248,250,252,0.9)] dark:bg-slate-800/80 border-[rgba(0,0,0,0.08)] dark:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <BrainCircuit size={18} className={isPomodoro ? "text-[#0ea5e9]" : "text-[#94a3b8] dark:text-slate-400"} />
                          <div>
                            <div className={cn("font-semibold text-sm", isPomodoro ? "text-[#0f172a] dark:text-white" : "text-[#475569] dark:text-slate-300")}>Pomodoro Mode</div>
                            <div className="text-xs text-[#94a3b8] dark:text-slate-400">Focus cycles + break intervals</div>
                          </div>
                        </div>
                        {isPomodoro ? <ToggleRight size={22} className="text-[#0ea5e9]" /> : <ToggleLeft size={22} className="text-[#cbd5e1] dark:text-slate-600" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-px w-full bg-[rgba(0,0,0,0.07)] dark:bg-white/10" />

                <button type="submit"
                  className="w-full text-white font-semibold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(14,165,233,0.35)] bg-gradient-to-br from-sky-500 to-blue-500 hover:brightness-110"
                >
                  Create Habit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddHabitModal;

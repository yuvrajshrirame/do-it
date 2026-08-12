import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

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
      case 0: return 'bg-white/5 dark:bg-white/5 border-white/5';
      case 1: return 'bg-cyan-500/20 border-cyan-500/30';
      case 2: return 'bg-cyan-500/40 border-cyan-500/50';
      case 3: return 'bg-cyan-500/70 border-cyan-500/80';
      case 4: return 'bg-cyan-400 border-cyan-300';
      default: return 'bg-transparent border-transparent';
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl glass-glow overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent z-0 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-foreground/80 text-sm font-bold tracking-wider flex items-center gap-2">
          <Calendar size={16} className="text-foreground" /> YEARLY CONSISTENCY
        </h3>
        <div className="flex items-center gap-4 bg-background/50 p-1.5 rounded-xl border border-border shadow-inner">
          <button 
            onClick={() => setSelectedYear(y => y - 1)} 
            disabled={selectedYear <= startYear} 
            className={cn("p-1 transition-colors rounded-lg", selectedYear <= startYear ? "opacity-30 cursor-not-allowed" : "hover:bg-foreground/10 hover:text-foreground text-foreground/60")}
          >
            <ChevronLeft size={16}/>
          </button>
          <span className="text-sm font-bold text-foreground min-w-[3rem] text-center">{selectedYear}</span>
          <button 
            onClick={() => setSelectedYear(y => y + 1)} 
            className="p-1 hover:bg-foreground/10 hover:text-foreground text-foreground/60 transition-colors rounded-lg"
          >
            <ChevronRight size={16}/>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 custom-scrollbar relative z-10">
        <div className="flex gap-1.5 min-w-max mx-auto">
          <div className="flex flex-col gap-1.5 mr-2 pt-[2px] sticky left-0 bg-card/80 backdrop-blur-md z-10 pr-2">
            {['', 'M', '', 'W', '', 'F', ''].map((d, i) => <div key={i} className="h-3 text-[10px] text-foreground/50 font-medium leading-3 text-right w-4">{d}</div>)}
          </div>
          {yearData.map((week, wIndex) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: wIndex * 0.01 }}
              key={wIndex} 
              className="flex flex-col gap-1.5"
            >
              {week.map((day, dIndex) => (
                <div 
                  key={day ? day.date : `empty-${wIndex}-${dIndex}`} 
                  title={day ? `${day.date}: ${day.count} habits` : ''} 
                  className={cn(
                    "w-3 h-3 rounded-[3px] border transition-all duration-300", 
                    day ? getColor(day.intensity) : 'border-transparent',
                    day ? 'hover:scale-150 hover:z-20' : ''
                  )} 
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;

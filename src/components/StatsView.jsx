import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, Target, TrendingUp, Trophy, Medal, Flame, BarChart2 } from 'lucide-react';
import Heatmap from './Heatmap';
import { DEFAULT_CATEGORIES } from '../constants';
import { getTodayStr } from '../utils/helpers';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const StatsView = ({ habits }) => {
  const { theme } = useTheme();
  
  // Use monochrome colors for charts
  const chartColors = [
    '#0ea5e9', // Sky 500
    '#3b82f6', // Blue 500
    '#6366f1', // Indigo 500
    '#8b5cf6', // Violet 500
    '#14b8a6', // Teal 500
    '#06b6d4', // Cyan 500
  ];

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
  
  const categoryData = useMemo(() => { 
    const counts = {}; 
    habits.forEach(h => { counts[h.category] = (counts[h.category] || 0) + 1; }); 
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })); 
  }, [habits]);

  const tooltipStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    borderRadius: '12px',
    color: 'var(--card-foreground)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <motion.section variants={itemVariants}>
        <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity size={16} className="text-foreground" /> Overall Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center glass-glow">
            <Target className="text-foreground mb-3 opacity-80" size={28} />
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">{metrics.completionRate}%</div>
            <div className="text-xs text-foreground/50 font-bold uppercase tracking-widest mt-2">Daily Completion</div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center glass-glow">
            <TrendingUp className="text-foreground mb-3 opacity-80" size={28} />
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">{metrics.maxStreak}</div>
            <div className="text-xs text-foreground/50 font-bold uppercase tracking-widest mt-2">Best Current Streak</div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center glass-glow">
            <Activity className="text-foreground mb-3 opacity-80" size={28} />
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">{metrics.totalHabits}</div>
            <div className="text-xs text-foreground/50 font-bold uppercase tracking-widest mt-2">Active Habits</div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-foreground" /> Streak Leaderboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedHabits.map((h, i) => {
             let RankIcon = null; 
             let rankStyle = "text-foreground/50 bg-background/50"; 
             
             if (i === 0) { 
               RankIcon = Trophy; 
               rankStyle = ""; 
             } else if (i === 1) { 
               RankIcon = Medal; 
               rankStyle = ""; 
             } else if (i === 2) { 
               RankIcon = Medal; 
             }

             return (
               <div key={h.id} className="flex items-center justify-between p-5 glass-card rounded-2xl glass-glow group transition-all hover:bg-background/80">
                  <div className="flex items-center gap-5">
                     <div 
                       className={cn("w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all", i >= 3 ? "text-foreground/50" : "")}
                       style={
                         i === 0 ? {background:'linear-gradient(135deg, #f59e0b, #d97706)', color:'#fff', boxShadow:'0 4px 16px rgba(245,158,11,0.4)'} :
                         i === 1 ? {background:'linear-gradient(135deg, #94a3b8, #64748b)', color:'#fff', boxShadow:'0 4px 16px rgba(148,163,184,0.3)'} :
                         i === 2 ? {background:'linear-gradient(135deg, #c2724f, #a0522d)', color:'#fff', boxShadow:'0 4px 16px rgba(194,114,79,0.3)'} :
                         {background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)'}
                       }
                     >
                      {RankIcon ? <RankIcon size={20} /> : <span>{i + 1}</span>}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg">{h.title}</div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{h.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-xl border border-border">
                    <Flame size={16} className={h.streak > 0 ? "text-foreground" : "text-foreground/30"} fill={h.streak > 0 ? "currentColor" : "none"} />
                    <span className="font-mono font-bold text-foreground text-lg">{h.streak}</span>
                  </div>
               </div>
             );
          })}
          {habits.length === 0 && <div className="col-span-2 text-center text-foreground/40 py-12 italic glass-card rounded-3xl border-dashed">No active habits to rank.</div>}
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-4 flex items-center gap-2">
          <BarChart2 size={16} className="text-foreground" /> Analytics
        </h3>
        <div className="space-y-6">
          <Heatmap habits={habits} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl glass-glow">
              <h4 className="text-foreground/80 text-xs font-bold tracking-wider mb-6">WEEKLY BREAKDOWN</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="currentColor" className="text-foreground/40" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="currentColor" className="text-foreground/40" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'var(--foreground)', opacity: 0.05}} />
                    {DEFAULT_CATEGORIES.map((cat, index) => 
                      <Bar key={cat} dataKey={cat} stackId="a" fill={chartColors[index % chartColors.length]} radius={index === DEFAULT_CATEGORIES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-3xl glass-glow">
              <h4 className="text-foreground/80 text-xs font-bold tracking-wider mb-6">FOCUS AREAS</h4>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => 
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      )}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={8} formatter={(value) => <span className="text-foreground/70 text-xs ml-1 font-medium uppercase tracking-wider">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default StatsView;

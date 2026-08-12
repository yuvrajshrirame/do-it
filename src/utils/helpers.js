export const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const calculateStreak = (history) => {
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

export const formatDurationDisplay = (minutes) => {
  if (!minutes) return '15m';
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

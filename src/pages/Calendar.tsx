import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Calendar() {
  const { subscriptions, currency } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonthDaysCount = firstDayOfMonth;
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from({ length: prevMonthDaysCount }, (_, i) => prevMonthLastDay - prevMonthDaysCount + i + 1);
  
  const totalCells = 42; // 6 rows * 7 days
  const nextMonthDaysCount = totalCells - days.length - prevMonthDays.length;
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  const getRenewalForDay = (day: number, mOffset: number) => {
    const targetDate = new Date(year, month + mOffset, day);
    const dateStr = targetDate.toISOString().split('T')[0];
    return subscriptions.find(s => s.nextRenewal === dateStr && s.status === 'Active');
  };

  const getColorClass = (cost: number) => {
    if (cost > 500) return 'bg-red-500';
    if (cost > 200) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center sm:text-left">Renewal Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualize your upcoming payments across the month.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <span className="font-bold text-slate-900 dark:text-white min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {prevMonthDays.map(day => {
            const renewal = getRenewalForDay(day, -1);
            return (
              <div key={`prev-${day}`} className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/50 dark:bg-slate-800/20">
                <span className="text-sm font-medium text-slate-300 dark:text-slate-700">{day}</span>
                {renewal && (
                  <div className={`mt-2 p-2 rounded-lg ${getColorClass(renewal.cost)} text-white shadow-sm opacity-50`}>
                    <p className="text-[10px] font-bold truncate">{renewal.name}</p>
                    <p className="text-[10px] opacity-90">{currency.symbol}{renewal.cost}</p>
                  </div>
                )}
              </div>
            );
          })}
          {days.map(day => {
            const renewal = getRenewalForDay(day, 0);
            return (
              <div key={day} className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 last:border-r-0 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className="text-sm font-medium text-slate-400 dark:text-slate-600">{day}</span>
                {renewal && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-2 p-2 rounded-lg ${getColorClass(renewal.cost)} text-white shadow-sm cursor-pointer hover:brightness-110 transition-all`}
                  >
                    <p className="text-[10px] font-bold truncate">{renewal.name}</p>
                    <p className="text-[10px] opacity-90">{currency.symbol}{renewal.cost}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
          {nextMonthDays.map(day => {
            const renewal = getRenewalForDay(day, 1);
            return (
              <div key={`next-${day}`} className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/50 dark:bg-slate-800/20">
                <span className="text-sm font-medium text-slate-300 dark:text-slate-700">{day}</span>
                {renewal && (
                  <div className={`mt-2 p-2 rounded-lg ${getColorClass(renewal.cost)} text-white shadow-sm opacity-50`}>
                    <p className="text-[10px] font-bold truncate">{renewal.name}</p>
                    <p className="text-[10px] opacity-90">{currency.symbol}{renewal.cost}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">High Cost (&gt;{currency.symbol}500)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Medium Cost ({currency.symbol}200-{currency.symbol}500)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Low Cost (&lt;{currency.symbol}200)</span>
        </div>
      </div>
    </div>
  );
}

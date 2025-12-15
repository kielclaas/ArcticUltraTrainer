import React, { useEffect, useRef } from 'react';
import { WEEKS } from '../services/planData';
import { isBetween } from '../services/engine';
import { HistoryEntry } from '../types';

interface Props {
  currentDate: string;
  history: HistoryEntry[];
}

export const WeeklyVolumeChart: React.FC<Props> = ({ currentDate, history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper: Calculate actual hours for a given week
  const getActualHours = (weekStart: string, weekEnd: string): number => {
    const total = history
      .filter(h => h.date >= weekStart && h.date <= weekEnd)
      .reduce((sum, h) => sum + h.duration_min, 0);
    return Math.round((total / 60) * 10) / 10; // hours with 1 decimal
  };

  // Helper: Check if week is in the past (ended before today)
  const isPastWeek = (weekEnd: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return weekEnd < today;
  };

  const maxHours = Math.max(...WEEKS.map(w => w.hours_target)) + 1;

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        const container = scrollRef.current;
        
        // Calculate position to center the active element horizontally within the container
        // without triggering a vertical page scroll (which scrollIntoView does)
        const scrollLeft = activeEl.offsetLeft + (activeEl.offsetWidth / 2) - (container.offsetWidth / 2);

        container.scrollTo({ 
          left: scrollLeft, 
          behavior: 'smooth' 
        });
      }
    }
  }, [currentDate]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Wochenziele (Stunden)</h3>
        <span className="text-xs text-slate-400">Plan-Verlauf</span>
      </div>

      {/* Added pt-10 to prevent tooltip clipping */}
      <div className="relative w-full overflow-x-auto pb-4 pt-10 hide-scrollbar" ref={scrollRef}>
        <div className="flex items-end space-x-3 min-w-max px-2">
          {WEEKS.map((week, idx) => {
            const [start, end] = week.range.split('..');
            const isActive = isBetween(currentDate, start, end);
            const isPast = isPastWeek(end);
            const actualHours = getActualHours(start, end);

            // Show actual hours for past weeks, plan for current/future
            const displayHours = isPast ? actualHours : week.hours_target;
            const heightPct = (displayHours / maxHours) * 100;

            // Format label: Date DD.MM.
            const d = new Date(start);
            const label = `${d.getDate()}.${d.getMonth() + 1}.`;

            // Color coding: past weeks green (actual), current orange, future gray
            let barColor = 'bg-slate-300 group-hover:bg-slate-400';
            if (isPast) {
              barColor = 'bg-emerald-500 group-hover:bg-emerald-600';
            } else if (isActive) {
              barColor = 'bg-orange-500 group-hover:bg-orange-600';
            }

            return (
              <div
                key={week.range}
                data-active={isActive}
                className="flex flex-col items-center group cursor-default"
              >
                 {/* Bar Track - Fixed Height */}
                 <div className="relative flex items-end justify-center h-28 w-8 bg-slate-50 rounded-t-sm">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${barColor}`}
                      style={{ height: `${heightPct}%` }}
                    >
                    </div>

                    {/* Hover Value - Centered and positioned above */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
                        {isPast ? `IST: ${actualHours}h` : `SOLL: ${week.hours_target}h`}
                    </div>

                    {/* Always show value for active week if not hovering */}
                    {isActive && (
                         <div className="absolute -top-6 text-orange-600 font-bold text-[10px] opacity-100 group-hover:opacity-0 transition-opacity">
                            {isPast ? `${actualHours}h` : `${week.hours_target}h`}
                        </div>
                    )}
                 </div>

                 <span className={`mt-2 text-[10px] font-medium ${isActive ? 'text-orange-600' : isPast ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {label}
                 </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

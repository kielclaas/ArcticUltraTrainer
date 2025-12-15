import React from 'react';
import { DayPlan } from '../types';
import { parseDurationMin } from '../services/engine';

interface Props {
  days: DayPlan[];
  onClose: () => void;
}

export const WeeklyOverview: React.FC<Props> = ({ days, onClose }) => {
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  // Prepare chart data: Use Actual if available, else Plan
  const chartData = days.map(d => ({
    ...d,
    min: d.actual ? d.actual.duration_min : parseDurationMin(d.session.duration_text),
    isActual: !!d.actual
  }));
  
  const maxMin = Math.max(...chartData.map(d => d.min), 60);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-slate-800">Wochenübersicht</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Daily Duration Chart */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider flex items-center gap-4">
                <span>Belastungsverteilung (Minuten)</span>
                <div className="flex items-center gap-2 text-[10px] font-normal normal-case">
                    <span className="block w-2 h-2 rounded-full bg-blue-500"></span> Plan
                    <span className="block w-2 h-2 rounded-full bg-emerald-500"></span> Ist
                </div>
            </h4>
            
            {/* Chart Container */}
            <div className="flex items-end justify-between gap-2 h-48">
              {chartData.map((day, idx) => {
                const heightPct = (day.min / maxMin) * 100;
                const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                
                // Color Logic: Emerald if actual, Blue if plan
                const barColor = day.isActual 
                    ? 'bg-emerald-500 group-hover:bg-emerald-600' 
                    : isToday 
                        ? 'bg-blue-500' 
                        : 'bg-slate-300 group-hover:bg-slate-400';

                return (
                  <div key={day.date} className="flex flex-col items-center w-full h-full justify-end group cursor-default">
                    {/* Bar Track */}
                    <div className="relative w-full flex items-end justify-center h-32 bg-slate-100 rounded-t-sm">
                       <div 
                         className={`w-full max-w-[30px] rounded-t-md transition-all duration-500 ${barColor}`}
                         style={{ height: `${heightPct}%` }}
                       ></div>
                       
                       {/* Tooltip */}
                       <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                         {day.min} min {day.isActual ? '(Ist)' : '(Plan)'}
                       </div>
                    </div>
                    
                    <span className={`mt-3 text-xs font-medium ${isToday ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                      {dayNames[day.dow]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-2 font-medium w-16">Tag</th>
                  <th className="py-3 px-2 font-medium w-24">Datum</th>
                  <th className="py-3 px-2 font-medium">Training</th>
                  <th className="py-3 px-2 font-medium w-32 text-right">Dauer</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {days.map((day, idx) => {
                  const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                  const rowClass = isToday ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-slate-50";
                  
                  return (
                    <tr key={day.date} className={`${rowClass} border-b border-slate-100 last:border-0 hover:bg-slate-100 transition`}>
                      <td className="py-4 px-2 font-bold text-slate-700">{dayNames[day.dow]}</td>
                      <td className="py-4 px-2 text-slate-500">{day.date.slice(5)}</td>
                      <td className="py-4 px-2">
                         {day.actual ? (
                             <div>
                                 <div className="font-bold text-emerald-700 flex items-center gap-1">
                                     <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                     {day.actual.sport}
                                 </div>
                                 <div className="text-xs text-slate-400 line-through mt-0.5 pl-3">{day.session.label}</div>
                             </div>
                         ) : (
                             <div>
                                 <div className="font-semibold text-slate-800">{day.session.label}</div>
                                 <div className="text-xs text-slate-500 mt-1">{day.session.intensity}</div>
                             </div>
                         )}
                      </td>
                      <td className="py-4 px-2 font-mono text-slate-600 text-right">
                          {day.actual ? (
                              <span className="font-bold text-emerald-700">{day.actual.duration_min} min</span>
                          ) : (
                              <span>{day.session.duration_text}</span>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

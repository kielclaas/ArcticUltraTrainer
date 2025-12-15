import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

export const CustomDatePicker: React.FC<Props> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // viewDate controls which month is currently displayed
  // value controls which day is selected
  const [viewDate, setViewDate] = useState(new Date());

  // Initialize viewDate based on value prop when component mounts or value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewDate(d);
      }
    }
  }, []); // Only on mount to avoid jumping around if user navigates

  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // JS getDay(): 0 = Sun, 1 = Mon ... 6 = Sat
    // We want 0 = Mon, ... 6 = Sun
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    // Format YYYY-MM-DD using local time logic (avoid timezone shifts)
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleTodayClick = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    onChange(dateStr);
    setViewDate(today);
    setIsOpen(false);
  };

  // Render Logic
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  
  // Create array for grid
  // Empty slots for days before start of month
  const blanks = Array(startDay).fill(null);
  // Days of the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Formatting display text safely
  let displayDate = "Datum wählen";
  try {
      if (value) {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
              displayDate = d.toLocaleDateString('de-DE', { 
                  day: '2-digit', month: '2-digit', year: 'numeric' 
              });
          }
      }
  } catch (e) {
      displayDate = value; // Fallback to raw string if valid format fails
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition group"
      >
        <span className="text-slate-700 font-medium">{displayDate}</span>
        <Calendar className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
      </div>

      {/* Popup / Backdrop */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar Container */}
          <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-4 animate-fade-in">
            
            {/* Header: Month Nav */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="font-bold text-slate-800">
                {monthNames[month]} {year}
              </span>

              <button 
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Grid: Weekdays */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid: Days */}
            <div className="grid grid-cols-7 gap-1">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              
              {days.map(day => {
                // Check if this day is selected
                const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = value === checkDate;
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`
                      h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all
                      ${isSelected 
                        ? 'bg-blue-600 text-white font-bold shadow-md' 
                        : 'text-slate-700 hover:bg-slate-100'}
                      ${!isSelected && isToday ? 'border border-blue-600 font-semibold text-blue-600' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer: Today Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
              <button 
                onClick={handleTodayClick}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Heute auswählen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

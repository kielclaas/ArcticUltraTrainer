import React from 'react';
import { SuggestionOutput, TrainingSession, HistoryEntry } from '../types';
import { Clock, BarChart2, Info, ShieldCheck, CheckCircle2, Footprints } from 'lucide-react';

interface Props {
  suggestion: SuggestionOutput;
}

const ActualDetail: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
    return (
        <div className="p-6 rounded-xl border border-emerald-400 bg-emerald-50 mb-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
                Ist / Absolviert
            </div>
            <h3 className="font-bold text-xl text-emerald-900 mb-3 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-2 text-emerald-600" />
                {entry.sport}
            </h3>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Dauer</span>
                    <div className="flex items-center text-emerald-900">
                        <Clock className="w-5 h-5 mr-2 text-emerald-600/70" />
                        <span className="font-mono font-bold text-2xl">{entry.duration_min} min</span>
                    </div>
                </div>
                {entry.distance_km !== undefined && entry.distance_km > 0 && (
                    <div className="flex flex-col">
                         <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Distanz</span>
                        <div className="flex items-center text-emerald-900">
                            <Footprints className="w-5 h-5 mr-2 text-emerald-600/70" />
                            <span className="font-mono font-bold text-2xl">{entry.distance_km.toFixed(1)} km</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SessionDetail: React.FC<{ session: TrainingSession, type: 'primary' | 'alternative' | 'prehab', isCompact?: boolean }> = ({ session, type, isCompact }) => {
  const isPrimary = type === 'primary';
  const isPrehab = type === 'prehab';
  
  let bgColor = 'bg-blue-50';
  let borderColor = 'border-blue-200';
  let titleColor = 'text-blue-800';

  if (!isPrimary && !isPrehab) {
    bgColor = 'bg-orange-50';
    borderColor = 'border-orange-200';
    titleColor = 'text-orange-800';
  } else if (isPrehab) {
    bgColor = 'bg-slate-50';
    borderColor = 'border-slate-200';
    titleColor = 'text-slate-700';
  }

  // Compact View (used when Actual data exists)
  if (isCompact) {
      return (
        <div className={`p-3 rounded-lg border border-dashed ${borderColor} ${bgColor} mb-2 opacity-75 grayscale`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Plan war:</span>
                    <span className={`text-sm font-semibold ${titleColor}`}>{session.label}</span>
                </div>
                <span className="font-mono text-sm text-slate-500">{session.duration_text}</span>
            </div>
        </div>
      );
  }

  return (
    <div className={`p-5 rounded-lg border ${borderColor} ${bgColor} mb-4 relative transition-all`}>
      <h3 className={`font-bold text-lg ${titleColor} mb-2 flex items-center justify-between`}>
        <div className="flex items-center">
            {isPrehab && <ShieldCheck className="w-5 h-5 mr-2 text-slate-500" />}
            {session.label}
        </div>
        {!isPrimary && !isPrehab && <span className="text-xs uppercase bg-orange-200 text-orange-800 px-2 py-1 rounded">Alternative</span>}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-slate-700">
          <Clock className="w-5 h-5 mr-2 text-slate-400" />
          <span className="font-mono font-medium">{session.duration_text}</span>
        </div>
        {!isPrehab && (
            <div className="flex items-center text-slate-700">
            <BarChart2 className="w-5 h-5 mr-2 text-slate-400" />
            <span className="text-sm">{session.intensity}</span>
            </div>
        )}
      </div>

      {session.notes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200/50">
          <div className="flex items-start">
            <Info className={`w-4 h-4 mr-2 mt-1 shrink-0 ${isPrehab ? 'text-slate-500' : 'text-slate-400'}`} />
            <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
              {session.notes.map((note, idx) => (
                <li key={idx} className={isPrehab ? 'marker:text-slate-500' : ''}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export const SuggestionCard: React.FC<Props> = ({ suggestion }) => {
  const { date, phase, week, primary, alternative, prehab, isSpecial, actual } = suggestion;
  const isDone = !!actual;

  let displayDate = "";
  try {
      displayDate = new Date(date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });
  } catch (e) {
      displayDate = date;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${isSpecial ? 'bg-indigo-600' : 'bg-slate-800'} text-white`}>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold">{displayDate}</h2>
            <div className="flex space-x-3 mt-2 text-slate-300 text-sm">
              <span className="bg-white/20 px-2 py-0.5 rounded text-white">{phase.label} Phase</span>
              <span>Ziel: {week.hours_target}h / Woche</span>
            </div>
          </div>
          {isSpecial && (
             <span className="text-xs font-bold bg-yellow-400 text-indigo-900 px-2 py-1 rounded uppercase tracking-wider">Special Event</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* 1. ACTUAL DATA (Dominates view if present) */}
        {actual && <ActualDetail entry={actual} />}

        {/* 2. PLAN (Compact if done, Full if todo) */}
        <SessionDetail session={primary} type="primary" isCompact={isDone} />
        
        {/* 3. Prehab (Always shown, cleaner style) */}
        {prehab && !isDone && <SessionDetail session={prehab} type="prehab" />}

        {/* 4. Alternative (Only if not done) */}
        {alternative && !isDone && <SessionDetail session={alternative} type="alternative" />}
      </div>
    </div>
  );
};

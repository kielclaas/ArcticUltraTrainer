import React from 'react';
import { Calendar, Activity } from 'lucide-react';
import { CustomDatePicker } from './CustomDatePicker';

interface Props {
  date: string;
  setDate: (d: string) => void;
  sport: string;
  setSport: (s: string) => void;
  onSuggest: () => void;
}

export const TrainingForm: React.FC<Props> = ({ date, setDate, sport, setSport, onSuggest }) => {

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Custom Date Picker */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Datum
            </label>
          </div>
          
          <CustomDatePicker 
            value={date} 
            onChange={setDate} 
          />
        </div>

        {/* Sport Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <Activity className="w-4 h-4 mr-2 text-orange-600" />
            Dein Sport heute
          </label>
          <input 
            type="text" 
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            placeholder="z.B. Trailrun, Pulka, Zwift, KB Kraft..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            onKeyDown={(e) => e.key === 'Enter' && onSuggest()}
          />
        </div>
      </div>

      <button 
        onClick={onSuggest}
        className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition transform active:scale-[0.99] shadow-lg"
      >
        Vorschlag generieren
      </button>
    </div>
  );
};

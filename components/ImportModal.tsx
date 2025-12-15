import React, { useState, useEffect } from 'react';
import { Globe, X, Save, FileText, Check, AlertCircle } from 'lucide-react';
import { parseTrainingCSV } from '../services/importer';
import { HistoryEntry } from '../types';

interface Props {
  onClose: () => void;
  onSaveToken: (token: string) => void;
  onImportCsv: (entries: HistoryEntry[]) => void;
}

export const ImportModal: React.FC<Props> = ({ onClose, onSaveToken, onImportCsv }) => {
  const [activeTab, setActiveTab] = useState<'api' | 'csv'>('api');
  const [apiToken, setApiToken] = useState('');
  
  // CSV State
  const [csvText, setCsvText] = useState('');
  const [csvPreview, setCsvPreview] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem('runalyze_api_token');
    if (localToken) setApiToken(localToken);
  }, []);

  const handleSaveToken = () => {
    if (apiToken.trim().length > 0) {
        onSaveToken(apiToken);
    }
  };

  const handleParseCSV = () => {
    try {
      setError(null);
      const data = parseTrainingCSV(csvText);
      if (data.length === 0) {
        setError("Keine gültigen Daten gefunden. Prüfe das Format (Benötigt: Datum, Sportart).");
      }
      setCsvPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Lesen der Daten.");
    }
  };

  const handleImportCsv = () => {
      onImportCsv(csvPreview);
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">Daten Importieren</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('api')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'api' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Globe className="w-4 h-4" /> Runalyze API (Auto)
            </button>
            <button 
                onClick={() => setActiveTab('csv')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'csv' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <FileText className="w-4 h-4" /> CSV (Manuell)
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {/* API TAB */}
            {activeTab === 'api' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                        Erstelle einen <strong>Personal Access Token</strong> unter <em>Runalyze &gt; Konto &gt; Personal API</em> und füge ihn hier ein.
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Personal Access Token</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            placeholder="Dein Token..."
                            value={apiToken}
                            onChange={(e) => setApiToken(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={handleSaveToken}
                            disabled={!apiToken}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Token Speichern & Syncen
                        </button>
                    </div>
                </div>
            )}

            {/* CSV TAB */}
            {activeTab === 'csv' && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Fallback falls die API nicht geht: Kopiere deine Tabelle aus <strong>Runalyze &gt; Historie</strong> und füge sie hier ein.
                    </p>
                    <textarea
                        className="w-full h-32 p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Datum;Sportart;Distanz;Dauer&#10;29.12.2025;Laufen;10,5;1:00:00"
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                    />
                    
                    <div className="flex justify-between items-center">
                        <button 
                        onClick={handleParseCSV}
                        className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded text-xs font-medium hover:bg-slate-300 transition"
                        >
                        Vorschau generieren
                        </button>
                        
                        <button 
                            onClick={handleImportCsv}
                            disabled={csvPreview.length === 0}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {csvPreview.length} Aktivitäten Importieren
                        </button>
                    </div>

                    {/* Preview Area */}
                    {csvPreview.length > 0 && (
                        <div className="mt-4 border rounded-lg overflow-hidden max-h-32 overflow-y-auto text-xs">
                             <table className="w-full text-left bg-white">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr><th className="p-2">Datum</th><th className="p-2">Sport</th><th className="p-2">Zeit</th></tr>
                                </thead>
                                <tbody>
                                    {csvPreview.map((p,i) => (
                                        <tr key={i} className="border-t border-slate-100">
                                            <td className="p-2">{p.date}</td>
                                            <td className="p-2">{p.sport}</td>
                                            <td className="p-2">{p.duration_min}m</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                    <div className="font-bold">Fehler</div>
                    {error}
                </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { TrainingForm } from './components/TrainingForm';
import { SuggestionCard } from './components/SuggestionCard';
import { WeeklyOverview } from './components/WeeklyOverview';
import { WeeklyVolumeChart } from './components/WeeklyVolumeChart';
import { ImportModal } from './components/ImportModal';
import { generateSuggestion, getFullWeekPlan } from './services/engine';
import { SuggestionOutput, DayPlan, HistoryEntry } from './types';
import { Snowflake, RefreshCw, Link as LinkIcon, LogIn, LogOut, User as UserIcon, Settings, CheckCircle2, AlertTriangle } from 'lucide-react';
import { auth, loginWithGoogle, logout, saveHistoryToCloud, loadHistoryFromCloud, isFirebaseConfigured, saveRunalyzeToken } from './services/firebase';
import { fetchRunalyzeActivities } from './services/runalyze';
import { onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sport, setSport] = useState<string>('');
  const [suggestion, setSuggestion] = useState<SuggestionOutput | null>(null);
  const [weekPlan, setWeekPlan] = useState<DayPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Auth & Data State
  const [user, setUser] = useState<User | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [runalyzeToken, setRunalyzeToken] = useState<string | null>(null);

  // 1. Init Data (Local + Cloud)
  useEffect(() => {
    // Local Token Check
    const localToken = localStorage.getItem('runalyze_api_token');
    if (localToken) setRunalyzeToken(localToken);

    // Local History Check
    const savedHistory = localStorage.getItem('arctic_ultra_history');
    if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
           setIsLoading(true);
           const cloudData = await loadHistoryFromCloud(currentUser);
           if (cloudData) {
             setHistory(cloudData);
             localStorage.setItem('arctic_ultra_history', JSON.stringify(cloudData));
           }
           setIsLoading(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // --- DATA MERGING HELPER ---
  const mergeHistory = async (newEntries: HistoryEntry[]) => {
      if (newEntries.length === 0) return 0;

      const merged = [...history, ...newEntries];
      // Filter unique by date + sport + duration
      const uniqueHistory = merged.filter((v,i,a)=>a.findIndex(t=>(t.date===v.date && t.sport===v.sport && t.duration_min===v.duration_min))===i);
      
      uniqueHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const addedCount = uniqueHistory.length - history.length;

      setHistory(uniqueHistory);
      localStorage.setItem('arctic_ultra_history', JSON.stringify(uniqueHistory));
      
      if (user) await saveHistoryToCloud(user, uniqueHistory);
      
      return addedCount;
  };

  // --- CORE SYNC LOGIC ---

  const handleSyncClick = async () => {
      // Case A: No Token -> Open Setup
      if (!runalyzeToken) {
          setShowTokenModal(true);
          return;
      }

      // Case B: Has Token -> Fetch
      await performSync(runalyzeToken);
  };

  const performSync = async (token: string) => {
      setIsSyncing(true);
      setError(null);
      setSuccessMsg(null);

      try {
          const newActivities = await fetchRunalyzeActivities(token);
          
          if (newActivities.length === 0) {
              setError("API Verbindung erfolgreich, aber Runalyze lieferte 0 Aktivitäten zurück. Prüfe ob du Aktivitäten im Log hast oder nutze CSV.");
          } else {
              const added = await mergeHistory(newActivities);
              if (added > 0) {
                setSuccessMsg(`Sync erfolgreich: ${added} neue Aktivitäten geladen.`);
              } else {
                setSuccessMsg(`Sync erfolgreich: Alle Aktivitäten aktuell (Keine neuen).`);
              }
              
              // Clear success msg after 4s
              setTimeout(() => setSuccessMsg(null), 4000);
          }

      } catch (e) {
          setError(e instanceof Error ? e.message : "Sync Fehler");
          // If 401, don't delete token immediately, user might just need to check it
      } finally {
          setIsSyncing(false);
      }
  };

  const handleSaveToken = async (token: string) => {
      setRunalyzeToken(token);
      localStorage.setItem('runalyze_api_token', token);
      setShowTokenModal(false);
      if (user) await saveRunalyzeToken(user, token);
      
      // Auto-trigger sync after save
      setTimeout(() => performSync(token), 100);
  };

  const handleManualCsvImport = async (entries: HistoryEntry[]) => {
      const added = await mergeHistory(entries);
      setSuccessMsg(`${added} Aktivitäten aus CSV importiert.`);
      setTimeout(() => setSuccessMsg(null), 4000);
  };

  // --- STANDARD HANDLERS ---

  const handleLogin = async () => {
    if (!isFirebaseConfigured) return;
    try { await loginWithGoogle(); } catch (e) { alert("Login failed"); }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleSuggest = () => {
    try {
      setError(null);
      const result = generateSuggestion(date, sport, history);
      setSuggestion(result);
    } catch (err) {
      setSuggestion(null);
      setError(err instanceof Error ? err.message : "Fehler");
    }
  };

  const handleShowWeek = () => {
    try {
      const plan = getFullWeekPlan(date, history);
      setWeekPlan(plan);
    } catch (err) {}
  };

  // Refresh view when history updates
  useEffect(() => {
    handleSuggest();
  }, [date, history]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      
      {/* Top Navigation */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="text-blue-400 w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Arctic Ultra Trainer</h1>
            <h1 className="text-xl font-bold tracking-tight sm:hidden">AUT 2026</h1>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* SYNC BUTTON */}
            <div className="flex bg-slate-800 rounded-lg border border-slate-700 p-0.5">
                <button 
                    onClick={handleSyncClick}
                    disabled={isSyncing}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition font-medium ${
                        !runalyzeToken ? 'bg-blue-600 hover:bg-blue-700 text-white shadow' : 'hover:bg-slate-700 text-emerald-400'
                    }`}
                >
                    {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : runalyzeToken ? <RefreshCw className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    <span className="hidden sm:inline">{!runalyzeToken ? "Connect" : "Sync"}</span>
                </button>
                {/* Settings Button to open modal manually */}
                <button 
                    onClick={() => setShowTokenModal(true)}
                    className="px-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition"
                    title="Import Einstellungen"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            {/* Login/User Section */}
            {isFirebaseConfigured && (
                <>
                    {user ? (
                    <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-1 border border-slate-700">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-slate-500" />
                        ) : (
                            <UserIcon className="w-5 h-5 text-blue-300" />
                        )}
                        <button onClick={handleLogout} className="text-slate-400 hover:text-white" title="Logout">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                    ) : (
                    <button 
                        onClick={handleLogin}
                        className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition font-medium shadow-sm"
                    >
                        <LogIn className="w-4 h-4" />
                    </button>
                    )}
                </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 mt-4">
        
        <TrainingForm 
          date={date} 
          setDate={setDate} 
          sport={sport} 
          setSport={setSport} 
          onSuggest={handleSuggest} 
        />

        {error && (
          <div className="bg-orange-50 text-orange-800 p-4 rounded-lg border border-orange-200 mb-6 text-center font-medium animate-fade-in flex flex-col items-center gap-2">
             <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
             </div>
            <button 
                onClick={() => setShowTokenModal(true)}
                className="text-sm underline text-orange-900 hover:text-orange-950 font-bold"
            >
                Einstellungen öffnen / CSV Import
            </button>
          </div>
        )}

        {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-200 mb-6 text-center font-bold animate-fade-in flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {successMsg}
            </div>
        )}

        {suggestion && (
          <div className="animate-fade-in space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Dein Vorschlag</h3>
                 <button 
                    onClick={handleShowWeek}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    Ganze Woche anzeigen →
                 </button>
              </div>
              <SuggestionCard suggestion={suggestion} />
            </div>
            
            <WeeklyVolumeChart currentDate={date} history={history} />
          </div>
        )}
      </main>

      {weekPlan && (
        <WeeklyOverview 
            days={weekPlan} 
            onClose={() => setWeekPlan(null)} 
        />
      )}

      {showTokenModal && (
        <ImportModal 
            onClose={() => setShowTokenModal(false)}
            onSaveToken={handleSaveToken}
            onImportCsv={handleManualCsvImport}
        />
      )}

    </div>
  );
};

export default App;

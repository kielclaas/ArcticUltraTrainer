import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { HistoryEntry } from '../types';

// --- KONFIGURATION ---
// BITTE HIER DEINE FIREBASE DATEN EINTRAGEN
// Du bekommst diese in der Firebase Console -> Project Settings -> General -> "Your apps"
const firebaseConfig = {
  apiKey: "DEIN_API_KEY_HIER_EINFÜGEN",
  authDomain: "dein-projekt.firebaseapp.com",
  projectId: "dein-projekt",
  storageBucket: "dein-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Check if config is replaced
export const isFirebaseConfigured = firebaseConfig.apiKey !== "DEIN_API_KEY_HIER_EINFÜGEN";

let app;
let auth: any;
let db: any;
let googleProvider: any;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.error("Firebase Init Error:", e);
  }
}

// --- Auth Functions ---

export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth) throw new Error("Firebase ist noch nicht konfiguriert. Bitte API-Keys in services/firebase.ts eintragen.");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

// --- Database Functions ---

export async function saveHistoryToCloud(user: User, history: HistoryEntry[]) {
  if (!db || !user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    // Merge true allows us to add fields later without deleting others
    await setDoc(userRef, { history, lastUpdated: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error("Save to cloud failed", e);
  }
}

export async function loadHistoryFromCloud(user: User): Promise<HistoryEntry[] | null> {
  if (!db || !user) return null;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.history || []) as HistoryEntry[];
    }
  } catch (e) {
    console.error("Load from cloud failed", e);
  }
  return null;
}

// --- Settings (API Tokens) ---

export async function saveRunalyzeToken(user: User, token: string) {
  if (!db || !user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { settings: { runalyzeToken: token } }, { merge: true });
  } catch (e) {
    console.error("Save token failed", e);
  }
}

export async function loadRunalyzeToken(user: User): Promise<string | null> {
  if (!db || !user) return null;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.settings?.runalyzeToken || null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export { auth };

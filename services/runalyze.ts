import { HistoryEntry } from '../types';

const BASE_URL = 'https://runalyze.com/api/v1';

// Local proxy server (preferred) - run with: npm run proxy
const LOCAL_PROXY = 'http://localhost:3001/api/runalyze';

// Multiple CORS proxy options (fallback chain)
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
];

interface RunalyzeActivity {
  id: number;
  date_time: string; // ISO format: "2025-12-14T13:48:51+01:00"
  duration: number | string;
  distance: number | string;
  sport: {
    id: number;
    name: string;
  };
  type?: {
    name: string;
  };
  // Legacy fallback
  time?: number | string;
}

async function fetchWithFallback(url: string, options: RequestInit): Promise<any> {
    // 1. Try Local Proxy first (if running)
    try {
        const proxyUrl = url.replace(BASE_URL, LOCAL_PROXY);
        console.log("🏠 Trying local proxy:", proxyUrl);
        console.log("📋 Headers:", JSON.stringify(options.headers, null, 2));

        const response = await fetch(proxyUrl, options);

        console.log("✅ Local proxy response:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text().catch(() => "No error details");

            if (response.status === 401) throw new Error("Token ungültig (401). Bitte prüfe deinen API Token in Runalyze.");
            if (response.status === 403) throw new Error("Zugriff verweigert (403). Token hat keine Berechtigung.");
            throw new Error(`API Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Local proxy successful, entries:", Array.isArray(data) ? data.length : 'unknown');
        return data;

    } catch (e) {
        if (e instanceof Error && (e.message.includes("401") || e.message.includes("403"))) {
            throw e;
        }
        console.warn("⚠️ Local proxy not available, trying direct fetch...");
    }

    // 2. Try Direct Fetch
    try {
        console.log("🔄 Trying direct fetch to:", url);

        const response = await fetch(url, options);

        console.log("✅ Response status:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text().catch(() => "No error details");
            console.error("❌ Error response body:", errorText);

            if (response.status === 401) throw new Error("Token ungültig (401). Bitte prüfe deinen API Token in Runalyze.");
            if (response.status === 403) throw new Error("Zugriff verweigert (403). Token hat keine Berechtigung.");
            throw new Error(`API Fehler: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        console.log("✅ Direct fetch successful, entries:", Array.isArray(data) ? data.length : 'unknown');
        return data;

    } catch (e) {
        if (e instanceof Error && (e.message.includes("401") || e.message.includes("403") || e.message.includes("API Fehler"))) {
            throw e;
        }
        console.warn("⚠️ Direct fetch failed (likely CORS):", e);
    }

    // 3. Try Multiple CORS Proxies
    for (let i = 0; i < CORS_PROXIES.length; i++) {
        const proxyPrefix = CORS_PROXIES[i];
        try {
            const proxyUrl = proxyPrefix + encodeURIComponent(url);
            console.log(`🔄 Trying proxy ${i + 1}/${CORS_PROXIES.length}: ${proxyPrefix}`);

            const response = await fetch(proxyUrl, options);

            console.log("✅ Proxy response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text().catch(() => "No error details");
                console.error("❌ Proxy error response:", errorText);

                if (response.status === 401) throw new Error("Token ungültig (401). Der Proxy konnte dich nicht authentifizieren.");
                if (response.status === 403) throw new Error("Zugriff verweigert (403).");
                if (response.status === 500) throw new Error("Proxy Server Fehler (500).");
                throw new Error(`API Fehler via Proxy: ${response.status} - ${errorText.substring(0, 100)}`);
            }

            const data = await response.json();
            console.log("✅ Proxy fetch successful");
            return data;

        } catch (e) {
            if (e instanceof Error && (e.message.includes("401") || e.message.includes("403") || e.message.includes("Proxy"))) {
                throw e;
            }
            console.error(`❌ Proxy ${i + 1} failed:`, e);

            // Try next proxy
            if (i < CORS_PROXIES.length - 1) {
                continue;
            }
        }
    }

    // All proxies failed
    throw new Error("Verbindung fehlgeschlagen (CORS). Die Runalyze API ist vom Browser nicht erreichbar. Bitte nutze den manuellen CSV Import.");
}

export async function fetchRunalyzeActivities(token: string): Promise<HistoryEntry[]> {
  try {
    const url = `${BASE_URL}/activity?page=1&order%5Bid%5D=desc`;

    console.log("🚀 Fetching Runalyze activities...");
    console.log("📍 URL:", url);

    // Try multiple header formats (Runalyze API might use different auth methods)
    const headerVariants = [
      // Variant 1: Bearer token (most common)
      {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      // Variant 2: token header (original)
      {
        'token': token,
        'Accept': 'application/json',
      },
      // Variant 3: X-Auth-Token
      {
        'X-Auth-Token': token,
        'Accept': 'application/json',
      }
    ];

    let lastError: Error | null = null;

    // Try each header variant
    for (let i = 0; i < headerVariants.length; i++) {
      try {
        console.log(`\n🔧 Trying header variant ${i + 1}/${headerVariants.length}...`);

        const data = await fetchWithFallback(url, {
          method: 'GET',
          headers: headerVariants[i]
        });

        // If we got here, it worked!
        console.log("🎉 Authentication successful with variant", i + 1);

        let activitiesList: RunalyzeActivity[] = [];

        if (Array.isArray(data)) {
            activitiesList = data;
        } else if (data && data.data && Array.isArray(data.data)) {
            activitiesList = data.data;
        } else {
            console.warn("⚠️ Invalid Data Structure:", data);
            throw new Error("Antwort-Format unbekannt (Keine Liste).");
        }

        if (activitiesList.length === 0) {
            console.warn("⚠️ Runalyze returned empty list. Raw data:", data);
        }

        return mapActivities(activitiesList);

      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        console.error(`❌ Variant ${i + 1} failed:`, lastError.message);

        // If it's an auth error (401/403), don't try other variants
        if (lastError.message.includes("401") || lastError.message.includes("403")) {
          break;
        }

        // Continue to next variant
        continue;
      }
    }

    // All variants failed
    throw lastError || new Error("Alle Authentifizierungs-Methoden fehlgeschlagen.");

  } catch (error) {
    console.error("❌ Runalyze Service Error:", error);
    throw error;
  }
}

function mapActivities(activities: RunalyzeActivity[]): HistoryEntry[] {
  return activities
    .map((act): HistoryEntry | null => {
        try {
            // Parse date from new date_time field (ISO format) or legacy time field (unix timestamp)
            let dateObj: Date;

            if (act.date_time) {
                // New format: "2025-12-14T13:48:51+01:00"
                dateObj = new Date(act.date_time);
            } else if (act.time) {
                // Legacy format: unix timestamp
                const timeVal = typeof act.time === 'string' ? parseInt(act.time, 10) : act.time;
                dateObj = new Date(timeVal * 1000);
            } else {
                console.warn("⚠️ Activity has no date_time or time field:", act);
                return null;
            }

            if (isNaN(dateObj.getTime())) {
                console.warn("⚠️ Invalid date:", act);
                return null;
            }

            // Parse duration and distance
            const durVal = typeof act.duration === 'string' ? parseFloat(act.duration) : act.duration;
            const distVal = typeof act.distance === 'string' ? parseFloat(act.distance) : act.distance;

            const date = dateObj.toISOString().split('T')[0];
            const duration_min = Math.round((durVal || 0) / 60);

            let sport = act.sport ? act.sport.name : 'Unbekannt';
            if (act.type && act.type.name) {
                sport += ` (${act.type.name})`;
            }

            return {
                date,
                sport,
                duration_min,
                distance_km: distVal || 0,
                original_string: `Runalyze: ${sport}`
            };
        } catch (e) {
            console.warn("⚠️ Runalyze activity skipped (parse error):", act, e);
            return null;
        }
    })
    .filter((entry): entry is HistoryEntry => entry !== null);
}

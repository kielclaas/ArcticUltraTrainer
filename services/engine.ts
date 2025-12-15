import { Phase, WeekConfig, SuggestionOutput, TrainingSession, SportCategory, WeekdayTemplate, DayPlan, HistoryEntry } from '../types';
import { PHASES, WEEKS, SPORT_MAP, DAILY_OVERRIDES } from './planData';

// --- Helpers ---

function getDayOfWeek(dateStr: string): number {
  // Use UTC to avoid timezone issues
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCDay(); // 0 = Sun, 1 = Mon...
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isBetween(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr <= end;
}

export function parseDurationMin(text: string): number {
  if (!text || text.toLowerCase().includes('rest')) return 0;
  
  const normalized = text.replace(/(\d+)h(\d+)?/gi, (match, hStr, mStr) => {
    const hours = parseInt(hStr, 10);
    const mins = mStr ? parseInt(mStr, 10) : 0;
    return String(hours * 60 + mins);
  });

  const matches = normalized.match(/(\d+)/g);
  if (!matches) return 0;

  if (text.includes('+')) {
     return matches.reduce((sum, val) => sum + parseInt(val, 10), 0);
  }

  if (text.toLowerCase().includes('x')) {
      const v1 = parseInt(matches[0], 10);
      const v2 = parseInt(matches[1], 10);
      if (v1 < 10 && v2 > 10) {
          return v1 * v2;
      }
  }
  
  if (matches.length >= 2) {
    const v1 = parseInt(matches[0], 10);
    const v2 = parseInt(matches[1], 10);
    return Math.round((v1 + v2) / 2);
  }
  
  return parseInt(matches[0], 10);
}

// --- Classification ---

function mapSport(text: string): SportCategory {
  const lower = text.toLowerCase();
  for (const keyword of SPORT_MAP.pulka) if (lower.includes(keyword)) return 'pulka';
  for (const keyword of SPORT_MAP.run) if (lower.includes(keyword)) return 'run';
  for (const keyword of SPORT_MAP.hike) if (lower.includes(keyword)) return 'hike';
  for (const keyword of SPORT_MAP.virtualride) if (lower.includes(keyword)) return 'virtualride';
  for (const keyword of SPORT_MAP.bike) if (lower.includes(keyword)) return 'bike';
  for (const keyword of SPORT_MAP.row) if (lower.includes(keyword)) return 'row';
  for (const keyword of SPORT_MAP.airbike) if (lower.includes(keyword)) return 'airbike';
  for (const keyword of SPORT_MAP.strength) if (lower.includes(keyword)) return 'strength';
  for (const keyword of SPORT_MAP.strength) if (lower.includes('kraft')) return 'strength';
  
  if (lower.includes('rest') || lower.includes('pause')) return 'rest';
  if (lower.includes('mobility') || lower.includes('yoga') || lower.includes('stret')) return 'mobility';

  return 'other';
}

// --- Duration Conversion Logic ---

interface ConversionRule {
  factor: number;
  maxCap?: number;
  minFloor?: number;
  explanation: string;
}

function getConversionRule(from: SportCategory, to: SportCategory): ConversionRule {
  if (to === 'strength') {
    if (from === 'hike' || from === 'pulka' || from === 'ruck' as any) {
      return { factor: 0.35, maxCap: 75, minFloor: 30, explanation: "Volumen reduziert (Kraft vs. Ausdauer)" };
    }
    return { factor: 0.8, maxCap: 75, minFloor: 30, explanation: "Angepasst auf Kraft-Session" };
  }
  if (from === 'hike' || from === 'pulka' || from === 'ruck' as any) {
    if (to === 'run') {
      return { factor: 0.5, maxCap: 90, explanation: "Faktor 0.5 (Impact-Anpassung)" };
    }
    if (to === 'bike' || to === 'virtualride' || to === 'row' || to === 'airbike') {
      return { factor: 0.6, maxCap: 120, explanation: "Faktor 0.6 (Intensitäts-Anpassung)" };
    }
  }
  if (from === 'run') {
    if (to === 'bike' || to === 'virtualride') {
      return { factor: 1.5, explanation: "Faktor 1.5 (Metabolische Äquivalenz)" };
    }
    if (to === 'hike' || to === 'pulka' || to === 'ruck' as any) {
      return { factor: 2.0, explanation: "Faktor 2.0 (Reduzierte Intensität)" };
    }
  }
  if (from === 'bike' || from === 'virtualride') {
     if (to === 'run') {
       return { factor: 0.7, explanation: "Faktor 0.7 (Höherer Impact)" };
     }
  }
  return { factor: 1.0, explanation: "Zeit übernommen" };
}

function calculateAlternativeDuration(originalDurationStr: string, fromSport: string, toSport: SportCategory): { text: string, note: string } {
  const minutes = parseDurationMin(originalDurationStr);
  if (minutes === 0) return { text: "Frei wählbar", note: "" };

  let fromCat: SportCategory = 'other';
  const fromLower = fromSport.toLowerCase();
  
  if (fromLower.includes('ruck') || fromLower.includes('hike') || fromLower.includes('walk') || fromLower.includes('marsch')) fromCat = 'hike';
  else if (fromLower.includes('run') || fromLower.includes('lauf')) fromCat = 'run';
  else if (fromLower.includes('rad') || fromLower.includes('bike') || fromLower.includes('zwift')) fromCat = 'bike';
  else if (fromLower.includes('kraft') || fromLower.includes('strength')) fromCat = 'strength';
  else if (fromLower.includes('pulka') || fromLower.includes('reifen')) fromCat = 'pulka';

  const rule = getConversionRule(fromCat, toSport);
  let newMinutes = Math.round(minutes * rule.factor);
  
  if (rule.maxCap && newMinutes > rule.maxCap) newMinutes = rule.maxCap;
  if (rule.minFloor && newMinutes < rule.minFloor) newMinutes = rule.minFloor;

  newMinutes = Math.round(newMinutes / 5) * 5;

  return {
    text: `~${newMinutes} min`,
    note: `Dauer angepasst: ${rule.explanation} (Orig: ${minutes}m)`
  };
}

// --- History Aggregation ---

function getAggregatedHistory(dateStr: string, history: HistoryEntry[] = []): HistoryEntry | undefined {
  const entries = history.filter(h => h.date === dateStr);
  
  if (entries.length === 0) return undefined;
  
  if (entries.length === 1) return entries[0];

  // Aggregate multiple entries
  const totalMin = entries.reduce((sum, e) => sum + e.duration_min, 0);
  const totalKm = entries.reduce((sum, e) => sum + (e.distance_km || 0), 0);
  
  // Combine sports labels unique
  const sports = Array.from(new Set(entries.map(e => e.sport))).join(' + ');

  return {
    date: dateStr,
    sport: sports,
    duration_min: totalMin,
    distance_km: totalKm,
    original_string: 'Aggregated'
  };
}


// --- Core Logic ---

function findPhase(dateStr: string): Phase | undefined {
  return PHASES.find(p => isBetween(dateStr, p.date_from, p.date_to));
}

function findWeek(dateStr: string): WeekConfig | undefined {
  return WEEKS.find(w => {
    const [start, end] = w.range.split('..');
    return isBetween(dateStr, start, end);
  });
}

function calculateDuration(template: WeekdayTemplate, week: WeekConfig, dow: number): string {
  if (dow === 6 && template.dur_min === "by_week_calendar") {
    if (week.long_sat) {
       const [min, max] = week.long_sat;
       return min === max ? `${min} min` : `${min}-${max} min`;
    }
    return "See Week Plan";
  }
  if (dow === 0 && template.type.includes('b2b')) {
    if (week.b2b_sun) {
       const [min, max] = week.b2b_sun;
       return `${min}-${max} min`;
    }
    if (week.long_sat) {
      const satDur = week.long_sat[1]; 
      const ratio = template.ratio_of_sat || 0.6;
      const sunDur = Math.round(satDur * ratio);
      return `~${sunDur} min`;
    }
  }
  if (Array.isArray(template.dur_min)) {
     const [min, max] = template.dur_min;
     if (max === 0) return "Rest";
     return `${min}-${max} min`;
  }
  return "Variabel";
}

function getIntensityAndNotes(type: string, phaseKey: string): { intensity: string, notes: string[] } {
  let intensity = "Z1-Z2 (Aerob)";
  const notes: string[] = [];
  if (type.includes("recovery")) { intensity = "Z1 / Active Recovery"; notes.push("Ganz locker, Fokus auf Durchblutung."); }
  if (type.includes("quality")) { intensity = "Steady (Z3) or Hills"; notes.push("Wenn letzte Woche hart war: Steady. Sonst: Kurze Intervalle/Hügel."); }
  if (type.includes("pulka")) { intensity = "Kraftausdauer (Muscular Endurance)"; notes.push("Technik sauber halten. Hüfte stabil."); }
  if (type.includes("strength")) { intensity = "RPE 7-8"; notes.push("Ganzkörper, Kettlebell, Mace. Rumpf stabilisieren."); }
  if (type.includes("longrun")) { intensity = "Z1-Z2 (Endurance)"; notes.push("Ernährung testen. Pace niedrig halten."); }
  if (type.includes("b2b")) { intensity = "Z1 / Hike"; notes.push("Müde Beine simulieren. Viel Gehen erlaubt."); }
  if (type.includes("very_easy")) { intensity = "Z0-Z1"; notes.push("Tapern! Nur Bewegung, kein Trainingseffekt."); }
  return { intensity, notes };
}

// --- Generators ---

function build4x4x48Suggestion(): TrainingSession {
  return {
    label: "4x4x48 Challenge",
    discipline: "Run/Walk",
    duration_text: "Alle 4h -> 6.4km (4 Miles)",
    intensity: "Z1-Z2",
    notes: ["Start Fr 20:00, Ende So 20:00", "Konsistenz ist wichtiger als Pace."]
  };
}

function buildExpeditionDay(dow: number): TrainingSession {
  if (dow === 5 || dow === 6) {
    return { label: "Mini-Expedition Tag 1/2", discipline: "Hike/Pulka", duration_text: "6h (360 min)", intensity: "Z1-Z2", notes: ["Biwak-Ausrüstung testen"] };
  }
  return { label: "Mini-Expedition Tag 3", discipline: "Hike/Pulka", duration_text: "3h (180 min)", intensity: "Z1", notes: ["Rückmarsch"] };
}

function buildStandardSuggestion(phase: Phase, week: WeekConfig, dow: number): TrainingSession {
  const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const key = map[dow];
  const tpl = phase.weekday_templates[key];
  const duration = calculateDuration(tpl, week, dow);
  const { intensity, notes } = getIntensityAndNotes(tpl.type, phase.key);
  return { label: `Plan: ${tpl.type.replace(/_/g, ' ').toUpperCase()}`, discipline: tpl.type.split('_')[0], duration_text: duration, intensity, notes };
}

function buildPrehabSession(type: 'A' | 'B'): TrainingSession {
  if (type === 'A') {
    return { label: "🛡️ Pflichttraining: PREHAB A (Stabilität & Anti-Rotation)", discipline: "strength", duration_text: "30-35 min", intensity: "Quality", notes: ["Hip-Hinge Drill", "McGill Big-3", "Pallof Press (Statisch)", "Koffer-Carry"] };
  } else {
    return { label: "🛡️ Pflichttraining: PREHAB B (Kraftausdauer)", discipline: "strength", duration_text: "35-40 min", intensity: "Quality", notes: ["Hinge mit Band", "McGill Big-3 (Long)", "Pallof Press (Repetitiv)", "Farmer Carry"] };
  }
}

// --- Main Exported Function ---

export function generateSuggestion(dateStr: string, sportText: string, history: HistoryEntry[] = []): SuggestionOutput {
  const phase = findPhase(dateStr);
  const week = findWeek(dateStr);
  
  if (!phase || !week) {
    throw new Error(`Date ${dateStr} is out of plan range.`);
  }

  let primary: TrainingSession;
  let alternative: TrainingSession | null = null;
  let prehab: TrainingSession | null = null;
  let isSpecial = false;

  // 1. Calculate Plan
  if (DAILY_OVERRIDES[dateStr]) {
    const override = DAILY_OVERRIDES[dateStr];
    primary = { ...override.primary, notes: [...override.primary.notes] };
    alternative = override.alternative ? { ...override.alternative, notes: [...override.alternative.notes] } : null;
    isSpecial = false; 
  } else {
    const dow = getDayOfWeek(dateStr);
    if (week.special === '4x4x48' && isBetween(dateStr, '2026-01-09', '2026-01-11')) {
       primary = build4x4x48Suggestion();
       isSpecial = true;
    } else if (week.special === 'mini_expedition' && (dow === 5 || dow === 6 || dow === 0)) {
       primary = buildExpeditionDay(dow);
       isSpecial = true;
    } else if (week.special === 'race_week') {
       primary = { label: "RACE WEEK", discipline: "Rest/Mobility", duration_text: "Max 30 min", intensity: "Very Low", notes: ["Füße hoch", "Mental prep"] };
        isSpecial = true;
    } else {
       primary = buildStandardSuggestion(phase, week, dow);
    }
  }
  
  // 2. Prehab
  const dow = getDayOfWeek(dateStr);
  if (week.special !== 'race_week' && !isSpecial) {
      if (dow === 1) prehab = buildPrehabSession('A');
      else if (dow === 5) prehab = buildPrehabSession('B');
  }
  
  // 3. User Input (Alternative)
  if (sportText.trim().length > 0) {
    const userCat = mapSport(sportText);
    const planType = primary.discipline.toLowerCase();
    const isCompatible = (
      (planType.includes('run') && userCat === 'run') ||
      (planType.includes('hike') && userCat === 'hike') ||
      (planType.includes('pulka') && userCat === 'pulka') ||
      (planType.includes('strength') && userCat === 'strength') ||
      (planType.includes('recovery') && (userCat === 'mobility' || userCat === 'rest')) ||
      planType.includes(userCat)
    );

    if (!isCompatible && userCat !== 'other') {
       const { text: newDuration, note: conversionNote } = calculateAlternativeDuration(primary.duration_text, primary.discipline, userCat);
       alternative = { label: `Alternative: ${sportText}`, discipline: userCat, duration_text: newDuration, intensity: primary.intensity, notes: [conversionNote] };
    } else if (!isCompatible && userCat === 'other') {
       alternative = { label: `Alternative: ${sportText}`, discipline: userCat, duration_text: primary.duration_text, intensity: "Nach Gefühl", notes: ["Sportart nicht erkannt. Dauer übernommen."] };
    }
  }

  // 4. Attach Actual Data if available
  const actual = getAggregatedHistory(dateStr, history);

  return { date: dateStr, phase, week, primary, alternative, prehab, isSpecial, actual };
}

export function getFullWeekPlan(dateStr: string, history: HistoryEntry[] = []): DayPlan[] {
    // Use UTC to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day));
    const currentDow = startDate.getUTCDay();
    const diff = currentDow === 0 ? -6 : 1 - currentDow;
    const monday = new Date(startDate);
    monday.setUTCDate(startDate.getUTCDate() + diff);

    const days: DayPlan[] = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setUTCDate(monday.getUTCDate() + i);
        const dStr = formatDate(d);

        // Find actuals for this day
        const actual = getAggregatedHistory(dStr, history);

        try {
            const suggestion = generateSuggestion(dStr, "");
            days.push({
                date: dStr,
                dow: d.getUTCDay(),
                session: suggestion.primary,
                actual
            });
        } catch (e) {
             days.push({
                date: dStr,
                dow: d.getUTCDay(),
                session: { label: "Out of Plan", discipline: "-", duration_text: "-", intensity: "-", notes: [] },
                actual
            });
        }
    }
    return days;
}
import { Phase, WeekConfig, TrainingSession } from '../types';

export const PHASES: Phase[] = [
  {
    key: "volumen",
    label: "Volumen",
    date_from: "2025-10-06",
    date_to: "2025-11-30",
    weekday_templates: {
      mon: { type: "recovery_or_c2_ab", dur_min: [45, 60] },
      tue: { type: "quality_intense_or_steady", dur_min: [60, 90] },
      wed: { type: "pulka", dur_min: [60, 90] },
      thu: { type: "strength_kb_mace_clubs_or_ga2", dur_min: [40, 60] },
      fri: { type: "c2_ab_bike_easy", dur_min: [40, 60] },
      sat: { type: "longrun", dur_min: "by_week_calendar" },
      sun: { type: "b2b", dur_min: "by_week_calendar", ratio_of_sat: 0.6 }
    }
  },
  {
    key: "spezifisch",
    label: "Spezifisch",
    date_from: "2025-12-01",
    date_to: "2026-01-18",
    weekday_templates: {
      mon: { type: "recovery_or_c2_ab", dur_min: [45, 60] },
      tue: { type: "quality_intense_or_steady", dur_min: [70, 90] },
      wed: { type: "pulka", dur_min: [90, 110] },
      thu: { type: "strength_kb_mace_clubs_or_ga2", dur_min: [40, 60] },
      fri: { type: "c2_ab_bike_easy", dur_min: [40, 60] },
      sat: { type: "longrun", dur_min: "by_week_calendar" },
      sun: { type: "b2b", dur_min: "by_week_calendar", ratio_of_sat: 0.6 }
    }
  },
  {
    key: "peak",
    label: "Peak",
    date_from: "2026-01-19",
    date_to: "2026-02-01",
    weekday_templates: {
      mon: { type: "recovery_or_c2_ab", dur_min: [30, 50] },
      tue: { type: "steady_short", dur_min: [60, 70] },
      wed: { type: "pulka", dur_min: [90, 100] },
      thu: { type: "stability_only", dur_min: [30, 40] },
      fri: { type: "c2_ab_bike_very_easy", dur_min: [30, 45] },
      sat: { type: "longrun_peak", dur_min: "by_week_calendar" },
      sun: { type: "b2b_peak", dur_min: "by_week_calendar", ratio_of_sat: 0.55 }
    }
  },
  {
    key: "taper",
    label: "Taper",
    date_from: "2026-02-02",
    date_to: "2026-03-01",
    weekday_templates: {
      mon: { type: "very_easy", dur_min: [20, 40] },
      tue: { type: "priming_short", dur_min: [35, 50] },
      wed: { type: "pulka_very_easy", dur_min: [25, 45] },
      thu: { type: "rest_or_mobility", dur_min: [0, 20] },
      fri: { type: "very_easy", dur_min: [20, 40] },
      sat: { type: "easy_short", dur_min: [30, 60] },
      sun: { type: "shakeout_or_rest", dur_min: [0, 30] }
    }
  }
];

export const WEEKS: WeekConfig[] = [
  { range: "2025-10-06..2025-10-12", hours_target: 8.5, long_sat: [105, 120] },
  { range: "2025-10-13..2025-10-19", hours_target: 9.5, long_sat: [135, 135] },
  { range: "2025-10-20..2025-10-26", hours_target: 10.5, long_sat: [165, 180] },
  { range: "2025-10-27..2025-11-02", hours_target: 7.8, long_sat: [120, 120] }, // Deload
  { range: "2025-11-03..2025-11-09", hours_target: 11.0, long_sat: [195, 195] },
  { range: "2025-11-10..2025-11-16", hours_target: 12.0, long_sat: [210, 210] },
  { range: "2025-11-17..2025-11-23", hours_target: 12.5, long_sat: [225, 225] },
  { range: "2025-11-24..2025-11-30", hours_target: 8.0, long_sat: [135, 135] }, // Deload
  { range: "2025-12-01..2025-12-07", hours_target: 12.8, long_sat: [240, 240] },
  { range: "2025-12-08..2025-12-14", hours_target: 13.5, long_sat: [260, 280] },
  { range: "2025-12-15..2025-12-21", hours_target: 13.8, long_sat: [280, 300] },
  { range: "2025-12-22..2025-12-28", hours_target: 8.5, long_sat: [135, 150] }, // Deload
  { range: "2025-12-29..2026-01-04", hours_target: 10.0, long_sat: [195, 210] },
  { range: "2026-01-05..2026-01-11", hours_target: 12.0 }, // Deload
  { range: "2026-01-12..2026-01-18", hours_target: 11.5, long_sat: [270, 300] },
  { range: "2026-01-19..2026-01-25", hours_target: 15.0, long_sat: [300, 320], b2b_sun: [150, 180] },
  { range: "2026-01-26..2026-02-01", hours_target: 15.0, special: "mini_expedition" },
  { range: "2026-02-02..2026-02-08", hours_target: 15.5, long_sat: [300, 300] },
  { range: "2026-02-09..2026-02-15", hours_target: 16.5, special: "4x4x48" },
  { range: "2026-02-16..2026-02-22", hours_target: 5.2 },
  { range: "2026-02-23..2026-03-01", hours_target: 2.8, special: "race_week" },
];

export const SPORT_MAP: Record<string, string[]> = {
  run: ["run", "laufen", "jog", "trail", "trailrun", "lauf", "tempo", "hügel"],
  hike: ["hike", "wandern", "gehen", "marsch"],
  pulka: ["pulka", "reifen", "reifenziehen", "zug", "gewichtsweste", "lastmarsch"],
  virtualride: ["virtualride", "zwift", "rolle", "rollentrainer", "trainerroad", "indoor bike"],
  bike: ["bike", "rad", "ride", "rennrad", "mtb", "ebike"],
  row: ["c2", "rudern", "rowing", "concept2"],
  airbike: ["airbike", "assault"],
  strength: ["kb", "kettlebell", "mace", "club", "clubbell", "kraft", "crossfit", "wod", "stabi"]
};

// --- Daily Overrides for "Naked-Trainingsplan" ---
export const DAILY_OVERRIDES: Record<string, { primary: TrainingSession, alternative: TrainingSession }> = {
  // Woche 2025-W50
  "2025-12-13": {
    primary: { label: "Walk/Hund + Rudern (C2)", discipline: "mixed", duration_text: "60m + 30m (7.2km)", intensity: "EASY", notes: ["FOKUS: Ist: locker bewegen, Wiedereinstieg"] },
    alternative: { label: "Ruck/Walk (Stöcke)", discipline: "ruck", duration_text: "60-90m", intensity: "EASY", notes: [] }
  },
  "2025-12-14": {
    primary: { label: "Ruck/Walk (Stöcke)", discipline: "ruck", duration_text: "1h45-2h15", intensity: "EASY", notes: ["FOKUS: Back-to-back starten, Technik/Rhythmus, flach"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "75-90m + 30m", intensity: "Z1", notes: ["wenn Wetter/Rücken"] }
  },

  // Woche 2025-W51
  "2025-12-15": {
    primary: { label: "Zwift Z1 oder Spaziergang", discipline: "recovery", duration_text: "45-60m", intensity: "VERY_EASY", notes: ["FOKUS: Regeneration, optional Maintenance 6-8m"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2025-12-16": {
    primary: { label: "Ruck/Walk (Stöcke)", discipline: "ruck", duration_text: "1h30", intensity: "EASY", notes: ["FOKUS: GA1, gleichmäßig; Pack wie gewohnt"] },
    alternative: { label: "Incline-Hike (Treadmill)", discipline: "hike", duration_text: "60-75m", intensity: "EASY", notes: [] }
  },
  "2025-12-17": {
    primary: { label: "Kraft (Ganzkörper) + Walk/Jog", discipline: "strength", duration_text: "45m + 20-30m", intensity: "STRENGTH", notes: ["FOKUS: Robustheit; Jog nur wenn Knie/Rücken 0-2/10"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45-60m", intensity: "Z2", notes: ["wenn Kraft ausfällt"] }
  },
  "2025-12-18": {
    primary: { label: "Hügel: 6×4' bergauf zügig gehen", discipline: "hike", duration_text: "75-90m", intensity: "HILL", notes: ["FOKUS: RPE~6 bergauf; runter locker (Knie)"] },
    alternative: { label: "Treadmill-Incline: 6×4'", discipline: "hike", duration_text: "75-90m", intensity: "HILL", notes: ["RPE6"] }
  },
  "2025-12-19": {
    primary: { label: "Zwift Z1 oder Walk", discipline: "recovery", duration_text: "60m", intensity: "EASY", notes: ["FOKUS: Locker rollen/gehen; Maintenance 6-8m"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "40m", intensity: "EASY", notes: [] }
  },
  "2025-12-20": {
    primary: { label: "Long 1: Ruck EASY", discipline: "ruck", duration_text: "3h00", intensity: "EASY", notes: ["FOKUS: Split ok (2h00 + 1h00); Fuel testen"] },
    alternative: { label: "2×90m Walk/Ruck", discipline: "ruck", duration_text: "2x90m", intensity: "EASY", notes: ["mit 60-90m Pause"] }
  },
  "2025-12-21": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "2h30", intensity: "EASY", notes: ["FOKUS: Müde Beine, Tempo bleibt easy; Stöcke"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "60-75m + 45m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2025-W52
  "2025-12-22": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "45m", intensity: "VERY_EASY", notes: ["FOKUS: Regeneration"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2025-12-23": {
    primary: { label: "Ruck EASY (Stöcke)", discipline: "ruck", duration_text: "1h45", intensity: "EASY", notes: ["FOKUS: 20' zügiges Marschtempo eingebaut"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "75-90m", intensity: "EASY", notes: [] }
  },
  "2025-12-24": {
    primary: { label: "Kraft (Ganzkörper) + Walk", discipline: "strength", duration_text: "45m + 20m", intensity: "STRENGTH", notes: ["FOKUS: Robustheit; kein Muskelkater erzwingen"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45-60m", intensity: "Z2", notes: [] }
  },
  "2025-12-25": {
    primary: { label: "Ziehen light (Pulk/Tire) ODER Incline-Hike", discipline: "pulka", duration_text: "60-75m", intensity: "STEADY", notes: ["FOKUS: Technik vor Gewicht; Rücken neutral"] },
    alternative: { label: "Ruck", discipline: "ruck", duration_text: "75-90m", intensity: "EASY", notes: ["Pack light"] }
  },
  "2025-12-26": {
    primary: { label: "Zwift Z1", discipline: "virtualride", duration_text: "60-75m", intensity: "EASY", notes: ["FOKUS: Locker + Maintenance 6-8m"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "45m", intensity: "EASY", notes: [] }
  },
  "2025-12-27": {
    primary: { label: "Long 1: Ruck EASY", discipline: "ruck", duration_text: "3h45", intensity: "EASY", notes: ["FOKUS: Split ok; Fuel/Hands/Layer testen"] },
    alternative: { label: "2×2h00 Walk/Ruck", discipline: "ruck", duration_text: "2x2h00", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2025-12-28": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "3h00", intensity: "EASY", notes: ["FOKUS: Stöcke konsequent; gleichmäßig"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "75-90m + 60m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W01
  "2025-12-29": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "45-60m", intensity: "VERY_EASY", notes: ["FOKUS: Regeneration"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-45m", intensity: "EASY", notes: [] }
  },
  "2025-12-30": {
    primary: { label: "Ruck EASY (Stöcke)", discipline: "ruck", duration_text: "2h00", intensity: "EASY", notes: ["FOKUS: 2×15' Marschtempo, sonst easy"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "90m", intensity: "EASY", notes: [] }
  },
  "2025-12-31": {
    primary: { label: "Kraft (Ganzkörper) + Walk/Jog", discipline: "strength", duration_text: "45m + 20-30m", intensity: "STRENGTH", notes: ["FOKUS: Stabilität; Jog optional (nur grün)"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45-60m", intensity: "Z2", notes: [] }
  },
  "2026-01-01": {
    primary: { label: "Hügel: 5×5' bergauf zügig gehen", discipline: "hike", duration_text: "90m", intensity: "HILL", notes: ["FOKUS: RPE~6; runter locker; sauberer Rumpf"] },
    alternative: { label: "Treadmill-Incline 5×5'", discipline: "hike", duration_text: "90m", intensity: "HILL", notes: [] }
  },
  "2026-01-02": {
    primary: { label: "Zwift Z1 oder Walk", discipline: "recovery", duration_text: "60m", intensity: "EASY", notes: ["FOKUS: Locker + Maintenance 6-8m"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "40-50m", intensity: "EASY", notes: [] }
  },
  "2026-01-03": {
    primary: { label: "Long 1: Ruck EASY", discipline: "ruck", duration_text: "4h15", intensity: "EASY", notes: ["FOKUS: Split ideal (2h30 + 1h45); Fuel"] },
    alternative: { label: "2×2h15 Walk/Ruck", discipline: "ruck", duration_text: "2x2h15", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-01-04": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "3h30", intensity: "EASY", notes: ["FOKUS: Konstant; Füße pflegen (Hotspots)"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "90m + 90m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W02 (DELOAD)
  "2026-01-05": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "40-50m", intensity: "VERY_EASY", notes: ["FOKUS: DELOAD: locker, Durchblutung"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "25-35m", intensity: "EASY", notes: [] }
  },
  "2026-01-06": {
    primary: { label: "Ruck/Walk EASY", discipline: "ruck", duration_text: "75-90m", intensity: "EASY", notes: ["FOKUS: DELOAD: flach & locker"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "60-75m", intensity: "EASY", notes: [] }
  },
  "2026-01-07": {
    primary: { label: "Kraft light + Walk", discipline: "strength", duration_text: "35-40m + 20m", intensity: "STRENGTH_L", notes: ["FOKUS: DELOAD: nur 2 Sätze; sauber"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45m", intensity: "Z2", notes: ["leicht"] }
  },
  "2026-01-08": {
    primary: { label: "Hügel: 6×2' bergauf zügig gehen", discipline: "hike", duration_text: "60-75m", intensity: "HILL", notes: ["FOKUS: DELOAD: kurze Reize, keine Härte"] },
    alternative: { label: "Treadmill-Incline 6×2'", discipline: "hike", duration_text: "60-75m", intensity: "HILL", notes: [] }
  },
  "2026-01-09": {
    primary: { label: "Zwift Z1 oder Walk + Maintenance", discipline: "recovery", duration_text: "45-60m", intensity: "VERY_EASY", notes: ["FOKUS: DELOAD: locker + Maintenance 6-8m"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2026-01-10": {
    primary: { label: "Long 1: Ruck/Walk EASY", discipline: "ruck", duration_text: "3h00", intensity: "EASY", notes: ["FOKUS: DELOAD: ruhig, keine Last-Steigerung"] },
    alternative: { label: "2×90m Walk", discipline: "ruck", duration_text: "2x90m", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-01-11": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "2h30", intensity: "EASY", notes: ["FOKUS: DELOAD: Schritte kurz, Rücken ruhig"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "60-75m + 45m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W03
  "2026-01-12": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "45m", intensity: "VERY_EASY", notes: ["FOKUS: Regeneration nach Deload"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2026-01-13": {
    primary: { label: "Ruck EASY (Stöcke)", discipline: "ruck", duration_text: "2h15", intensity: "EASY", notes: ["FOKUS: 1×30' Marschtempo, sonst easy"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "90-105m", intensity: "EASY", notes: [] }
  },
  "2026-01-14": {
    primary: { label: "Kraft (Ganzkörper) + Walk/Jog", discipline: "strength", duration_text: "45m + 20-30m", intensity: "STRENGTH", notes: ["FOKUS: Robustheit; Jog optional (nur grün)"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45-60m", intensity: "Z2", notes: [] }
  },
  "2026-01-15": {
    primary: { label: "Ziehen (Pulk/Tire) ODER Incline-Hike", discipline: "pulka", duration_text: "75-90m", intensity: "STEADY", notes: ["FOKUS: Technik + Kraftausdauer; Rücken neutral"] },
    alternative: { label: "Ruck", discipline: "ruck", duration_text: "90m", intensity: "EASY", notes: ["Pack moderat"] }
  },
  "2026-01-16": {
    primary: { label: "Zwift Z1 + Maintenance", discipline: "virtualride", duration_text: "60-75m", intensity: "EASY", notes: ["FOKUS: Locker rollen; Maintenance 6-8m"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "45m", intensity: "EASY", notes: [] }
  },
  "2026-01-17": {
    primary: { label: "Long 1: Ruck EASY", discipline: "ruck", duration_text: "5h00", intensity: "EASY", notes: ["FOKUS: Split ideal (3h00 + 2h00); Fuel konsequent"] },
    alternative: { label: "2×2h45 Walk/Ruck", discipline: "ruck", duration_text: "2x2h45", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-01-18": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "4h00", intensity: "EASY", notes: ["FOKUS: Müde Beine; gleichmäßig; Füße pflegen"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "120m + 60m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W04
  "2026-01-19": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "45m", intensity: "VERY_EASY", notes: ["FOKUS: Regeneration"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2026-01-20": {
    primary: { label: "Hügel: 6×4' bergauf zügig gehen", discipline: "hike", duration_text: "90m", intensity: "HILL", notes: ["FOKUS: RPE~6; runter locker; sauberer Rumpf"] },
    alternative: { label: "Treadmill-Incline 6×4'", discipline: "hike", duration_text: "90m", intensity: "HILL", notes: [] }
  },
  "2026-01-21": {
    primary: { label: "Kraft (Ganzkörper) + Walk", discipline: "strength", duration_text: "45m + 20m", intensity: "STRENGTH", notes: ["FOKUS: Stabilität, Hüfte/Rumpf"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45-60m", intensity: "Z2", notes: [] }
  },
  "2026-01-22": {
    primary: { label: "Ruck EASY (flach)", discipline: "ruck", duration_text: "2h30", intensity: "EASY", notes: ["FOKUS: Gleichmäßig; Stöcke; Fuel üben"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "90m + 60m", intensity: "Z1/EASY", notes: [] }
  },
  "2026-01-23": {
    primary: { label: "Ziehen EASY + Maintenance", discipline: "pulka", duration_text: "60-75m", intensity: "EASY", notes: ["FOKUS: Techniktag; keine Last-PRs; Maintenance 6-8m"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "60-75m", intensity: "EASY", notes: [] }
  },
  "2026-01-24": {
    primary: { label: "Long 1: Ruck EASY", discipline: "ruck", duration_text: "5h30", intensity: "EASY", notes: ["FOKUS: Split empfohlen; race-nahes Setup testen"] },
    alternative: { label: "2×3h00 Walk/Ruck", discipline: "ruck", duration_text: "2x3h00", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-01-25": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "4h30", intensity: "EASY", notes: ["FOKUS: Stöcke; gleichmäßig; Recovery nachher"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "120m + 60m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W05
  "2026-01-26": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "45m", intensity: "VERY_EASY", notes: ["FOKUS: Regeneration"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2026-01-27": {
    primary: { label: "Ruck EASY", discipline: "ruck", duration_text: "2h00", intensity: "EASY", notes: ["FOKUS: Wenn grün: Pack minimal schwerer ODER nur länger"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "90m", intensity: "EASY", notes: [] }
  },
  "2026-01-28": {
    primary: { label: "Kraft light + Walk", discipline: "strength", duration_text: "35-40m + 20m", intensity: "STRENGTH_L", notes: ["FOKUS: Mini-Camp-Prep: nur 2 Sätze; keine DOMS"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45m", intensity: "Z2", notes: ["leicht"] }
  },
  "2026-01-29": {
    primary: { label: "Ziehen (Pulk/Tire) moderat ODER Incline-Hike", discipline: "pulka", duration_text: "90m", intensity: "STEADY", notes: ["FOKUS: Technik + Kraftausdauer; Rücken neutral"] },
    alternative: { label: "Ruck", discipline: "ruck", duration_text: "90m", intensity: "EASY", notes: ["Pack moderat"] }
  },
  "2026-01-30": {
    primary: { label: "Mini-Camp Tag 1: Ruck EASY", discipline: "ruck", duration_text: "2h00", intensity: "EASY", notes: ["FOKUS: Start 3-Tages-Block; Fuel/Layer Routine"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "60-75m + 30m", intensity: "Z1/EASY", notes: [] }
  },
  "2026-01-31": {
    primary: { label: "Mini-Camp Tag 2: Long Ruck EASY", discipline: "ruck", duration_text: "6h00", intensity: "EASY", notes: ["FOKUS: Split ok; race-nahes Setup; Füße/Handschuhe testen"] },
    alternative: { label: "2×3h15 Walk/Ruck", discipline: "ruck", duration_text: "2x3h15", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-02-01": {
    primary: { label: "Mini-Camp Tag 3: Long Ruck/Walk EASY", discipline: "ruck", duration_text: "4h30", intensity: "EASY", notes: ["FOKUS: Müde Beine; konstant; Recovery danach"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "150m + 60m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W06
  "2026-02-02": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "40-50m", intensity: "VERY_EASY", notes: ["FOKUS: Recovery nach Mini-Camp"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "25-35m", intensity: "EASY", notes: [] }
  },
  "2026-02-03": {
    primary: { label: "Hügel: 5×6' bergauf zügig gehen", discipline: "hike", duration_text: "90m", intensity: "HILL", notes: ["FOKUS: RPE~6; Fokus Technik + Rumpf"] },
    alternative: { label: "Treadmill-Incline 5×6'", discipline: "hike", duration_text: "90m", intensity: "HILL", notes: [] }
  },
  "2026-02-04": {
    primary: { label: "Kraft (Ganzkörper) + Walk", discipline: "strength", duration_text: "45m + 20m", intensity: "STRENGTH", notes: ["FOKUS: Robustheit; kein Muskelkater"] },
    alternative: { label: "Zwift Z2", discipline: "virtualride", duration_text: "45-60m", intensity: "Z2", notes: [] }
  },
  "2026-02-05": {
    primary: { label: "Ruck EASY (flach)", discipline: "ruck", duration_text: "2h00", intensity: "EASY", notes: ["FOKUS: 30-45' Marschtempo am Stück (kontrolliert)"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "90m + 45m", intensity: "Z1/EASY", notes: [] }
  },
  "2026-02-06": {
    primary: { label: "Ziehen EASY + Maintenance", discipline: "pulka", duration_text: "60-75m", intensity: "EASY", notes: ["FOKUS: Technik; Maintenance 6-8m"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "60-75m", intensity: "EASY", notes: [] }
  },
  "2026-02-07": {
    primary: { label: "Long 1: Ruck EASY", discipline: "ruck", duration_text: "5h00", intensity: "EASY", notes: ["FOKUS: Split ok; Fuel konsequent; Stöcke"] },
    alternative: { label: "2×2h45 Walk/Ruck", discipline: "ruck", duration_text: "2x2h45", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-02-08": {
    primary: { label: "Long 2: Ruck/Walk EASY", discipline: "ruck", duration_text: "4h00", intensity: "EASY", notes: ["FOKUS: Konstant; Füße pflegen; schlafen/essen priorisieren"] },
    alternative: { label: "Zwift Z1 + Walk", discipline: "mixed", duration_text: "120m + 90m", intensity: "Z1/EASY", notes: [] }
  },

  // Woche 2026-W07
  "2026-02-09": {
    primary: { label: "Spaziergang oder Zwift Z1", discipline: "recovery", duration_text: "45m", intensity: "VERY_EASY", notes: ["FOKUS: Freshen up für 4x4x48 (kein Taper-Block, nur smart)"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30-40m", intensity: "EASY", notes: [] }
  },
  "2026-02-10": {
    primary: { label: "Ruck/Walk EASY (Stöcke)", discipline: "ruck", duration_text: "1h30", intensity: "EASY", notes: ["FOKUS: Locker; keine Last-Steigerung; Schritte kurz"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "60-75m", intensity: "EASY", notes: [] }
  },
  "2026-02-11": {
    primary: { label: "Kraft very light + Walk", discipline: "strength", duration_text: "25-30m + 20m", intensity: "STRENGTH_VL", notes: ["FOKUS: Nur Aktivierung (Rumpf/Glutes); keine DOMS"] },
    alternative: { label: "Zwift Z1", discipline: "virtualride", duration_text: "45-60m", intensity: "Z1", notes: [] }
  },
  "2026-02-12": {
    primary: { label: "Zwift Z1 oder Walk", discipline: "recovery", duration_text: "45-60m", intensity: "VERY_EASY", notes: ["FOKUS: Beine locker; Schlaf/Fuel vorbereiten"] },
    alternative: { label: "Rudern locker", discipline: "row", duration_text: "30m", intensity: "EASY", notes: [] }
  },
  "2026-02-13": {
    primary: { label: "4x4x48 (Goggins) Run #1-2", discipline: "run", duration_text: "2×4mi (Start 16:00 + 20:00)", intensity: "EASY", notes: ["FOKUS: EASY run/walk; Fuel + Warmhalten; kein Tempo"] },
    alternative: { label: "Treadmill 2×4mi", discipline: "run", duration_text: "2×4mi (gleiches Timing)", intensity: "EASY", notes: [] }
  },
  "2026-02-14": {
    primary: { label: "4x4x48 (Goggins) Run #3-8", discipline: "run", duration_text: "6×4mi (00/04/08/12/16/20)", intensity: "EASY", notes: ["FOKUS: EASY run/walk; Fußpflege zwischen Läufen; essen/trinken"] },
    alternative: { label: "Treadmill 6×4mi", discipline: "run", duration_text: "6×4mi (same schedule)", intensity: "EASY", notes: [] }
  },
  "2026-02-15": {
    primary: { label: "4x4x48 (Goggins) Run #9-12", discipline: "run", duration_text: "4×4mi (00/04/08/12)", intensity: "EASY", notes: ["FOKUS: EASY run/walk; letzter Lauf sauber; danach Recovery"] },
    alternative: { label: "Treadmill 4×4mi", discipline: "run", duration_text: "4×4mi (same schedule)", intensity: "EASY", notes: [] }
  },

  // Woche 2026-W08
  "2026-02-16": {
    primary: { label: "Recovery Walk", discipline: "recovery", duration_text: "30-60m", intensity: "VERY_EASY", notes: ["FOKUS: Nach 4x4x48: nur lockern, viel essen/schlafen"] },
    alternative: { label: "Zwift Z1", discipline: "virtualride", duration_text: "30-45m", intensity: "Z1", notes: ["sehr locker"] }
  },
  "2026-02-17": {
    primary: { label: "Zwift Z1 oder Rudern locker", discipline: "recovery", duration_text: "45-60m", intensity: "VERY_EASY", notes: ["FOKUS: Durchblutung, Rücken/Knie checken"] },
    alternative: { label: "Walk", discipline: "recovery", duration_text: "60m", intensity: "VERY_EASY", notes: ["flach"] }
  },
  "2026-02-18": {
    primary: { label: "Kraft light + Walk", discipline: "strength", duration_text: "30-35m + 20m", intensity: "STRENGTH_L", notes: ["FOKUS: Wieder aktivieren; kein Muskelkater"] },
    alternative: { label: "Zwift Z1", discipline: "virtualride", duration_text: "45m", intensity: "Z1", notes: ["locker"] }
  },
  "2026-02-19": {
    primary: { label: "Ruck EASY (Stöcke)", discipline: "ruck", duration_text: "2h00", intensity: "EASY", notes: ["FOKUS: Zurück in Rhythmus; 20-30' Marschtempo"] },
    alternative: { label: "Incline-Hike", discipline: "hike", duration_text: "90m", intensity: "EASY", notes: [] }
  },
  "2026-02-20": {
    primary: { label: "Ziehen light + Maintenance", discipline: "pulka", duration_text: "60-75m", intensity: "EASY", notes: ["FOKUS: Technik; Maintenance 6-8m; früh schlafen"] },
    alternative: { label: "Ruck", discipline: "ruck", duration_text: "75-90m", intensity: "EASY", notes: [] }
  },
  "2026-02-21": {
    primary: { label: "Letzter harter Tag: Long Ruck (race-nah)", discipline: "ruck", duration_text: "4h00-4h30", intensity: "EASY", notes: ["FOKUS: Gear/Fuel/Routine; 45-60' Marschtempo eingebaut"] },
    alternative: { label: "2×2h15 Walk/Ruck", discipline: "ruck", duration_text: "2x2h15", intensity: "EASY", notes: ["mit Pause"] }
  },
  "2026-02-22": {
    primary: { label: "Taper: Walk sehr locker", discipline: "recovery", duration_text: "60-90m", intensity: "VERY_EASY", notes: ["FOKUS: Beine vertreten, keine Last, viel trinken"] },
    alternative: { label: "Zwift Z1 locker", discipline: "virtualride", duration_text: "45m", intensity: "Z1", notes: [] }
  },

  // Woche 2026-W09 (RACE WEEK)
  "2026-02-23": {
    primary: { label: "Reisetag: Walk locker + Mobility", discipline: "recovery", duration_text: "20-40m + 5-10m", intensity: "VERY_EASY", notes: ["FOKUS: Durchblutung; im Flug regelmäßig aufstehen"] },
    alternative: { label: "Zwift Z1", discipline: "virtualride", duration_text: "20-30m", intensity: "Z1", notes: ["wenn möglich"] }
  },
  "2026-02-24": {
    primary: { label: "Training Course (Kälte/Überleben) Tag 1", discipline: "skills", duration_text: "kursabhängig", intensity: "SKILLS/EASY", notes: ["FOKUS: Skills + Zeit draußen; keine Extra-Härte"] },
    alternative: { label: "Walk locker", discipline: "recovery", duration_text: "30-60m", intensity: "VERY_EASY", notes: ["wenn müde"] }
  },
  "2026-02-25": {
    primary: { label: "Training Course Tag 2", discipline: "skills", duration_text: "kursabhängig", intensity: "SKILLS/EASY", notes: ["FOKUS: Ausrüstung/Layer/Handschuhe; Füße pflegen"] },
    alternative: { label: "Zwift Z1", discipline: "virtualride", duration_text: "30-45m", intensity: "Z1", notes: ["wenn indoor"] }
  },
  "2026-02-26": {
    primary: { label: "Training Course Tag 3", discipline: "skills", duration_text: "kursabhängig", intensity: "SKILLS/EASY", notes: ["FOKUS: Snowshoes/Poles Handling; ruhig bleiben"] },
    alternative: { label: "Walk locker", discipline: "recovery", duration_text: "30-60m", intensity: "VERY_EASY", notes: [] }
  },
  "2026-02-27": {
    primary: { label: "Training Course Tag 4", discipline: "skills", duration_text: "kursabhängig", intensity: "SKILLS/EASY", notes: ["FOKUS: Check: Essen/Trinken/Schlafen priorisieren"] },
    alternative: { label: "Komplett frei + Mobility", discipline: "recovery", duration_text: "10m", intensity: "VERY_EASY", notes: [] }
  },
  "2026-02-28": {
    primary: { label: "Briefing/Gear Check + lockeres Gehen", discipline: "recovery", duration_text: "30-60m", intensity: "VERY_EASY", notes: ["FOKUS: Organisation; Beine locker; früh schlafen"] },
    alternative: { label: "Komplett frei + Mobility", discipline: "recovery", duration_text: "10m", intensity: "VERY_EASY", notes: [] }
  },
  "2026-03-01": {
    primary: { label: "RACE START (LAU 185k Foot)", discipline: "race", duration_text: "Event", intensity: "RACE", notes: ["FOKUS: Starttag: ruhig, Routine, Fuel früh"] },
    alternative: { label: "—", discipline: "race", duration_text: "—", intensity: "—", notes: [] }
  }
};

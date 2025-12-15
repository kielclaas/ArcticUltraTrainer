
export type SportCategory = 
  | 'run' 
  | 'hike' 
  | 'pulka' 
  | 'virtualride' 
  | 'bike' 
  | 'row' 
  | 'airbike' 
  | 'strength' 
  | 'mobility' 
  | 'rest' 
  | 'other';

export interface WeekdayTemplate {
  type: string;
  dur_min: number[] | "by_week_calendar"; // [min, max]
  ratio_of_sat?: number;
}

export interface Phase {
  key: string;
  label: string;
  date_from: string; // YYYY-MM-DD
  date_to: string;   // YYYY-MM-DD
  weekday_templates: {
    mon: WeekdayTemplate;
    tue: WeekdayTemplate;
    wed: WeekdayTemplate;
    thu: WeekdayTemplate;
    fri: WeekdayTemplate;
    sat: WeekdayTemplate;
    sun: WeekdayTemplate;
  };
}

export interface WeekConfig {
  range: string; // "YYYY-MM-DD..YYYY-MM-DD"
  hours_target: number;
  long_sat?: number[]; // [min, max]
  b2b_sun?: number[]; // [min, max] override
  special?: "4x4x48" | "mini_expedition" | "race_week";
}

export interface HistoryEntry {
  date: string;
  sport: string;
  duration_min: number;
  distance_km?: number;
  original_string?: string;
}

export interface SuggestionOutput {
  date: string;
  phase: Phase;
  week: WeekConfig;
  primary: TrainingSession;
  alternative: TrainingSession | null;
  prehab: TrainingSession | null;
  isSpecial: boolean;
  actual?: HistoryEntry; // aggregated actual data
}

export interface TrainingSession {
  label: string;
  discipline: string;
  duration_text: string;
  intensity: string;
  notes: string[];
}

export interface DayPlan {
  date: string;
  dow: number; // 0=Sun, 1=Mon...
  session: TrainingSession;
  actual?: HistoryEntry; // aggregated actual data
}

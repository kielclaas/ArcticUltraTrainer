# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arctic Ultra Trainer is a specialized training planner for the Lappland Arctic Ultra 2026 race. It's a React/TypeScript web application that generates daily workout suggestions based on a periodized training plan, integrates with Runalyze for activity tracking, and provides weekly volume visualization.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Environment Setup

The app requires a Gemini API key for AI features. Create a `.env.local` file:

```
GEMINI_API_KEY=your_api_key_here
```

The Vite config exposes this as `process.env.GEMINI_API_KEY` in the app.

## Architecture Overview

### Core Engine (`services/engine.ts`)

The training suggestion engine is the heart of the application:

- **Phase System**: Training plan divided into phases (Volumen, Spezifisch, Peak, Taper) with date ranges and weekday templates
- **Week Configuration**: Each week has volume targets, long run durations, and special events (4x4x48, mini_expedition, race_week)
- **Daily Overrides**: Manually defined workouts for specific dates in `DAILY_OVERRIDES` (services/planData.ts)
- **Sport Conversion Logic**: Automatically adjusts workout duration when user substitutes sports (e.g., converting hike duration to bike duration with metabolic equivalence factors)
- **History Integration**: Aggregates multiple activities per day and compares actual vs. planned training

Key functions:
- `generateSuggestion(date, sport, history)`: Returns primary/alternative/prehab sessions for a date
- `getFullWeekPlan(date, history)`: Returns 7-day plan starting from Monday of selected date
- `parseDurationMin(text)`: Parses duration strings like "90-120 min", "2h15", "4x8'", "60+30"

### Data Flow

1. User selects date and optional sport preference
2. Engine finds matching Phase and WeekConfig from planData
3. Engine generates primary workout from either:
   - Daily override (if exists for that date)
   - Special week type (4x4x48, mini_expedition, race_week)
   - Standard weekday template calculation
4. If user sport differs from plan, engine calculates alternative with duration conversion
5. Engine attaches prehab sessions for Monday (A) and Friday (B) outside race weeks
6. Engine merges actual history data for that date (if available)
7. UI displays suggestion with primary/alternative/prehab sessions + actual completed

### Training Data Import

**Runalyze Integration** (`services/runalyze.ts`):
- Fetches activities via Runalyze API with token authentication
- CORS handling: Direct fetch first, falls back to corsproxy.io if needed
- Maps activities to `HistoryEntry` format (date, sport, duration_min, distance_km)

**CSV Import** (`services/importer.ts`):
- Parses tab or semicolon-delimited CSV exports
- Auto-detects columns: Date (DD.MM.YYYY), Duration (H:MM:SS), Distance, Sport
- Robust parsing handles Runalyze export format

**Data Persistence**:
- Local: Browser localStorage (`arctic_ultra_history`)
- Cloud: Firebase Firestore (optional, requires config in `services/firebase.ts`)
- Merge strategy: Deduplicates by date + sport + duration before sync

### Firebase Integration (Optional)

Firebase config in `services/firebase.ts` is **disabled by default** (placeholder values). When configured:
- Google OAuth authentication
- Syncs training history to Firestore (`users/{uid}/history`)
- Stores Runalyze API token in user settings
- Auto-loads cloud data on login

Check with `isFirebaseConfigured` before using auth features.

### Phase and Week Data Structure

All training plan data lives in `services/planData.ts`:

- `PHASES`: Array of training phases with weekday templates
  - Each weekday has `type` (e.g., "recovery_or_c2_ab") and `dur_min` (range or "by_week_calendar")
  - Templates use `ratio_of_sat` for back-to-back Sunday calculations

- `WEEKS`: Array of week configs with date ranges
  - `hours_target`: Weekly volume target
  - `long_sat`: Saturday long run duration [min, max]
  - `b2b_sun`: Optional Sunday back-to-back override
  - `special`: Special week types override normal templates

- `DAILY_OVERRIDES`: Hardcoded workouts for specific dates (e.g., naked plan from Dec 2025)
  - Each entry has `primary` and `alternative` TrainingSession objects
  - Overrides take precedence over phase/week templates

- `SPORT_MAP`: Maps keywords to sport categories for user input classification

### Component Structure

- `App.tsx`: Main container, manages auth, history sync, date/sport state
- `TrainingForm.tsx`: Date picker and sport input
- `SuggestionCard.tsx`: Displays primary/alternative/prehab sessions with actual data overlay
- `WeeklyOverview.tsx`: Modal showing full 7-day plan
- `WeeklyVolumeChart.tsx`: Visualizes weekly volume with planned vs actual comparison
- `ImportModal.tsx`: Handles Runalyze token setup and CSV import
- `CustomDatePicker.tsx`: Native date input with German locale

## Key Type Definitions (`types.ts`)

- `Phase`: Training phase with date range and weekday templates
- `WeekConfig`: Weekly volume targets and long run configs
- `HistoryEntry`: Actual completed workout (date, sport, duration_min, distance_km)
- `SuggestionOutput`: Generated plan (phase, week, primary, alternative, prehab, actual)
- `TrainingSession`: Workout details (label, discipline, duration_text, intensity, notes)
- `SportCategory`: Union type for recognized sports (run, hike, pulka, strength, etc.)

## Important Implementation Notes

### Sport Conversion Rules

When user selects different sport than planned, engine applies conversion factors:

- Hike/Pulka → Run: 0.5x (impact adjustment)
- Run → Hike/Pulka: 2.0x (reduced intensity)
- Run → Bike: 1.5x (metabolic equivalence)
- Any → Strength: 0.35-0.8x with caps (30-75 min)

See `getConversionRule()` in engine.ts for full matrix.

### Duration Parsing Logic

The `parseDurationMin()` function handles multiple formats:
- Range: "90-120 min" → average (105)
- Addition: "60+30" → sum (90)
- Hours: "2h15" → minutes (135)
- Intervals: "4x8'" → 4×8 if first val < 10 (32)
- Plain: "90" → 90

### History Aggregation

When multiple activities exist for same date:
- Sums total duration and distance
- Concatenates sport names with " + "
- Displays as single aggregated entry in UI
- Used for comparing actual vs planned volume

### CORS Handling for Runalyze

Browser security prevents direct API calls to runalyze.com. The app uses:
1. Direct fetch (works if CORS headers present)
2. Fallback to corsproxy.io (public proxy)
3. Manual CSV import as last resort

Always prefer CSV import instructions for reliability.

## AI Studio Context

This app was created via Google AI Studio and includes metadata for that platform. The `metadata.json` and README reference AI Studio URLs. The app is **fully standalone** and doesn't require AI Studio to run - it's a standard Vite React app.

## Race Event Context

Target race: **Lappland Arctic Ultra 2026** (March 2026)
- Ultra-endurance winter race in Swedish Lapland
- Requires specialized training: pulka (sled) pulling, cold weather endurance
- Training plan spans Oct 2025 - Feb 2026 with specific phases and peak weeks

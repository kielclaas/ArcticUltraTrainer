import { HistoryEntry } from '../types';

export function parseTrainingCSV(csvText: string): HistoryEntry[] {
  const entries: HistoryEntry[] = [];
  const lines = csvText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect separator (Tab or Semicolon)
    const separator = trimmed.includes('\t') ? '\t' : ';';
    const cols = trimmed.split(separator).map(c => c.trim());

    // We need at least 3 columns to be useful (Date, Sport, Duration/Dist)
    if (cols.length < 3) continue;

    // 1. Find Date (DD.MM.YYYY)
    const dateIndex = cols.findIndex(c => /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(c));
    if (dateIndex === -1) continue;

    const [d, m, y] = cols[dateIndex].split('.');
    const date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;

    // 2. Find Duration (H:MM:SS or M:SS)
    // Regex matches 1:00:00 or 45:00
    const durIndex = cols.findIndex(c => /^(\d+:)?\d{1,2}:\d{2}$/.test(c));
    let duration_min = 0;
    
    if (durIndex !== -1) {
       const parts = cols[durIndex].split(':').map(Number);
       if (parts.length === 3) {
           // H:MM:SS
           duration_min = parts[0] * 60 + parts[1]; 
       } else if (parts.length === 2) {
           // H:MM or M:SS. Runalyze uses H:MM:SS usually.
           duration_min = parts[0] * 60 + parts[1];
       }
    }

    // 3. Find Distance (Number + optional km)
    // Exclude date and duration indices
    const distIndex = cols.findIndex((c, i) => {
        if (i === dateIndex || i === durIndex) return false;
        // Match numbers like 10,5 or 10.5, optional km
        return /^\d+([.,]\d+)?(\s*km)?$/.test(c);
    });
    
    let distance_km = 0;
    if (distIndex !== -1) {
        const val = cols[distIndex].replace('km', '').replace(',', '.').trim();
        distance_km = parseFloat(val);
    }

    // 4. Find Sport
    // It's a string column that isn't the others.
    // Usually index 1 if Date is 0.
    const sportIndex = cols.findIndex((c, i) => {
        if (i === dateIndex || i === durIndex || i === distIndex) return false;
        // Should contain letters
        if (!/[a-zA-Z]/.test(c)) return false;
        // Should not be purely a number
        if (/^\d+([.,]\d+)?$/.test(c)) return false;
        return true;
    });

    const sport = sportIndex !== -1 ? cols[sportIndex] : 'Imported';

    if (duration_min > 0 || distance_km > 0) {
        entries.push({
            date,
            sport,
            duration_min: Math.round(duration_min),
            distance_km,
            original_string: `CSV: ${sport}`
        });
    }
  }

  return entries;
}
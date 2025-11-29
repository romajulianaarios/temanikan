export type CleaningStatus = 'completed' | 'failed' | 'interrupted';

export interface MockCleaningRecord {
  id: number;
  started_at: string;
  completed_at?: string;
  duration_minutes: number;
  status: CleaningStatus;
  battery_used: number;
  areas_cleaned: string[];
  notes?: string;
}

export interface AutoScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'alternate' | 'weekly';
  time: string;
  days: string[];
}

export const defaultAutoSchedule: AutoScheduleConfig = {
  enabled: true,
  frequency: 'daily',
  time: '20:00',
  days: ['Senin', 'Rabu', 'Jumat']
};

export const mockCleaningRecords: MockCleaningRecord[] = [
  {
    id: 1,
    started_at: '2025-11-04T20:00:00+07:00',
    completed_at: '2025-11-04T20:45:00+07:00',
    duration_minutes: 45,
    status: 'completed',
    battery_used: 35,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
  },
  {
    id: 2,
    started_at: '2025-11-03T20:00:00+07:00',
    completed_at: '2025-11-03T20:42:00+07:00',
    duration_minutes: 42,
    status: 'completed',
    battery_used: 32,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam']
  },
  {
    id: 3,
    started_at: '2025-11-02T20:00:00+07:00',
    completed_at: '2025-11-02T20:48:00+07:00',
    duration_minutes: 48,
    status: 'completed',
    battery_used: 38,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
  },
  {
    id: 4,
    started_at: '2025-11-02T10:00:00+07:00',
    completed_at: '2025-11-02T10:15:00+07:00',
    duration_minutes: 15,
    status: 'interrupted',
    battery_used: 12,
    areas_cleaned: ['Dasar kolam'],
    notes: 'Pembersihan dihentikan secara manual.'
  },
  {
    id: 5,
    started_at: '2025-11-01T20:00:00+07:00',
    completed_at: '2025-11-01T20:44:00+07:00',
    duration_minutes: 44,
    status: 'completed',
    battery_used: 34,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam']
  },
  {
    id: 6,
    started_at: '2025-10-31T20:00:00+07:00',
    completed_at: '2025-10-31T20:00:00+07:00',
    duration_minutes: 0,
    status: 'failed',
    battery_used: 0,
    areas_cleaned: [],
    notes: 'Baterai terlalu rendah untuk memulai pembersihan.'
  },
  {
    id: 7,
    started_at: '2025-10-30T20:00:00+07:00',
    completed_at: '2025-10-30T20:46:00+07:00',
    duration_minutes: 46,
    status: 'completed',
    battery_used: 36,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
  },
  {
    id: 8,
    started_at: '2025-10-29T20:00:00+07:00',
    completed_at: '2025-10-29T20:43:00+07:00',
    duration_minutes: 43,
    status: 'completed',
    battery_used: 33,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam']
  },
  {
    id: 9,
    started_at: '2025-10-28T20:00:00+07:00',
    completed_at: '2025-10-28T20:47:00+07:00',
    duration_minutes: 47,
    status: 'completed',
    battery_used: 37,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
  },
  {
    id: 10,
    started_at: '2025-10-27T20:00:00+07:00',
    completed_at: '2025-10-27T20:41:00+07:00',
    duration_minutes: 41,
    status: 'completed',
    battery_used: 31,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam']
  },
  {
    id: 11,
    started_at: '2025-10-26T20:00:00+07:00',
    completed_at: '2025-10-26T20:45:00+07:00',
    duration_minutes: 45,
    status: 'completed',
    battery_used: 35,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam']
  },
  {
    id: 12,
    started_at: '2025-10-25T20:00:00+07:00',
    completed_at: '2025-10-25T20:44:00+07:00',
    duration_minutes: 44,
    status: 'completed',
    battery_used: 34,
    areas_cleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
  }
];

export const getMockHistoryPreview = (limit = 3) => mockCleaningRecords.slice(0, limit);

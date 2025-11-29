export type CleaningRecordStatus = 'completed' | 'failed' | 'interrupted';

export interface CleaningRecord {
  id: number;
  /** ISO timestamp for when cleaning started */
  startedAt: string;
  /** Duration in minutes */
  durationMinutes: number;
  status: CleaningRecordStatus;
  batteryUsed: number;
  areasCleaned: string[];
  notes?: string;
  cleaningType: 'automatic' | 'manual' | 'scheduled';
}

const baseTz = '+07:00';
const date = (day: number, hour: number) => `2025-11-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00${baseTz}`;

export const cleaningRecords: CleaningRecord[] = [
  {
    id: 1,
    startedAt: date(4, 20),
    durationMinutes: 45,
    status: 'completed',
    batteryUsed: 35,
    areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter'],
    cleaningType: 'automatic'
  },
  {
    id: 2,
    startedAt: date(3, 20),
    durationMinutes: 42,
    status: 'completed',
    batteryUsed: 32,
    areasCleaned: ['Dasar kolam', 'Dinding kolam'],
    cleaningType: 'automatic'
  },
  {
    id: 3,
    startedAt: date(2, 20),
    durationMinutes: 48,
    status: 'completed',
    batteryUsed: 38,
    areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter'],
    cleaningType: 'automatic'
  },
  {
    id: 4,
    startedAt: date(2, 10),
    durationMinutes: 15,
    status: 'interrupted',
    batteryUsed: 12,
    areasCleaned: ['Dasar kolam'],
    notes: 'Pembersihan dihentikan secara manual',
    cleaningType: 'manual'
  },
  {
    id: 5,
    startedAt: date(1, 20),
    durationMinutes: 44,
    status: 'completed',
    batteryUsed: 34,
    areasCleaned: ['Dasar kolam', 'Dinding kolam'],
    cleaningType: 'automatic'
  },
  {
    id: 6,
    startedAt: `2025-10-31T20:00:00${baseTz}`,
    durationMinutes: 0,
    status: 'failed',
    batteryUsed: 0,
    areasCleaned: [],
    notes: 'Baterai terlalu rendah untuk memulai pembersihan',
    cleaningType: 'automatic'
  },
  {
    id: 7,
    startedAt: `2025-10-30T20:00:00${baseTz}`,
    durationMinutes: 46,
    status: 'completed',
    batteryUsed: 36,
    areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter'],
    cleaningType: 'automatic'
  },
  {
    id: 8,
    startedAt: `2025-10-29T20:00:00${baseTz}`,
    durationMinutes: 43,
    status: 'completed',
    batteryUsed: 33,
    areasCleaned: ['Dasar kolam', 'Dinding kolam'],
    cleaningType: 'automatic'
  },
  {
    id: 9,
    startedAt: `2025-10-28T20:00:00${baseTz}`,
    durationMinutes: 47,
    status: 'completed',
    batteryUsed: 37,
    areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter'],
    cleaningType: 'automatic'
  },
  {
    id: 10,
    startedAt: `2025-10-27T20:00:00${baseTz}`,
    durationMinutes: 41,
    status: 'completed',
    batteryUsed: 31,
    areasCleaned: ['Dasar kolam', 'Dinding kolam'],
    cleaningType: 'automatic'
  },
  {
    id: 11,
    startedAt: `2025-10-26T20:00:00${baseTz}`,
    durationMinutes: 45,
    status: 'completed',
    batteryUsed: 35,
    areasCleaned: ['Dasar kolam', 'Dinding kolam'],
    cleaningType: 'automatic'
  },
  {
    id: 12,
    startedAt: `2025-10-25T20:00:00${baseTz}`,
    durationMinutes: 44,
    status: 'completed',
    batteryUsed: 34,
    areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter'],
    cleaningType: 'automatic'
  }
];

export type WorkoutType = 'natacao' | 'academia';

export interface SwimDetail {
  distanceMeters: number; // e.g. 1500
  durationMinutes?: number;
  poolType?: '25m' | '50m' | 'mar_aberto';
  style?: 'Livre / Crawl' | 'Medley' | 'Peito / Costas' | 'Técnico / Educativos' | 'Séries Mistas';
  notes?: string;
}

export interface GymDetail {
  focus: 'Superior' | 'Inferior / Pernas' | 'Full Body' | 'Costas & Bíceps' | 'Peito & Tríceps' | 'Glúteo & Core' | 'Cardio & Funcional';
  durationMinutes?: number;
  intensity?: 'Leve' | 'Moderado' | 'Intenso' | 'Muito Intenso';
  notes?: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  swimCompleted: boolean;
  swim?: SwimDetail;
  gymCompleted: boolean;
  gym?: GymDetail;
  feeling?: '🔥 Excelente' | '💪 Firme' | '😴 Cansada mas feito' | '⚡ Recuperação';
  photoUrl?: string;
  notes?: string;
  updatedAt: string;
}

export interface GoalConfig {
  swimTargetKm: number; // 45km
  gymWeeklyTargetDays: number; // 4 days/week
  targetEndDate: string; // "2026-12-31"
  startDate: string; // "2026-09-01"
  userHandle: string; // "@prof_giu"
  userName: string; // "Prof. Giu"
}

export interface WeekSummary {
  weekNumber: number;
  year: number;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  swimKm: number;
  swimSessions: number;
  gymSessions: number;
  gymTargetMet: boolean; // >= 4
  totalActiveMinutes: number;
  daysCompletedCount: number;
}

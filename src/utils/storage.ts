import { DayLog, GoalConfig } from '../types/workout';
import { DEFAULT_GOAL, INITIAL_LOGS } from '../data/seedData';

const LOGS_STORAGE_KEY = 'prof_giu_workout_logs_v1';
const GOAL_STORAGE_KEY = 'prof_giu_goal_config_v1';

export function loadLogs(): Record<string, DayLog> {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      saveLogs(INITIAL_LOGS);
      return INITIAL_LOGS;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error loading logs from localStorage:', err);
    return INITIAL_LOGS;
  }
}

export function saveLogs(logs: Record<string, DayLog>): void {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs to localStorage:', err);
  }
}

export function loadGoal(): GoalConfig {
  try {
    const raw = localStorage.getItem(GOAL_STORAGE_KEY);
    if (!raw) {
      saveGoal(DEFAULT_GOAL);
      return DEFAULT_GOAL;
    }
    const parsed = JSON.parse(raw);
    // If previously saved as Giu Pereira, migrate to Giu Sousa
    const userName = (parsed.userName === 'Giu Pereira' || !parsed.userName) ? 'Giu Sousa' : parsed.userName;
    const merged = { ...DEFAULT_GOAL, ...parsed, userName };
    saveGoal(merged);
    return merged;
  } catch (err) {
    console.error('Error loading goal from localStorage:', err);
    return DEFAULT_GOAL;
  }
}

export function saveGoal(goal: GoalConfig): void {
  try {
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goal));
  } catch (err) {
    console.error('Error saving goal to localStorage:', err);
  }
}

export function resetToDefaults(): { logs: Record<string, DayLog>; goal: GoalConfig } {
  localStorage.removeItem(LOGS_STORAGE_KEY);
  localStorage.removeItem(GOAL_STORAGE_KEY);
  saveLogs(INITIAL_LOGS);
  saveGoal(DEFAULT_GOAL);
  return { logs: INITIAL_LOGS, goal: DEFAULT_GOAL };
}

// Backup & Sync helper for transferring data between browsers
export function exportDataAsJSON(): string {
  const data = {
    app: 'prof_giu_workout_tracker',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    goal: loadGoal(),
    logs: loadLogs(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.logs || typeof parsed.logs !== 'object') {
      return { success: false, error: 'Arquivo inválido: registros de treino não encontrados.' };
    }
    saveLogs(parsed.logs);
    if (parsed.goal) {
      saveGoal({ ...DEFAULT_GOAL, ...parsed.goal, userName: 'Giu Sousa' });
    }
    return { success: true, count: Object.keys(parsed.logs).length };
  } catch (err) {
    return { success: false, error: 'Erro ao processar arquivo JSON.' };
  }
}

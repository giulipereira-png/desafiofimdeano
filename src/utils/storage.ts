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
    return { ...DEFAULT_GOAL, ...JSON.parse(raw) };
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

import type { TodaySuggestion, ReactionLog } from "@/types/suggestion";

const STORAGE_KEY_TODAY = "daily-noise-today";
const STORAGE_KEY_LOGS = "daily-noise-logs";

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTodaySuggestion(): TodaySuggestion | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODAY);
    if (!raw) return null;
    const suggestion = JSON.parse(raw) as TodaySuggestion;
    if (suggestion.createdAt !== todayDateString()) return null;
    return suggestion;
  } catch {
    return null;
  }
}

export function setTodaySuggestion(suggestion: TodaySuggestion): void {
  localStorage.setItem(STORAGE_KEY_TODAY, JSON.stringify(suggestion));
}

export function clearTodaySuggestion(): void {
  localStorage.removeItem(STORAGE_KEY_TODAY);
}

export function getReactionLogs(): ReactionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw) as ReactionLog[];
  } catch {
    return [];
  }
}

export function addReactionLog(log: ReactionLog): void {
  const logs = getReactionLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
}

export function getStats(): { done: number; skipped: number; total: number } {
  const logs = getReactionLogs();
  const done = logs.filter((l) => l.action === "done").length;
  const skipped = logs.filter((l) => l.action === "skipped").length;
  return { done, skipped, total: logs.length };
}

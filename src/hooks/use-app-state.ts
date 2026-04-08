"use client";

import { useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { TodaySuggestion, ReactionLog, AppScreen } from "@/types/suggestion";

const STORAGE_KEYS = {
  onboarded: "daily-noise:onboarded",
  suggestion: "daily-noise:suggestion",
  reactions: "daily-noise:reactions",
} as const;

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function isSameDay(dateStr: string): boolean {
  return dateStr.startsWith(getTodayDateString());
}

// Mock suggestion for MVP — will be replaced by GLM API
const MOCK_SUGGESTIONS: TodaySuggestion[] = [
  {
    id: "1",
    category: "podcast",
    title: "知らない分野のポッドキャストを15分だけ聴く",
    description:
      "通学中や移動中に、普段選ばないジャンルの番組を1エピソードだけ。新しい視点が見つかるかも。",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    category: "action",
    title: "いつもと違う道で帰ってみる",
    description:
      "ほんの少しのルート変更で、新しいお店や景色に出会える。5分の寄り道が発見になる。",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    category: "article",
    title: "Wikipediaのランダム記事を1つ読む",
    description:
      "「おまかせ表示」ボタンを押すだけ。3分で知らなかった世界を覗ける。",
    createdAt: new Date().toISOString(),
  },
];

function getRandomSuggestion(): TodaySuggestion {
  const index = Math.floor(Math.random() * MOCK_SUGGESTIONS.length);
  return {
    ...MOCK_SUGGESTIONS[index],
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export function useAppState() {
  const [onboarded, setOnboarded] = useLocalStorage(STORAGE_KEYS.onboarded, false);
  const [suggestion, setSuggestion] = useLocalStorage<TodaySuggestion | null>(
    STORAGE_KEYS.suggestion,
    null
  );
  const [reactions, setReactions] = useLocalStorage<ReactionLog[]>(
    STORAGE_KEYS.reactions,
    []
  );

  const todaySuggestion = useMemo(() => {
    if (suggestion && isSameDay(suggestion.createdAt)) {
      return suggestion;
    }
    return null;
  }, [suggestion]);

  const currentScreen: AppScreen = useMemo(() => {
    if (!onboarded) return "welcome";
    if (todaySuggestion?.action === "done") return "done";
    if (todaySuggestion?.action === "skipped") return "skipped";
    return "suggestion";
  }, [onboarded, todaySuggestion]);

  const [permissionScreen, setPermissionScreen] = useState(false);

  const completeOnboarding = useCallback(() => {
    setOnboarded(true);
    const newSuggestion = getRandomSuggestion();
    setSuggestion(newSuggestion);
  }, [setOnboarded, setSuggestion]);

  const showPermission = useCallback(() => {
    setPermissionScreen(true);
  }, []);

  const dismissPermission = useCallback(() => {
    setPermissionScreen(false);
    completeOnboarding();
  }, [completeOnboarding]);

  const react = useCallback(
    (action: "done" | "skipped") => {
      if (!todaySuggestion) return;
      const updated = { ...todaySuggestion, action };
      setSuggestion(updated);
      const log: ReactionLog = {
        id: crypto.randomUUID(),
        suggestionId: todaySuggestion.id,
        category: todaySuggestion.category,
        action,
        timestamp: new Date().toISOString(),
      };
      setReactions((prev) => [...prev, log]);
    },
    [todaySuggestion, setSuggestion, setReactions]
  );

  const clearAllData = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEYS.onboarded);
    window.localStorage.removeItem(STORAGE_KEYS.suggestion);
    window.localStorage.removeItem(STORAGE_KEYS.reactions);
    window.location.reload();
  }, []);

  const suggestionOrFallback: TodaySuggestion = useMemo(() => {
    if (todaySuggestion) return todaySuggestion;
    return getRandomSuggestion();
  }, [todaySuggestion])

  return {
    currentScreen: permissionScreen ? ("permission" as AppScreen) : currentScreen,
    suggestion: suggestionOrFallback,
    reactions,
    showPermission,
    dismissPermission,
    completeOnboarding,
    react,
    clearAllData,
  };
}

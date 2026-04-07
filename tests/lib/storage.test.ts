import { describe, it, expect, beforeEach } from "vitest";
import {
  getTodaySuggestion,
  setTodaySuggestion,
  getReactionLogs,
  addReactionLog,
  clearTodaySuggestion,
  getStats,
} from "@/lib/storage";
import type { TodaySuggestion, ReactionLog } from "@/types/suggestion";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  const mockSuggestion: TodaySuggestion = {
    id: "test-1",
    category: "podcast",
    title: "Podcastを1つ聴く",
    description: "",
    createdAt: "2026-04-07",
  };

  describe("getTodaySuggestion / setTodaySuggestion", () => {
    it("returns null when no suggestion is stored", () => {
      expect(getTodaySuggestion()).toBeNull();
    });

    it("stores and retrieves a suggestion", () => {
      setTodaySuggestion(mockSuggestion);
      const result = getTodaySuggestion();
      expect(result).toEqual(mockSuggestion);
    });

    it("returns null if stored suggestion is from a different day", () => {
      const yesterday: TodaySuggestion = {
        ...mockSuggestion,
        createdAt: "2020-01-01",
      };
      setTodaySuggestion(yesterday);
      expect(getTodaySuggestion()).toBeNull();
    });
  });

  describe("clearTodaySuggestion", () => {
    it("removes the stored suggestion", () => {
      setTodaySuggestion(mockSuggestion);
      clearTodaySuggestion();
      expect(getTodaySuggestion()).toBeNull();
    });
  });

  describe("getReactionLogs / addReactionLog", () => {
    it("returns empty array when no logs exist", () => {
      expect(getReactionLogs()).toEqual([]);
    });

    it("adds a reaction log and retrieves it", () => {
      const log: ReactionLog = {
        id: "log-1",
        suggestionId: "test-1",
        category: "podcast",
        action: "done",
        timestamp: new Date().toISOString(),
      };
      addReactionLog(log);
      const logs = getReactionLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toEqual(log);
    });

    it("appends multiple logs", () => {
      const log1: ReactionLog = {
        id: "log-1",
        suggestionId: "test-1",
        category: "podcast",
        action: "done",
        timestamp: new Date().toISOString(),
      };
      const log2: ReactionLog = {
        id: "log-2",
        suggestionId: "test-2",
        category: "video",
        action: "skipped",
        timestamp: new Date().toISOString(),
      };
      addReactionLog(log1);
      addReactionLog(log2);
      expect(getReactionLogs()).toHaveLength(2);
    });
  });

  describe("getStats", () => {
    it("returns zero counts when no logs exist", () => {
      const stats = getStats();
      expect(stats.done).toBe(0);
      expect(stats.skipped).toBe(0);
      expect(stats.total).toBe(0);
    });

    it("counts done and skipped correctly", () => {
      addReactionLog({
        id: "1",
        suggestionId: "s1",
        category: "podcast",
        action: "done",
        timestamp: new Date().toISOString(),
      });
      addReactionLog({
        id: "2",
        suggestionId: "s2",
        category: "video",
        action: "skipped",
        timestamp: new Date().toISOString(),
      });
      addReactionLog({
        id: "3",
        suggestionId: "s3",
        category: "action",
        action: "done",
        timestamp: new Date().toISOString(),
      });

      const stats = getStats();
      expect(stats.done).toBe(2);
      expect(stats.skipped).toBe(1);
      expect(stats.total).toBe(3);
    });
  });
});

import { describe, it, expect } from "vitest";
import { CATEGORY_LABELS } from "../suggestion";
import type { TodaySuggestion, ReactionLog, Category } from "../suggestion";

describe("suggestion types", () => {
  it("CATEGORY_LABELSが全カテゴリに対応する日本語ラベルを持つ", () => {
    const categories: Category[] = ["podcast", "video", "article", "app", "action"];

    for (const cat of categories) {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
      expect(typeof CATEGORY_LABELS[cat]).toBe("string");
    }
  });

  it("CATEGORY_LABELSのラベルがすべて日本語", () => {
    expect(CATEGORY_LABELS.podcast).toBe("ポッドキャスト");
    expect(CATEGORY_LABELS.video).toBe("動画");
    expect(CATEGORY_LABELS.article).toBe("記事");
    expect(CATEGORY_LABELS.app).toBe("アプリ");
    expect(CATEGORY_LABELS.action).toBe("アクション");
  });

  it("TodaySuggestionの型が正しく使える", () => {
    const suggestion: TodaySuggestion = {
      id: "1",
      category: "podcast",
      title: "テスト",
      description: "説明",
      createdAt: new Date().toISOString(),
    };

    expect(suggestion.id).toBe("1");
    expect(suggestion.action).toBeUndefined();
  });

  it("ReactionLogの型が正しく使える", () => {
    const log: ReactionLog = {
      id: "1",
      suggestionId: "s1",
      category: "podcast",
      action: "done",
      timestamp: new Date().toISOString(),
    };

    expect(log.action).toBe("done");
  });
});

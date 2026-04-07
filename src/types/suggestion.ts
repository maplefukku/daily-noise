export type Category = "podcast" | "video" | "article" | "app" | "action";

export interface TodaySuggestion {
  id: string;
  category: Category;
  title: string;
  description: string;
  createdAt: string;
  action?: "done" | "skipped";
}

export interface ReactionLog {
  id: string;
  suggestionId: string;
  category: string;
  action: "done" | "skipped";
  timestamp: string;
}

export type AppScreen = "welcome" | "permission" | "suggestion" | "done" | "skipped";

export const CATEGORY_LABELS: Record<Category, string> = {
  podcast: "ポッドキャスト",
  video: "動画",
  article: "記事",
  app: "アプリ",
  action: "アクション",
};

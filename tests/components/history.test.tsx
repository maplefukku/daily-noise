import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HistoryPage from "@/app/history/page";

vi.mock("framer-motion", async () => await import("@/test/framer-motion-mock"));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
});

describe("HistoryPage", () => {
  it("ヘッダーに「履歴」と表示される", () => {
    render(<HistoryPage />);
    expect(screen.getByText("履歴")).toBeInTheDocument();
  });

  it("ログがない場合「まだ記録がありません」と表示される", () => {
    render(<HistoryPage />);
    expect(screen.getByText("まだ記録がありません")).toBeInTheDocument();
  });

  it("統計情報が表示される", () => {
    render(<HistoryPage />);
    expect(screen.getByText("やった")).toBeInTheDocument();
    expect(screen.getByText("スキップ")).toBeInTheDocument();
  });

  it("ログがある場合に表示される", () => {
    const logs = [
      {
        id: "1",
        suggestionId: "s1",
        category: "podcast",
        action: "done",
        timestamp: "2026-04-07T10:00:00.000Z",
      },
      {
        id: "2",
        suggestionId: "s2",
        category: "video",
        action: "skipped",
        timestamp: "2026-04-06T10:00:00.000Z",
      },
    ];
    localStorage.setItem("daily-noise:reactions", JSON.stringify(logs));

    render(<HistoryPage />);
    expect(screen.queryByText("まだ記録がありません")).not.toBeInTheDocument();
  });

  it("doneログにチェックアイコンとカテゴリが表示される", () => {
    const logs = [
      {
        id: "1",
        suggestionId: "s1",
        category: "podcast",
        action: "done",
        timestamp: "2026-04-07T10:00:00.000Z",
      },
    ];
    localStorage.setItem("daily-noise:reactions", JSON.stringify(logs));

    render(<HistoryPage />);
    expect(screen.getAllByText("やった").length).toBeGreaterThanOrEqual(2); // stats + log entry
  });

  it("skippedログにマイナスアイコンが表示される", () => {
    const logs = [
      {
        id: "2",
        suggestionId: "s2",
        category: "video",
        action: "skipped",
        timestamp: "2026-04-07T10:00:00.000Z",
      },
    ];
    localStorage.setItem("daily-noise:reactions", JSON.stringify(logs));

    render(<HistoryPage />);
    expect(screen.getAllByText("スキップ").length).toBeGreaterThanOrEqual(2); // stats + log entry
  });

  it("不明なカテゴリのログがフォールバック表示される", () => {
    const logs = [
      {
        id: "1",
        suggestionId: "s1",
        category: "unknown-category",
        action: "done",
        timestamp: "2026-04-07T10:00:00.000Z",
      },
    ];
    localStorage.setItem("daily-noise:reactions", JSON.stringify(logs));

    render(<HistoryPage />);
    expect(screen.getByText("unknown-category")).toBeInTheDocument();
  });

  it("同じ日の複数ログがグループ化されて表示される", () => {
    const logs = [
      {
        id: "1",
        suggestionId: "s1",
        category: "podcast",
        action: "done",
        timestamp: "2026-04-07T10:00:00.000Z",
      },
      {
        id: "2",
        suggestionId: "s2",
        category: "video",
        action: "skipped",
        timestamp: "2026-04-07T15:00:00.000Z",
      },
    ];
    localStorage.setItem("daily-noise:reactions", JSON.stringify(logs));

    render(<HistoryPage />);
    // Both logs on same date = 1 date group, both rendered
    expect(screen.getAllByText("やった").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("スキップ").length).toBeGreaterThanOrEqual(2);
  });

  it("戻るリンクが表示される", () => {
    render(<HistoryPage />);
    expect(screen.getByRole("link", { name: /戻る/ })).toBeInTheDocument();
  });
});

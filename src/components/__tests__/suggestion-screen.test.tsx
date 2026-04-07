import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SuggestionScreen } from "../suggestion-screen";
import type { TodaySuggestion } from "@/types/suggestion";

vi.mock("framer-motion", async () => await import("@/test/framer-motion-mock"));

// Mock @base-ui/react/dialog to avoid portal issues in tests
vi.mock("@base-ui/react/dialog", () => ({
  Dialog: {
    Root: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Trigger: ({ children, render, ...props }: React.PropsWithChildren<{ render?: React.ReactElement }>) =>
      render ? <>{render}</> : <button {...props}>{children}</button>,
    Portal: ({ children }: React.PropsWithChildren) => <>{children}</>,
    Backdrop: ({ children, ...props }: React.PropsWithChildren) => <div {...props}>{children}</div>,
    Popup: ({ children, ...props }: React.PropsWithChildren) => <div {...props}>{children}</div>,
    Close: ({ children, ...props }: React.PropsWithChildren) => <button {...props}>{children}</button>,
    Title: ({ children, ...props }: React.PropsWithChildren) => <h2 {...props}>{children}</h2>,
    Description: ({ children, ...props }: React.PropsWithChildren) => <p {...props}>{children}</p>,
  },
}));

const mockSuggestion: TodaySuggestion = {
  id: "test-1",
  category: "podcast",
  title: "テスト提案タイトル",
  description: "テスト提案の詳細説明です。",
  createdAt: new Date().toISOString(),
};

describe("SuggestionScreen", () => {
  it("ヘッダーに「デイリーノイズ」と表示される", () => {
    render(
      <SuggestionScreen
        suggestion={mockSuggestion}
        onDone={vi.fn()}
        onSkip={vi.fn()}
        onClearData={vi.fn()}
      />
    );

    expect(screen.getByText("デイリーノイズ")).toBeInTheDocument();
  });

  it("提案のタイトルと説明が表示される", () => {
    render(
      <SuggestionScreen
        suggestion={mockSuggestion}
        onDone={vi.fn()}
        onSkip={vi.fn()}
        onClearData={vi.fn()}
      />
    );

    expect(screen.getByText("テスト提案タイトル")).toBeInTheDocument();
    expect(screen.getByText("テスト提案の詳細説明です。")).toBeInTheDocument();
  });

  it("カテゴリラベルが日本語で表示される", () => {
    render(
      <SuggestionScreen
        suggestion={mockSuggestion}
        onDone={vi.fn()}
        onSkip={vi.fn()}
        onClearData={vi.fn()}
      />
    );

    expect(screen.getByText("ポッドキャスト")).toBeInTheDocument();
  });

  it("「やってみる」をクリックするとonDoneが呼ばれる", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(
      <SuggestionScreen
        suggestion={mockSuggestion}
        onDone={onDone}
        onSkip={vi.fn()}
        onClearData={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "やってみる" }));

    expect(onDone).toHaveBeenCalledOnce();
  });

  it("「今日はスキップ」をクリックするとonSkipが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    render(
      <SuggestionScreen
        suggestion={mockSuggestion}
        onDone={vi.fn()}
        onSkip={onSkip}
        onClearData={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "今日はスキップ" }));

    expect(onSkip).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "@/app/page";

vi.mock("framer-motion", async () => await import("@/test/framer-motion-mock"));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

// Mock @base-ui/react/dialog to avoid portal issues in tests
vi.mock("@base-ui/react/dialog", () => ({
  Dialog: {
    Root: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Trigger: ({ children, render }: React.PropsWithChildren<{ render?: React.ReactElement }>) =>
      render ? <>{render}</> : <button>{children}</button>,
    Portal: ({ children }: React.PropsWithChildren) => <>{children}</>,
    Backdrop: ({ children, ...props }: React.PropsWithChildren) => <div {...props}>{children}</div>,
    Popup: ({ children, ...props }: React.PropsWithChildren) => <div {...props}>{children}</div>,
    Close: ({ children, ...props }: React.PropsWithChildren) => <button {...props}>{children}</button>,
    Title: ({ children, ...props }: React.PropsWithChildren) => <h2 {...props}>{children}</h2>,
    Description: ({ children, ...props }: React.PropsWithChildren) => <p {...props}>{children}</p>,
  },
}));

beforeEach(() => {
  localStorage.clear();
  // Use fake timers at noon UTC to avoid timezone mismatch
  // between Date.toISOString() (UTC) and local date comparison in isSameDay
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date("2026-04-09T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("HomePage", () => {
  it("初回表示でウェルカム画面が表示される", () => {
    render(<HomePage />);
    expect(screen.getByText("選ばなくていい。")).toBeInTheDocument();
    expect(screen.getByText("はじめる")).toBeInTheDocument();
  });

  it("「はじめる」をクリックすると通知許可画面に遷移する", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "はじめる" }));

    expect(screen.getByText("通知を許可する")).toBeInTheDocument();
  });

  it("通知をスキップするとサジェスション画面に遷移する", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "はじめる" }));
    await user.click(screen.getByRole("button", { name: "あとで（通知なしで使う）" }));

    expect(screen.getByText("デイリーノイズ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "やってみる" })).toBeInTheDocument();
  });

  it("「やってみる」をクリックすると完了画面に遷移する", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "はじめる" }));
    await user.click(screen.getByRole("button", { name: "あとで（通知なしで使う）" }));
    await user.click(screen.getByRole("button", { name: "やってみる" }));

    expect(screen.getByText("いいね、やってみよう。")).toBeInTheDocument();
  });

  it("「今日はスキップ」をクリックするとスキップ画面に遷移する", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "はじめる" }));
    await user.click(screen.getByRole("button", { name: "あとで（通知なしで使う）" }));
    await user.click(screen.getByRole("button", { name: "今日はスキップ" }));

    expect(screen.getByText("了解、また明日。")).toBeInTheDocument();
  });
});

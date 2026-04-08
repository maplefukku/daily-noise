import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReactionScreen } from "../reaction-screen";

vi.mock("framer-motion", async () => await import("@/test/framer-motion-mock"));

describe("ReactionScreen", () => {
  it("doneの場合「いいね、やってみよう。」と表示される", () => {
    render(<ReactionScreen type="done" />);

    expect(screen.getByText("いいね、やってみよう。")).toBeInTheDocument();
  });

  it("skippedの場合「了解、また明日。」と表示される", () => {
    render(<ReactionScreen type="skipped" />);

    expect(screen.getByText("了解、また明日。")).toBeInTheDocument();
  });

  it("doneの場合アイコンが表示される", () => {
    const { container } = render(<ReactionScreen type="done" />);
    // Check icon (rendered as svg by lucide-react)
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("skippedの場合アイコンが表示される", () => {
    const { container } = render(<ReactionScreen type="skipped" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

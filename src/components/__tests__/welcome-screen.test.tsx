import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { WelcomeScreen } from "../welcome-screen";

vi.mock("framer-motion", async () => await import("@/test/framer-motion-mock"));

describe("WelcomeScreen", () => {
  it("見出しとサブテキストが表示される", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);

    expect(screen.getByText("選ばなくていい。")).toBeInTheDocument();
    expect(screen.getByText(/毎日1つ、試すことが届く/)).toBeInTheDocument();
    expect(screen.getByText(/やるかどうかは、5秒で/)).toBeInTheDocument();
  });

  it("「はじめる」ボタンが表示される", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);

    expect(screen.getByRole("button", { name: "はじめる" })).toBeInTheDocument();
  });

  it("「はじめる」をクリックするとonStartが呼ばれる", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} />);

    await user.click(screen.getByRole("button", { name: "はじめる" }));

    expect(onStart).toHaveBeenCalledOnce();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PermissionScreen } from "../permission-screen";

vi.mock("framer-motion", async () => await import("@/test/framer-motion-mock"));

describe("PermissionScreen", () => {
  it("見出しとサブテキストが表示される", () => {
    render(<PermissionScreen onAllow={vi.fn()} onSkip={vi.fn()} />);

    expect(screen.getByText(/届けるために/)).toBeInTheDocument();
    expect(screen.getByText(/通知を許可してください/)).toBeInTheDocument();
    expect(screen.getByText(/毎朝1つだけ届きます/)).toBeInTheDocument();
  });

  it("2つのボタンが表示される", () => {
    render(<PermissionScreen onAllow={vi.fn()} onSkip={vi.fn()} />);

    expect(screen.getByRole("button", { name: "通知を許可する" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /あとで/ })).toBeInTheDocument();
  });

  it("「あとで」をクリックするとonSkipが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    render(<PermissionScreen onAllow={vi.fn()} onSkip={onSkip} />);

    await user.click(screen.getByRole("button", { name: /あとで/ }));

    expect(onSkip).toHaveBeenCalledOnce();
  });
});

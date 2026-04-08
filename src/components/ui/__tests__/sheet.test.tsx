import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "../sheet";

import React from "react";

// Mock @base-ui/react/dialog to avoid portal/DOM issues in jsdom
vi.mock("@base-ui/react/dialog", () => {
  const Root = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("div", { "data-testid": "sheet-root", ...props }, children);
  Root.Props = {};

  const Trigger = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("button", props, children);
  Trigger.Props = {};

  const Close = ({ children, render: renderProp, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    renderProp
      ? React.cloneElement(renderProp as React.ReactElement, props, children)
      : React.createElement("button", props, children);
  Close.Props = {};

  const Portal = ({ children }: React.PropsWithChildren) => React.createElement(React.Fragment, null, children);
  Portal.Props = {};

  const Backdrop = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("div", props, children);
  Backdrop.Props = {};

  const Popup = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("div", props, children);
  Popup.Props = {};

  const Title = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("h2", props, children);
  Title.Props = {};

  const Description = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("p", props, children);
  Description.Props = {};

  return {
    Dialog: { Root, Trigger, Close, Portal, Backdrop, Popup, Title, Description },
  };
});

describe("Sheet components", () => {
  it("Sheet をレンダリングできる", () => {
    render(<Sheet>content</Sheet>);
    expect(screen.getByTestId("sheet-root")).toHaveAttribute("data-slot", "sheet");
  });

  it("SheetTrigger をレンダリングできる", () => {
    render(<SheetTrigger data-testid="trigger">open</SheetTrigger>);
    expect(screen.getByTestId("trigger")).toHaveAttribute("data-slot", "sheet-trigger");
  });

  it("SheetClose をレンダリングできる", () => {
    render(<SheetClose data-testid="close">close</SheetClose>);
    expect(screen.getByTestId("close")).toHaveAttribute("data-slot", "sheet-close");
  });

  it("SheetHeader をレンダリングできる", () => {
    render(<SheetHeader data-testid="header">header</SheetHeader>);
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "sheet-header");
  });

  it("SheetFooter をレンダリングできる", () => {
    render(<SheetFooter data-testid="footer">footer</SheetFooter>);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "sheet-footer");
  });

  it("SheetTitle をレンダリングできる", () => {
    render(<SheetTitle>タイトル</SheetTitle>);
    expect(screen.getByText("タイトル")).toHaveAttribute("data-slot", "sheet-title");
  });

  it("SheetDescription をレンダリングできる", () => {
    render(<SheetDescription>説明文</SheetDescription>);
    expect(screen.getByText("説明文")).toHaveAttribute("data-slot", "sheet-description");
  });
});

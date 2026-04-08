import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../card";

describe("Card components", () => {
  it("Card をレンダリングできる", () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
  });

  it("Card の size prop が反映される", () => {
    render(<Card data-testid="card" size="sm">content</Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("data-size", "sm");
  });

  it("CardHeader をレンダリングできる", () => {
    render(<CardHeader data-testid="header">header</CardHeader>);
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "card-header");
  });

  it("CardTitle をレンダリングできる", () => {
    render(<CardTitle>タイトル</CardTitle>);
    expect(screen.getByText("タイトル")).toHaveAttribute("data-slot", "card-title");
  });

  it("CardDescription をレンダリングできる", () => {
    render(<CardDescription>説明</CardDescription>);
    expect(screen.getByText("説明")).toHaveAttribute("data-slot", "card-description");
  });

  it("CardAction をレンダリングできる", () => {
    render(<CardAction data-testid="action">action</CardAction>);
    expect(screen.getByTestId("action")).toHaveAttribute("data-slot", "card-action");
  });

  it("CardContent をレンダリングできる", () => {
    render(<CardContent data-testid="content">body</CardContent>);
    expect(screen.getByTestId("content")).toHaveAttribute("data-slot", "card-content");
  });

  it("CardFooter をレンダリングできる", () => {
    render(<CardFooter data-testid="footer">footer</CardFooter>);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "card-footer");
  });
});

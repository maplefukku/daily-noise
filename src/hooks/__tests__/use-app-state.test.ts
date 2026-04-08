import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAppState } from "../use-app-state";

// Mock window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, "location", {
  value: { reload: reloadMock },
  writable: true,
});

beforeEach(() => {
  localStorage.clear();
  reloadMock.mockClear();
});

describe("useAppState", () => {
  it("初回はwelcome画面を返す", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.currentScreen).toBe("welcome");
  });

  it("onboarding完了後はsuggestion画面を返す", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.showPermission();
    });

    expect(result.current.currentScreen).toBe("permission");

    act(() => {
      result.current.dismissPermission();
    });

    expect(result.current.currentScreen).toBe("suggestion");
    expect(result.current.suggestion).toBeDefined();
  });

  it("reactでdoneにすると完了画面になる", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.dismissPermission();
    });

    act(() => {
      result.current.react("done");
    });

    expect(result.current.currentScreen).toBe("done");
  });

  it("reactでskippedにするとスキップ画面になる", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.dismissPermission();
    });

    act(() => {
      result.current.react("skipped");
    });

    expect(result.current.currentScreen).toBe("skipped");
  });

  it("ensureTodaySuggestionは既存のサジェスションを返す", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.dismissPermission();
    });

    const suggestion1 = result.current.suggestion;

    // Re-render - should get same suggestion
    const { result: result2 } = renderHook(() => useAppState());
    act(() => {
      // Already onboarded from localStorage
    });
    expect(result2.current.suggestion.id).toBe(suggestion1.id);
  });

  it("clearAllDataでlocalStorageがクリアされリロードされる", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.dismissPermission();
    });

    act(() => {
      result.current.clearAllData();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("daily-noise:onboarded");
    expect(localStorage.removeItem).toHaveBeenCalledWith("daily-noise:suggestion");
    expect(localStorage.removeItem).toHaveBeenCalledWith("daily-noise:reactions");
    expect(reloadMock).toHaveBeenCalled();
  });

  it("reactionsが記録される", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.dismissPermission();
    });

    act(() => {
      result.current.react("done");
    });

    expect(result.current.reactions).toHaveLength(1);
    expect(result.current.reactions[0].action).toBe("done");
  });
});

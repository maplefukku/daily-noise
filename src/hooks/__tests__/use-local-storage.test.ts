import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useLocalStorage } from "../use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("初期値を返す", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  it("値を保存してlocalStorageに書き込む", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("updated")
    );
  });

  it("関数型更新ができる", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("removeValueでlocalStorageから削除される", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("value");
    });

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial");
    expect(window.localStorage.removeItem).toHaveBeenCalledWith("test-key");
  });
});

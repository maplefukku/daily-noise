import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession,
    },
  })),
}));

vi.mock("next/server", () => {
  class MockNextResponse {
    headers = new Map();
    cookies = {
      set: vi.fn(),
    };

    static next() {
      return new MockNextResponse();
    }
  }

  return { NextResponse: MockNextResponse };
});

import { proxy } from "@/proxy";

function createMockRequest(pathname: string) {
  return {
    cookies: {
      getAll: vi.fn(() => []),
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      clone() {
        return { pathname: "/", searchParams: new URLSearchParams() };
      },
    },
  } as unknown as Parameters<typeof proxy>[0];
}

describe("proxy", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.clearAllMocks();
  });

  it("セッションをリフレッシュしてレスポンスを返す", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const res = await proxy(createMockRequest("/"));
    expect(res).toBeDefined();
    expect(mockGetSession).toHaveBeenCalledOnce();
  });

  it("/history にセッションなしでもアクセスできる（MVP）", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const res = await proxy(createMockRequest("/history"));
    expect(res).toBeDefined();
  });

  it("/history にセッションありでもアクセスできる", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
    });
    const res = await proxy(createMockRequest("/history"));
    expect(res).toBeDefined();
  });
});

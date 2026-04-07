import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally for GLM API calls
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock env vars
vi.stubEnv("GLM_API_KEY", "test-api-key");
vi.stubEnv("GLM_BASE_URL", "https://api.z.ai/api/coding/paas/v4/");
vi.stubEnv("GLM_MODEL", "glm-4.7");

describe("GET /api/suggest", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns a suggestion from GLM API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "Podcastを1つ聴く",
                category: "Podcast",
              }),
            },
          },
        ],
      }),
    });

    const { GET } = await import("@/app/api/suggest/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("category");
    expect(data.title).toBe("Podcastを1つ聴く");
  });

  it("calls GLM API with correct parameters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "散歩に出る",
                category: "行動",
              }),
            },
          },
        ],
      }),
    });

    const { GET } = await import("@/app/api/suggest/route");
    await GET();

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("chat/completions");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("glm-4.7");
    expect(body.messages).toHaveLength(1);
    expect(body.messages[0].role).toBe("user");
  });

  it("returns 500 when GLM API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { GET } = await import("@/app/api/suggest/route");
    const response = await GET();

    expect(response.status).toBe(500);
  });

  it("returns 500 when GLM API returns invalid JSON", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "not valid json",
            },
          },
        ],
      }),
    });

    const { GET } = await import("@/app/api/suggest/route");
    const response = await GET();

    expect(response.status).toBe(500);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetSession = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession,
    },
  })),
}))

vi.mock('next/server', () => {
  class MockNextResponse {
    headers = new Map()
    cookies = {
      set: vi.fn(),
    }
    status: number
    redirectUrl?: string

    constructor(body?: BodyInit | null, init?: { status?: number }) {
      this.status = init?.status ?? 200
    }

    static next({ request }: { request: unknown }) {
      return new MockNextResponse()
    }

    static redirect(url: string | URL) {
      const res = new MockNextResponse(null, { status: 307 })
      res.redirectUrl = typeof url === 'string' ? url : url.toString()
      return res
    }
  }

  return { NextResponse: MockNextResponse }
})

import { middleware } from '@/middleware'

function createMockRequest(pathname: string) {
  return {
    cookies: {
      getAll: vi.fn(() => []),
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      clone() {
        return { pathname: '/', searchParams: new URLSearchParams() }
      },
    },
  } as unknown as Parameters<typeof middleware>[0]
}

describe('middleware', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
    vi.clearAllMocks()
  })

  it('allows access to public paths without session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    const res = await middleware(createMockRequest('/'))
    expect((res as Record<string, unknown>).redirectUrl).toBeUndefined()
  })

  it('redirects /history to / when not authenticated', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    const res = await middleware(createMockRequest('/history'))
    expect((res as Record<string, unknown>).redirectUrl).toBeDefined()
  })

  it('redirects /report to / when not authenticated', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    const res = await middleware(createMockRequest('/report'))
    expect((res as Record<string, unknown>).redirectUrl).toBeDefined()
  })

  it('allows /history when authenticated', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })
    const res = await middleware(createMockRequest('/history'))
    expect((res as Record<string, unknown>).redirectUrl).toBeUndefined()
  })

  it('allows /report when authenticated', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })
    const res = await middleware(createMockRequest('/report'))
    expect((res as Record<string, unknown>).redirectUrl).toBeUndefined()
  })
})

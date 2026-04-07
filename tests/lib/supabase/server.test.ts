import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCookieStore = {
  getAll: vi.fn(() => []),
  set: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
}))

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'

describe('supabase/server', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
    vi.clearAllMocks()
  })

  it('creates a server client with correct env vars', async () => {
    await createClient()
    expect(createServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    )
  })

  it('returns a client with auth property', async () => {
    const client = await createClient()
    expect(client).toHaveProperty('auth')
  })

  it('cookie getAll delegates to cookieStore', async () => {
    await createClient()
    const cookiesArg = (createServerClient as ReturnType<typeof vi.fn>).mock.calls[0][2]
    cookiesArg.cookies.getAll()
    expect(mockCookieStore.getAll).toHaveBeenCalled()
  })

  it('cookie setAll delegates to cookieStore.set', async () => {
    await createClient()
    const cookiesArg = (createServerClient as ReturnType<typeof vi.fn>).mock.calls[0][2]
    cookiesArg.cookies.setAll([
      { name: 'session', value: 'abc', options: { path: '/' } },
    ])
    expect(mockCookieStore.set).toHaveBeenCalledWith('session', 'abc', { path: '/' })
  })
})

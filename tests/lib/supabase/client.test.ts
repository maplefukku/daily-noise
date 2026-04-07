import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
}))

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/client'

describe('supabase/client', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
  })

  it('creates a browser client with correct env vars', () => {
    const client = createClient()
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
    expect(client).toBeDefined()
  })

  it('returns a client with auth property', () => {
    const client = createClient()
    expect(client).toHaveProperty('auth')
  })
})

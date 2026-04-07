import { describe, it, expect } from 'vitest'
import type { Suggestion, Profile, Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'

describe('types', () => {
  it('Suggestion type accepts valid data', () => {
    const suggestion: Suggestion = {
      id: 'uuid-1',
      user_id: 'user-uuid',
      category: 'podcast',
      title: 'おすすめポッドキャスト',
      created_at: '2026-04-07T00:00:00Z',
    }
    expect(suggestion.id).toBe('uuid-1')
    expect(suggestion.category).toBe('podcast')
  })

  it('Suggestion type accepts optional fields', () => {
    const suggestion: Suggestion = {
      id: 'uuid-2',
      user_id: 'user-uuid',
      category: 'video',
      title: '動画を観る',
      description: '面白い動画',
      duration: '10分',
      created_at: '2026-04-07T00:00:00Z',
      action: 'done',
      action_at: '2026-04-07T12:00:00Z',
    }
    expect(suggestion.action).toBe('done')
    expect(suggestion.duration).toBe('10分')
  })

  it('Profile type accepts valid data', () => {
    const profile: Profile = {
      id: 'user-uuid',
      email: 'test@example.com',
      notification_time: '08:00:00',
      created_at: '2026-04-07T00:00:00Z',
      updated_at: '2026-04-07T00:00:00Z',
    }
    expect(profile.email).toBe('test@example.com')
    expect(profile.notification_time).toBe('08:00:00')
  })

  it('CATEGORY_LABELS has all categories', () => {
    const categories: Category[] = ['podcast', 'video', 'article', 'app', 'action']
    categories.forEach(cat => {
      expect(CATEGORY_LABELS[cat]).toBeDefined()
      expect(typeof CATEGORY_LABELS[cat]).toBe('string')
    })
  })
})

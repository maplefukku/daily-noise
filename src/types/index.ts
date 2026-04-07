import type { Category } from './suggestion'

export type { Category, TodaySuggestion, ReactionLog, AppScreen } from './suggestion'
export { CATEGORY_LABELS } from './suggestion'

export interface Suggestion {
  id: string;
  user_id: string;
  category: Category;
  title: string;
  description?: string;
  duration?: string;
  created_at: string;
  action?: 'done' | 'skipped';
  action_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  notification_time: string;
  created_at: string;
  updated_at: string;
}

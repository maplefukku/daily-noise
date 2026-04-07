-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  notification_time TIME DEFAULT '08:00:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 提案テーブル
CREATE TABLE public.suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  action TEXT CHECK (action IN ('done', 'skipped')),
  action_at TIMESTAMPTZ
);

-- インデックス
CREATE INDEX idx_suggestions_user_id ON public.suggestions(user_id);
CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);
CREATE INDEX idx_suggestions_user_date ON public.suggestions(user_id, created_at);

-- RLS有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLSポリシー: suggestions
CREATE POLICY "Users can view own suggestions"
  ON public.suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggestions"
  ON public.suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions"
  ON public.suggestions FOR UPDATE
  USING (auth.uid() = user_id);

-- トリガー: 新規ユーザー作成時にprofiles自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

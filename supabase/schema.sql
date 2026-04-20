-- Enums
CREATE TYPE user_tier AS ENUM ('FREE_LISTENER', 'STUDENT', 'ADULT', 'ROOT_USER');

-- Profiles Table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  username text UNIQUE, -- Ensure unique usernames
  avatar_url text,
  tier user_tier DEFAULT 'FREE_LISTENER',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Books Table
CREATE TABLE public.books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  content_text text NOT NULL,
  publisher_name text, -- Step 9: NCERT, Macmillan, etc.
  grade_level text,    -- Step 9: Class 10, etc.
  academic_category text, -- Step 9: Math, Science, etc.
  is_study_book boolean DEFAULT false,
  uploaded_by_user_id uuid REFERENCES public.profiles(id) DEFAULT NULL,
  character_map jsonb DEFAULT '[]'::jsonb, -- Step 15: Character profiles
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 8: Track AI usage and payment activity
CREATE TABLE public.usage_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id),
  task_type text, -- e.g. 'STUDENT_HELP', 'CHAT'
  api_provider text,
  tokens_used integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Highlights Table
CREATE TABLE public.highlights (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE,
  highlighted_text text NOT NULL,
  page_number integer NOT NULL,
  line_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- Get Tier policy helper function
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id uuid)
RETURNS user_tier AS $$
  SELECT tier FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Books RLS

-- READ
-- FREE can read books where uploaded_by is NULL.
CREATE POLICY "FREE_LISTENER can read public books"
  ON public.books FOR SELECT
  USING (uploaded_by_user_id IS NULL AND public.get_user_tier(auth.uid()) = 'FREE_LISTENER');

-- PREMIUM can read all books
CREATE POLICY "PREMIUM can read all books"  
  ON public.books FOR SELECT
  USING (public.get_user_tier(auth.uid()) IN ('ADULT', 'ROOT_USER'));

-- STUDENT can read books where is_study_book is true
CREATE POLICY "STUDENT can read study books"
  ON public.books FOR SELECT
  USING (is_study_book = true AND public.get_user_tier(auth.uid()) = 'STUDENT');

-- UPLOAD
-- PREMIUM can upload their own
CREATE POLICY "PREMIUM can upload books"
  ON public.books FOR INSERT
  WITH CHECK (public.get_user_tier(auth.uid()) = 'ADULT' AND uploaded_by_user_id = auth.uid());

-- ROOT_USER can do everything
CREATE POLICY "ROOT_USER can upload books"
  ON public.books FOR INSERT
  WITH CHECK (public.get_user_tier(auth.uid()) = 'ROOT_USER');

CREATE POLICY "ROOT_USER can update books"
  ON public.books FOR UPDATE
  USING (public.get_user_tier(auth.uid()) = 'ROOT_USER');

CREATE POLICY "ROOT_USER can delete books"
  ON public.books FOR DELETE
  USING (public.get_user_tier(auth.uid()) = 'ROOT_USER');

-- Highlights RLS
-- Users can see their own highlights
CREATE POLICY "Users can view own highlights"
  ON public.highlights FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own highlights
CREATE POLICY "Users can insert own highlights"
  ON public.highlights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own highlights"
  ON public.highlights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own highlights"
  ON public.highlights FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage logs"
  ON public.usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat History Table (Step 14 Task 3)
CREATE TABLE public.chat_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE,
  role text NOT NULL, -- 'user' or 'assistant'
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notes Table (Task 3)
CREATE TABLE public.notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id uuid REFERENCES public.books(id) ON DELETE SET NULL, -- Notes can be general
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes"
  ON public.notes FOR ALL
  USING (auth.uid() = user_id);

-- Trigger to auto-assign Root User or Default roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF (NEW.email = 'harish.ramamoorthy7@gmail.com') THEN
    INSERT INTO public.profiles (id, email, tier, username)
    VALUES (NEW.id, NEW.email, 'ROOT_USER', 'HarishAdmin')
    ON CONFLICT (id) DO UPDATE SET tier = 'ROOT_USER', email = EXCLUDED.email;
  ELSE
    INSERT INTO public.profiles (id, email, tier)
    VALUES (NEW.id, NEW.email, 'FREE_LISTENER')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

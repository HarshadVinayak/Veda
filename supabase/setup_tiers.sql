-- ==========================================
-- VEDA DATABASE SCHEMA & SECURITY POLICIES
-- Target Project ID: szqlrwwcabexrqnollmf
-- ==========================================

-- 1. Create the Tier Enum (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE user_tier AS ENUM ('FREE_LISTENER', 'STUDENT', 'ADULT', 'ROOT_USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the Profiles Table
-- This table is the "Source of Truth" for user identity and feature access.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  username text UNIQUE,
  avatar_url text,
  tier user_tier DEFAULT 'FREE_LISTENER',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Secure Policies
-- Clear existing to avoid "already exists" errors during re-runs
DROP POLICY IF EXISTS "Profiles are viewable by self" ON public.profiles;
CREATE POLICY "Profiles are viewable by self" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. The "Root User" Security Trigger Logic
-- Automatically assigns Harish (Owner) the ROOT_USER tier.
-- Assigns a default 'HarishAdmin' username to prevent onboarding loops for the owner.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF (NEW.email = 'harish.ramamoorthy7@gmail.com') THEN
    INSERT INTO public.profiles (id, email, tier, username)
    VALUES (NEW.id, NEW.email, 'ROOT_USER', 'HarishAdmin')
    ON CONFLICT (id) DO UPDATE SET 
      tier = 'ROOT_USER',
      username = EXCLUDED.username;
  ELSE
    INSERT INTO public.profiles (id, email, tier)
    VALUES (NEW.id, NEW.email, 'FREE_LISTENER')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Activate Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Grant access for authenticated users to view profiles (required for user store)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

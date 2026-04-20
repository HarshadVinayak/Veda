import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// ──────────────────────────────────────────────
// Browser (client‑side) Supabase client
// Use this in "use client" components.
// ──────────────────────────────────────────────

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://rnvetgwxmbjythdgbzbn.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudmV0Z3d4bWJqeXRoZGdiemJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MTgwMjQsImV4cCI6MjA5MjA5NDAyNH0.4_fYNkAoCzgfIh19JmXW5P-eHBekqNCwCeh-5m9sgKE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

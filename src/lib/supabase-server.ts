import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

// ──────────────────────────────────────────────
// Server‑side Supabase client (App Router)
// Use in Server Components, Route Handlers, 
// and Server Actions — NOT in middleware.
// ──────────────────────────────────────────────

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://cyhixvdbjrdehkjimpky.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aGl4dmRianJkZWhramltcGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDc4MzMsImV4cCI6MjA5MTkyMzgzM30.utLLctJ_k0BcVvbvaTkpqLWmyhFzTAMOmUNdn2ULR30';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll can fail in Server Components (read‑only).
          // This is expected — the middleware will handle refresh.
        }
      },
    },
  });
}

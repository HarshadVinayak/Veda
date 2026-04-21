import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * PRODUCTION-READY AUTH CALLBACK
 * Exchanges Google code for session and handles strict tier-based redirects.
 * Note: Turbopack compatible exports.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Platform Owner Check
        const isRoot = user.email === 'harish.ramamoorthy7@gmail.com';
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, tier')
          .eq('id', user.id)
          .single();

        // 1. Root Bypass
        if (isRoot) {
           return NextResponse.redirect(`${origin}/dashboard`);
        }

        // 2. New User / Missing Username Check
        if (!profile?.username) {
           return NextResponse.redirect(`${origin}/onboarding`);
        }

        // 3. Existing User Redirect
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error("[Auth Callback Error]", error.message);
    }
  }

  // Fallback if no code or exchange error
  return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
}

const authCallback = { GET };
export default authCallback;

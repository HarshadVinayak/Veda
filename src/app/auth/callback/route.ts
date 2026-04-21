import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * FAIL-SAFE AUTH CALLBACK
 * Only handles the code exchange. 
 * The Proxy (middleware) handles all tier-based redirection.
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

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("[Auth Callback Error]", exchangeError.message, exchangeError.status);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`);
    }
  }

  // Fallback
  return NextResponse.redirect(`${origin}/login?error=no_auth_code`);
}

const authCallback = { GET };
export default authCallback;

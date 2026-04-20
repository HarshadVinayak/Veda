import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Step 20 Task 2: Robust Auth Callback
 * Handles the exchange of the auth code for a session and manages profile creation/checks.
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
       // Check if profile exists and has a username
       const { data: { user } } = await supabase.auth.getUser();
       
       if (user) {
         // Step 20 Logic: Root User Auto-Check
         const isRoot = user.email === 'harish.ramamoorthy7@gmail.com';
         
         const { data: profile } = await supabase
           .from('profiles')
           .select('username')
           .eq('id', user.id)
           .single();

         if (isRoot) {
           return NextResponse.redirect(`${origin}/dashboard`);
         }

         if (!profile?.username) {
           return NextResponse.redirect(`${origin}/onboarding`);
         }
       }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

// Added default export for Turbopack compatibility if needed (standard is GET function)
const authCallback = { GET };
export default authCallback;

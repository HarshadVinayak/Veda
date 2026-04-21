import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If logged in, check if user has a username
  if (user) {
    // Step 20: Root User Bypass
    const isRoot = user.email === 'harish.ramamoorthy7@gmail.com';
    const isOnboarding = request.nextUrl.pathname.startsWith("/onboarding");

    if (isRoot) {
      if (isOnboarding) return NextResponse.redirect(new URL("/dashboard", request.url));
      return response;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    const isMissingUsername = !profile?.username;

    // 1. Redirect to onboarding if username is missing
    if (isMissingUsername && !isOnboarding && request.nextUrl.pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // 2. Redirect away from onboarding if already complete
    if (!isMissingUsername && isOnboarding) {
       return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect routes
  const isDashboardPath = request.nextUrl.pathname.startsWith("/dashboard");
  const isReaderPath = request.nextUrl.pathname.startsWith("/reader");
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // 1. Must be logged in for any protected path
  if ((isDashboardPath || isReaderPath || isAdminPath) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Must be ROOT_USER for admin path
  if (isAdminPath && user) {
     const isRoot = user.email === 'harish.ramamoorthy7@gmail.com';
     if (!isRoot) {
       return NextResponse.redirect(new URL("/dashboard", request.url));
     }
  }

  if (request.nextUrl.pathname === "/login" && user) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

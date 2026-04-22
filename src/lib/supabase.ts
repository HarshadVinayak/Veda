import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * PRODUCTION-READY Browser Client
 * Uses @supabase/ssr to ensure PKCE code verifiers are stored in cookies.
 * This prevents the "PKCE code verifier not found" error during the OAuth callback.
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Root User Check Utility
 * Used to verify if a user is the platform owner.
 */
export function isRootUser(email?: string): boolean {
  if (!email) return false;
  return email.toLowerCase() === "harish.ramamoorthy7@gmail.com";
}

/**
 * Helper to determine user tier permissions
 */
export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  if (error || !data) return "FREE_LISTENER";
  return data.tier;
}

const supabaseLib = {
  supabase,
  isRootUser,
  getUserRole,
};

export default supabaseLib;

import { NextRequest, NextResponse } from 'next/server';
import { getAiWaterfall } from '@/lib/ai-orchestrator';
import { UserTier } from '@/types/database';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, taskType, tier: requestedTier } = await req.json();

    // ──────────────────────────────────────────────
    // Step 8: Auth & Tier Verification
    // ──────────────────────────────────────────────
    const DEMO_MODE = process.env.DEMO_MODE !== 'false';
    let userTier: UserTier = requestedTier || 'FREE';

    if (!DEMO_MODE) {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
          },
        }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      
      // Fetch real tier from profile
      const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single();
      if (profile) userTier = profile.tier as UserTier;
    }

    // ──────────────────────────────────────────────
    // Step 8: Waterfall AI Execution
    // ──────────────────────────────────────────────
    const result = await getAiWaterfall(userTier, context || '', prompt);

    // If result is from streamText, it will have toTextStreamResponse
    if (typeof result !== 'string' && 'toTextStreamResponse' in (result as any)) {
      return (result as any).toTextStreamResponse() as Response;
    }

    return NextResponse.json({ text: result }) as Response;
  } catch (err: any) {
    console.error("[AI Route Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

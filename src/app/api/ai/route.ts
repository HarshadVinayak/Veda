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
    let userTier: UserTier = requestedTier || 'FREE_LISTENER';

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

    const result = await getAiWaterfall(userTier, context || '', prompt);

    if (result && typeof result === 'object' && 'toTextStreamResponse' in result) {
      return (result as any).toTextStreamResponse();
    }

    if (typeof result === 'string') {
      return NextResponse.json({ text: result });
    }

    return NextResponse.json({ error: 'Invalid response' }, { status: 500 });
  } catch (err: any) {
    console.error("[AI Route Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

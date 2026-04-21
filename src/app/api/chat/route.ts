import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getAiWaterfall } from '@/lib/ai-orchestrator';
import { UserTier } from '@/types/database';

export const runtime = 'edge';

/**
 * AI Chat Route
 * Centralized entry for book-related AI queries.
 * Enforces tier-based personality via the AI Orchestrator.
 */
export async function POST(req: Request) {
  try {
    const { messages, bookContext, bookId, userId } = await req.json();

    // 1. Fetch User Tier via Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll(); } } }
    );

    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const tier: UserTier = profile?.tier || 'FREE_LISTENER';

    // 2. Prepare History (excluding the last user query which we pass separately to orchestrator)
    const history = messages.slice(0, -1);
    const lastQuery = messages[messages.length - 1].content;

    // 3. Delegate to Fail-Safe Orchestrator
    const result = await getAiWaterfall(
      tier,
      bookContext,
      lastQuery,
      true, // stream
      history
    );

    // 4. Return Streamed Response
    return (result as any).toTextStreamResponse();

  } catch (err: any) {
    console.error('[API Chat Error]', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

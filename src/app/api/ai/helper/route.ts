import { NextRequest, NextResponse } from 'next/server';
import { getAiWaterfall } from '@/lib/ai-orchestrator';
import { UserTier } from '@/types/database';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { contextText, userQuery, tier = 'FREE' } = await req.json();

    if (!contextText || !userQuery) {
      return NextResponse.json({ error: 'Missing context' }, { status: 400 });
    }

    // Use the orchestrator with automatic fallback and model switching
    const response = await getAiWaterfall(tier as UserTier, contextText, userQuery);

    if (typeof response === 'string') {
      return NextResponse.json({ text: response });
    }

    return response;
  } catch (err: any) {
    console.error("AI Helper Route Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

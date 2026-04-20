import { NextRequest, NextResponse } from 'next/server';
import { getAiWaterfall } from '@/lib/ai-orchestrator';
import { UserTier } from '@/types/database';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { context, question } = await req.json();

    if (!context || !question) {
      return NextResponse.json(
        { error: 'Missing context or question' },
        { status: 400 }
      );
    }

    // Use THE ORCHESTRATOR for reliability
    // Pass stream=false to get a JSON response for this specific toolified UI
    const answer = await getAiWaterfall('STUDENT', context, question, false);
    
    return NextResponse.json({ answer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

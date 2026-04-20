import { NextRequest, NextResponse } from 'next/server';
import { getAiWaterfall } from '@/lib/ai-orchestrator';
import { UserTier } from '@/types/database';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { contextText, userQuery, tier = 'FREE' } = await req.json();

    if (!contextText || !userQuery) {
      return NextResponse.json({ error: 'Missing context' }, { status: 400 });
    }

    const response = await getAiWaterfall(tier as UserTier, contextText, userQuery);

    if (typeof response === 'string') {
      return NextResponse.json({ text: response });
    }

    // Use .toDataStreamResponse() for compatibility with useChat/useCompletion
    // or .toTextStreamResponse() for simple text streaming.
    if (response && typeof response === 'object' && 'toTextStreamResponse' in response) {
      return (response as any).toTextStreamResponse();
    }

    return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
  } catch (err: any) {
    console.error("AI Helper Route Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

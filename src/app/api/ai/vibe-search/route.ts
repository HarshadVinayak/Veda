import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { vibe } = await req.json();

    const cerebras = createOpenAI({
      baseURL: 'https://api.cerebras.ai/v1',
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    // Step 16 Task 1: Vibe Search via Cerebras
    const { text } = await generateText({
      model: cerebras('llama3.1-70b'),
      system: `You are a librarian who categorizes books by mood and feeling. 
      The user will give you a 'vibe' (e.g., 'spooky for a rainy night'). 
      Return a JSON-like list of keywords that describe this vibe to help filter books.`,
      prompt: `Vibe: ${vibe}`,
    });

    // Mock search results for this demo
    return new Response(JSON.stringify({ keywords: text.split(','), recommendedTitles: [] }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

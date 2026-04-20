import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { title, context } = await req.json();

    const cerebras = createOpenAI({
      baseURL: 'https://api.cerebras.ai/v1',
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    // Step 15 Task 1: Dramatic Chapter Intro
    const { text } = await generateText({
      model: cerebras('llama3.1-70b'),
      system: `You are a dramatic audiobook narrator for KuKu FM. 
      Generate a 2-line, exciting, and mystery-filled introduction for this chapter. 
      Do NOT mention 'chapter' or 'book', just set the mood.`,
      prompt: `Title: ${title}\nContext: ${context.slice(0, 500)}`,
    });

    return new Response(JSON.stringify({ intro: text }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { character, bookId } = await req.json();

    // Use Gemini via OpenAI compatibility (stable)
    const gemini = createOpenAI({
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Step 15 Task 2: X-Ray via Gemini
    const { text } = await generateText({
      model: gemini('gemini-1.5-flash'),
      system: `You are an X-Ray guide for a book. Provide a spoiler-free biography of the character provided, based on general knowledge of the book. 
      Help the reader remember who this is without ruinous plot reveals.`,
      prompt: `Character Name: ${character}\nBook Reference ID: ${bookId}`,
    });

    return new Response(JSON.stringify({ bio: text }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

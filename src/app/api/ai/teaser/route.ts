import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });

    // Step 16 Task 2: 15-second teaser script via Groq
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a scriptwriter for KuKu FM. Create a 15-second, high-intensity audiobook teaser for this book. 
      Use active verbs and dramatic structure.`,
      prompt: `Title: ${title}\nContent Sample: ${content.slice(0, 1000)}`,
    });

    return new Response(JSON.stringify({ teaser: text }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

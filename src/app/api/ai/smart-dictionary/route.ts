import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { word, context } = await req.json();

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });

    // Step 15 Task 2: Smart Dictionary via Groq
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a storytelling dictionary. Explain the word or phrase provided in the context of the story. 
      Help the reader understand any historical references or complex metaphors.`,
      prompt: `Word/Phrase: ${word}\nContext: ${context.slice(0, 500)}`,
    });

    return new Response(JSON.stringify({ definition: text }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

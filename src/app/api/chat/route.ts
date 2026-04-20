import { createOpenAI } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

const PROVIDERS = {
  cerebras: {
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY,
    model: 'llama3.1-70b'
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile'
  },
  sambanova: {
    baseURL: 'https://api.sambanova.ai/v1',
    apiKey: process.env.SAMBANOVA_API_KEY,
    model: 'Meta-Llama-3.1-70B-Instruct'
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash'
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'google/gemma-2-9b-it:free'
  }
};

export async function POST(req: Request) {
  try {
    const { messages, bookContext, bookId, userId } = await req.json();

    const systemMessage = {
      role: 'system',
      content: `You are an expert reading assistant for Better Kindle. 
      Context from the current page of the book:
      ---
      ${bookContext.slice(-2000)}
      ---
      Help the user with their questions based on this context and previous chat history.`
    };

    const fullMessages = [systemMessage, ...messages];

    // Step 14 Task 1: Waterfall Strategy
    const providers: (keyof typeof PROVIDERS)[] = ['cerebras', 'groq', 'sambanova', 'gemini', 'openrouter'];

    for (const key of providers) {
      const config = PROVIDERS[key];
      if (!config.apiKey) continue;

      try {
        const client = createOpenAI({
          baseURL: config.baseURL,
          apiKey: config.apiKey,
        });

        const result = streamText({
          model: client(config.model),
          messages: fullMessages,
          onFinish: async ({ text }) => {
            // Step 14 Task 3: Save to Supabase
            const cookieStore = await cookies();
            const supabase = createServerClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              { cookies: { getAll() { return cookieStore.getAll(); } } }
            );

            // Save user's last message if not already saved (Frontend usually handles this, but let's be safe)
            const lastUserMessage = messages[messages.length - 1];
            
            await supabase.from('chat_history').insert([
              { 
                user_id: userId, 
                book_id: bookId, 
                role: 'user', 
                content: lastUserMessage.content 
              },
              { 
                user_id: userId, 
                book_id: bookId, 
                role: 'assistant', 
                content: text 
              }
            ]);
          }
        });

        return result.toTextStreamResponse();
      } catch (err: any) {
        console.warn(`[Chat Waterfall] Provider ${key} failed, falling back...`, err.message);
        continue;
      }
    }

    throw new Error('All AI providers failed');
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

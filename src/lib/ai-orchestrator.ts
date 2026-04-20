import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';
import { UserTier } from '@/types/database';

export const PROVIDERS = {
  cerebras: {
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY!,
    model: 'llama3.1-70b',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY!,
    model: 'llama-3.3-70b-versatile',
  },
  sambanova: {
    baseURL: 'https://api.sambanova.ai/v1',
    apiKey: process.env.SAMBANOVA_API_KEY!,
    model: 'Meta-Llama-3.1-70B-Instruct',
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY!,
    model: 'gemini-1.5-flash',
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY!,
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemma-3-27b-it:free'
    ],
  },
} as const;

// ──────────────────────────────────────────────
// Specialized TIER-BASED System Prompts (Step 8)
// ──────────────────────────────────────────────
const SYSTEM_PROMPTS: Record<UserTier, string> = {
  FREE_LISTENER: 'You are a helpful reading assistant. Be concise.',
  STUDENT: 'You are a PhD Tutor for students. Provide expert step-by-step academic solutions using the specific curriculum terminology of the provided book.',
  ADULT: 'You are a professional editor and literary analyst. Provide deep structural insights, character analysis, and comprehensive summaries.',
  ROOT_USER: 'You are a high-level system architect with full access to metadata and book indexing tools.',
};

function truncateContext(text: string, limit = 2000): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "... [truncated]";
}

export async function getAiWaterfall(tier: UserTier, context: string, query: string, stream = true) {
  const truncatedContext = truncateContext(context);
  const fullPrompt = `Context: ${truncatedContext}\n\nQuery: ${query}`;
  const systemPrompt = SYSTEM_PROMPTS[tier];

  // Waterfall priority: Cerebras -> Groq -> SambaNova -> Gemini (Final Safety)
  const providerKeys: (keyof typeof PROVIDERS)[] = ['cerebras', 'groq', 'sambanova', 'gemini'];

  for (const key of providerKeys) {
    try {
      const config = PROVIDERS[key];
      
      // All providers now use createOpenAI thanks to the compatibility layer
      const client = createOpenAI({ 
        baseURL: (config as any).baseURL, 
        apiKey: (config as any).apiKey 
      });
      const model = client((config as any).model);

      if (stream) return streamText({ model, system: systemPrompt, prompt: fullPrompt });
      return (await generateText({ model, system: systemPrompt, prompt: fullPrompt })).text;

    } catch (err: any) {
      console.warn(`[Waterfall] Provider ${key} failed:`, err.message);
      // Fallback to next
      continue;
    }
  }

  throw new Error("Critical: All AI Providers (Waterfall) failed.");
}

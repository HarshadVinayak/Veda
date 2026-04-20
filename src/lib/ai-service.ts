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
} as const;

const SYSTEM_PROMPTS: Record<UserTier, string> = {
  FREE_LISTENER: 'You are a helpful reading assistant. Be concise.',
  STUDENT: 'You are a PhD Tutor for students. Provide expert step-by-step academic solutions using the specific curriculum terminology of the provided book.',
  ADULT: 'You are a professional editor and literary analyst. Provide deep structural insights, character analysis, and comprehensive summaries.',
  ROOT_USER: 'You are a high-level system architect with full access to Veda platform controls.',
};

/**
 * Centered AI Service with Fail-Safe Waterfall logic.
 * Priority: Cerebras -> Groq -> SambaNova -> Gemini
 */
export async function getAiResponse({
  tier,
  context,
  query,
  stream = true,
}: {
  tier: UserTier;
  context: string;
  query: string;
  stream?: boolean;
}) {
  const systemPrompt = SYSTEM_PROMPTS[tier] || SYSTEM_PROMPTS.FREE_LISTENER;
  const fullPrompt = `Context information is below.\n---------------------\n${context}\n---------------------\nGiven the context information and not prior knowledge, answer the query.\nQuery: ${query}`;

  const providerOrder: (keyof typeof PROVIDERS)[] = ['cerebras', 'groq', 'sambanova', 'gemini'];

  for (const providerKey of providerOrder) {
    try {
      const config = PROVIDERS[providerKey];
      
      if (!config.apiKey) {
        console.warn(`[AI Service] Missing API key for ${providerKey}, skipping...`);
        continue;
      }

      const client = createOpenAI({
        baseURL: config.baseURL,
        apiKey: config.apiKey,
      });

      const model = client(config.model);

      if (stream) {
        return streamText({
          model,
          system: systemPrompt,
          prompt: fullPrompt,
        });
      } else {
        const { text } = await generateText({
          model,
          system: systemPrompt,
          prompt: fullPrompt,
        });
        return text;
      }
    } catch (error: any) {
      console.error(`[AI Service] ${providerKey} failed:`, error.message);
      // Continue to next provider in waterfall
      continue;
    }
  }

  throw new Error("Critical: All AI Providers (Waterfall) failed.");
}

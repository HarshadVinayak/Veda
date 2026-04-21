import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';
import { UserTier } from '@/types/database';

/**
 * PRODUCTION AI ORCHESTRATOR
 * Implements a robust Waterfall/Failover system for Veda.
 * Priority: Cerebras (Speed) -> Groq -> SambaNova -> OpenRouter -> Gemini -> Together -> Hugging Face.
 */
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
    model: 'Meta-Llama-3.1-405B-Instruct',
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY!,
    model: 'meta-llama/llama-3.3-70b-instruct',
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY!,
    model: 'gemini-1.5-flash',
  },
  together: {
    baseURL: 'https://api.together.xyz/v1',
    apiKey: process.env.TOGETHER_API_KEY!,
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  },
} as const;

const SYSTEM_PROMPTS: Record<UserTier, string> = {
  FREE_LISTENER: 'You are the Veda AI Search Engine. Your primary role is to help users find information within books and provide brief, accurate summaries of search results. You do not engage in deep conversations or study help.',
  STUDENT: 'You are the Veda AI Study Helper. You are a PhD-level academic tutor. Your role is to solve sums, explain complex concepts from textbooks, and provide step-by-step logic for students.',
  ADULT: 'You are the Veda AI Chatbot Assistant. You are a versatile conversational agent. You can discuss literature, provide deep insights, and act as a personal literary consultant.',
  ROOT_USER: 'You are the Veda Omnipotent System Architect. Full feature access enabled. You provide the highest level of detail across search, study help, and chatting.',
};

export async function getAiWaterfall(tier: UserTier, context: string, query: string, stream = true, history: any[] = []) {
  const systemPrompt = SYSTEM_PROMPTS[tier] || SYSTEM_PROMPTS.FREE_LISTENER;
  
  // Format messages for Chat
  const messages = [
    { role: 'system', content: `${systemPrompt}${context ? `\n\nContext from book:\n${context.slice(-2000)}` : ''}` },
    ...history,
    { role: 'user', content: query }
  ];

  const providerOrder: (keyof typeof PROVIDERS)[] = [
    'cerebras', 
    'groq', 
    'sambanova', 
    'openrouter', 
    'gemini', 
    'together'
  ];

  for (const key of providerOrder) {
    try {
      const config = PROVIDERS[key];
      if (!config.apiKey || config.apiKey.includes('placeholder')) continue;

      const client = createOpenAI({ 
        baseURL: config.baseURL, 
        apiKey: config.apiKey 
      });
      const model = client(config.model);

      if (stream) {
        return streamText({
          model,
          messages: messages as any,
        });
      }

      const { text } = await generateText({
        model,
        messages: messages as any,
      });

      if (!text) throw new Error("Empty response");
      return text;

    } catch (err: any) {
      console.warn(`[AI Waterfall] ${key} failed:`, err.message);
      continue;
    }
  }

  throw new Error("Critical: All AI Providers failed.");
}

const orchestrator = { getAiWaterfall, PROVIDERS };
export default orchestrator;

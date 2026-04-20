import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const AI_PROVIDERS = {
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY!,
    defaultModel: 'llama3-8b-8192'
  },
  sambanova: {
    baseURL: 'https://api.sambanova.ai/v1',
    apiKey: process.env.SAMBANOVA_API_KEY!,
    defaultModel: 'Meta-Llama-3-8B-Instruct'
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY!,
    defaultModel: 'meta-llama/llama-3-8b-instruct:free'
  }
};

export type ProviderName = keyof typeof AI_PROVIDERS;

export async function processAiHelperRequest(
  providerName: ProviderName,
  tier: 'FREE' | 'PREMIUM' | 'STUDENT' | 'SUPER',
  contextText: string,
  userQuery: string
) {
  const providerConfig = AI_PROVIDERS[providerName] || AI_PROVIDERS.groq;
  
  const openai = createOpenAI({
    baseURL: providerConfig.baseURL,
    apiKey: providerConfig.apiKey,
  });

  const model = openai(providerConfig.defaultModel);

  let systemPrompt = "You are a helpful AI reading assistant.";
  
  if (tier === 'STUDENT') {
    systemPrompt = "You are an expert Study Helper and tutor. Provide step-by-step math or science solutions. Be encouraging, patient, and use the Socratic method when appropriate to help the user understand.";
  } else if (tier === 'PREMIUM' || tier === 'SUPER') {
    systemPrompt = "You are a reading assistant. Your task is to provide a concise, insightful summary of the highlighted text the user provides, and answer any queries they give based on that text.";
  }

  const prompt = `Context (Highlighted text): ${contextText}\n\nUser Query: ${userQuery}`;

  const result = streamText({
    model,
    system: systemPrompt,
    prompt: prompt,
  });

  return (await result).toTextStreamResponse();
}

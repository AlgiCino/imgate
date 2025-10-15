export type OpenRouterConfig = {
  defaultModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  siteURL: string;
  siteName: string;
  systemPrompts?: Record<string, string>;
};

export const aiConfig: OpenRouterConfig = {
  defaultModel: "meta-llama/llama-3.1-8b-instruct:free",
  fallbackModel: "google/gemma-2-9b-it:free",
  temperature: 0.7,
  maxTokens: 2000,
  siteURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  siteName: "Imperium Gate AI",
};

export default aiConfig;

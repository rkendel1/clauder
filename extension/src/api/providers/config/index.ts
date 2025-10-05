// providers/index.ts
import { deepseekConfig } from "./deepseek"
import { openaiConfig } from "./openai"
import { PROVIDER_IDS } from "../constants"
import { ProviderConfig } from "../types"
import { googleGenAIConfig } from "./google-genai"
import { openaiCompatible } from "./openai-compatible"
import { mistralConfig } from "./mistral"
import { anthropicConfig } from "./anthropic"
import { openRouterConfig } from "./openrouter"
import { aiderConfig } from "./aider"

/**
 * Universal provider configuration registry.
 * All providers are registered here equally - no provider receives special treatment.
 * This ensures a truly provider-agnostic architecture.
 */
export const providerConfigs: Record<string, ProviderConfig> = {
	[PROVIDER_IDS.DEEPSEEK]: deepseekConfig,
	[PROVIDER_IDS.OPENAI]: openaiConfig,
	[PROVIDER_IDS.GOOGLE_GENAI]: googleGenAIConfig,
	[PROVIDER_IDS.OPENAICOMPATIBLE]: openaiCompatible,
	[PROVIDER_IDS.MISTRAL]: mistralConfig,
	[PROVIDER_IDS.ANTHROPIC]: anthropicConfig,
	[PROVIDER_IDS.OPENROUTER]: openRouterConfig,
	[PROVIDER_IDS.AIDER]: aiderConfig,
	// Add other providers here as they're created
}

/**
 * Flat list of all models from all providers.
 * Models are provider-agnostic at this level.
 */
export const models = Object.values(providerConfigs).flatMap((provider) => provider.models)

export type ProviderConfigs = typeof providerConfigs

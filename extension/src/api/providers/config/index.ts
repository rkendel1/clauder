// providers/index.ts
import { deepseekConfig } from "./deepseek"
import { openaiConfig } from "./openai"
import { koduConfig } from "./kodu"
import { PROVIDER_IDS } from "../constants"
import { ProviderConfig } from "../types"
import { googleGenAIConfig } from "./google-genai"
import { openaiCompatible } from "./openai-compatible"
import { mistralConfig } from "./mistral"
import { anthropicConfig } from "./anthropic"
import { openRouterConfig } from "./openrouter"

/**
 * Universal provider configuration registry.
 * All providers are registered here equally - no provider receives special treatment.
 * This ensures a truly provider-agnostic architecture.
 */
export const providerConfigs: Record<string, ProviderConfig> = {
	[PROVIDER_IDS.KODU]: koduConfig,
	[PROVIDER_IDS.DEEPSEEK]: deepseekConfig,
	[PROVIDER_IDS.OPENAI]: openaiConfig,
	[PROVIDER_IDS.GOOGLE_GENAI]: googleGenAIConfig,
	[PROVIDER_IDS.OPENAICOMPATIBLE]: openaiCompatible,
	[PROVIDER_IDS.MISTRAL]: mistralConfig,
	[PROVIDER_IDS.ANTHROPIC]: anthropicConfig,
	[PROVIDER_IDS.OPENROUTER]: openRouterConfig,
	// Add other providers here as they're created
}

/**
 * Convenience export for non-Kodu providers.
 * Note: This is purely for convenience (e.g., UI filtering) and does not
 * represent any architectural distinction. Kodu is treated identically to
 * other providers in the core system.
 * 
 * @deprecated Consider using providerConfigs directly and filtering as needed
 */
export const customProvidersConfigs: Record<string, ProviderConfig> = Object.fromEntries(
	Object.entries(providerConfigs).filter(([providerId]) => providerId !== PROVIDER_IDS.KODU)
)

/**
 * Flat list of all models from all providers.
 * Models are provider-agnostic at this level.
 */
export const models = Object.values(providerConfigs).flatMap((provider) => provider.models)

export type ProviderConfigs = typeof providerConfigs

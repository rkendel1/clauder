// providers/aider.ts
/**
 * Aider Provider Configuration
 * 
 * Aider is an AI pair programming tool that can be run locally or as a service.
 * This configuration enables the VS Code extension to communicate with Aider
 * through its OpenAI-compatible API interface.
 * 
 * Configuration:
 * - baseUrl: The URL where Aider's API is accessible (default: http://localhost:8080/v1)
 * - apiKey: Optional API key for authentication (Aider can run without auth locally)
 * - models: Supports various models through Aider's proxy capabilities
 * 
 * Note: Aider acts as a proxy to underlying AI providers (OpenAI, Anthropic, etc.)
 * so the actual model availability depends on your Aider configuration.
 */

import { ProviderConfig } from "../types"
import { DEFAULT_BASE_URLS, PROVIDER_IDS, PROVIDER_NAMES } from "../constants"

export const aiderConfig: ProviderConfig = {
	id: PROVIDER_IDS.AIDER,
	name: PROVIDER_NAMES[PROVIDER_IDS.AIDER],
	baseUrl: DEFAULT_BASE_URLS[PROVIDER_IDS.AIDER],
	models: [
		{
			// Aider with GPT-4 (default configuration)
			id: "gpt-4",
			name: "Aider GPT-4",
			contextWindow: 128000,
			maxTokens: 4096,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 30.0, // Price depends on underlying provider
			outputPrice: 60.0,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			// Aider with GPT-4 Turbo
			id: "gpt-4-turbo",
			name: "Aider GPT-4 Turbo",
			contextWindow: 128000,
			maxTokens: 4096,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 10.0,
			outputPrice: 30.0,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			// Aider with GPT-3.5 Turbo (more cost-effective)
			id: "gpt-3.5-turbo",
			name: "Aider GPT-3.5 Turbo",
			contextWindow: 16385,
			maxTokens: 4096,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 0.5,
			outputPrice: 1.5,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			// Aider with Claude (if configured with Anthropic backend)
			id: "claude-3-opus-20240229",
			name: "Aider Claude 3 Opus",
			contextWindow: 200000,
			maxTokens: 4096,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 15.0,
			outputPrice: 75.0,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			// Aider with Claude Sonnet
			id: "claude-3-5-sonnet-20241022",
			name: "Aider Claude 3.5 Sonnet",
			contextWindow: 200000,
			maxTokens: 8096,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 3.0,
			outputPrice: 15.0,
			provider: PROVIDER_IDS.AIDER,
			isRecommended: true,
		},
	],
	requiredFields: ["apiKey", "baseUrl"],
}

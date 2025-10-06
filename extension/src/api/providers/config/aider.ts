// providers/aider.ts
/**
 * Aider Provider Configuration
 * 
 * Aider is an AI pair programming tool that can be run locally or as a service.
 * This configuration enables the VS Code extension to communicate with Aider
 * through its OpenAI-compatible API interface.
 * 
 * ## Overview
 * Aider provides a unified interface for multiple AI models and providers,
 * making it easy to switch between different backends while maintaining
 * consistent code editing capabilities.
 * 
 * ## Configuration Fields
 * - **baseUrl**: The URL where Aider's API is accessible
 *   - Default: http://localhost:8080/v1
 *   - For Docker: Use the container name or localhost with port mapping
 *   - For remote servers: Use the full URL including protocol and port
 * 
 * - **apiKey**: API key for the underlying AI provider
 *   - Required for cloud providers (OpenAI, Anthropic, etc.)
 *   - May be optional for local models (Ollama, LMStudio)
 *   - Aider passes this to the configured backend provider
 * 
 * ## Supported Models
 * This configuration supports various models through Aider's proxy:
 * 
 * ### OpenAI Models
 * - GPT-4o, GPT-4o Mini (with prompt caching support)
 * - GPT-4, GPT-4 Turbo
 * - GPT-3.5 Turbo
 * - O1 Preview, O1 Mini (reasoning models)
 * 
 * ### Claude Models (Anthropic)
 * - Claude 3.5 Sonnet, Claude 3.5 Haiku (with prompt caching)
 * - Claude 3 Opus, Claude 3 Haiku (with prompt caching)
 * 
 * ### Google Gemini Models
 * - Gemini 2.0 Flash Exp, Gemini 1.5 Pro, Gemini 1.5 Flash (with prompt caching)
 * 
 * ### DeepSeek Models
 * - DeepSeek Chat (with prompt caching), DeepSeek Coder
 * 
 * ### Mistral Models
 * - Mistral Large, Mistral Medium
 * 
 * ### Meta Llama Models
 * - Llama 3.1 70B, Llama 3.1 405B
 * 
 * Many models support prompt caching to reduce costs and improve performance.
 * See individual model configurations for pricing and capabilities.
 * 
 * ## Usage Notes
 * - Ensure Aider is running and accessible at the configured baseUrl
 * - Model availability depends on your Aider backend configuration
 * - Test connection before starting tasks for best experience
 * 
 * @see {@link https://aider.chat} for more information about Aider
 */

import { ProviderConfig } from "../types"
import { DEFAULT_BASE_URLS, PROVIDER_IDS, PROVIDER_NAMES } from "../constants"

export const aiderConfig: ProviderConfig = {
	id: PROVIDER_IDS.AIDER,
	name: PROVIDER_NAMES[PROVIDER_IDS.AIDER],
	baseUrl: DEFAULT_BASE_URLS[PROVIDER_IDS.AIDER],
	models: [
		// OpenAI Models
		{
			id: "gpt-4o",
			name: "Aider GPT-4o",
			contextWindow: 128000,
			maxTokens: 16384,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 2.5,
			outputPrice: 10.0,
			cacheWritesPrice: 3.125,
			cacheReadsPrice: 0.25,
			provider: PROVIDER_IDS.AIDER,
			isRecommended: true,
		},
		{
			id: "gpt-4o-mini",
			name: "Aider GPT-4o Mini",
			contextWindow: 128000,
			maxTokens: 16384,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 0.15,
			outputPrice: 0.6,
			cacheWritesPrice: 0.1875,
			cacheReadsPrice: 0.015,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "gpt-4",
			name: "Aider GPT-4",
			contextWindow: 128000,
			maxTokens: 4096,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 30.0,
			outputPrice: 60.0,
			provider: PROVIDER_IDS.AIDER,
		},
		{
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
			id: "o1-preview",
			name: "Aider O1 Preview",
			contextWindow: 128000,
			maxTokens: 32768,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 15.0,
			outputPrice: 60.0,
			provider: PROVIDER_IDS.AIDER,
			isThinkingModel: true,
		},
		{
			id: "o1-mini",
			name: "Aider O1 Mini",
			contextWindow: 128000,
			maxTokens: 65536,
			supportsImages: true,
			supportsPromptCache: false,
			inputPrice: 3.0,
			outputPrice: 12.0,
			provider: PROVIDER_IDS.AIDER,
			isThinkingModel: true,
		},
		// Claude Models
		{
			id: "claude-3-5-sonnet-20241022",
			name: "Aider Claude 3.5 Sonnet",
			contextWindow: 200000,
			maxTokens: 8096,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 3.0,
			outputPrice: 15.0,
			cacheWritesPrice: 3.75,
			cacheReadsPrice: 0.3,
			provider: PROVIDER_IDS.AIDER,
			isRecommended: true,
		},
		{
			id: "claude-3-5-haiku-20241022",
			name: "Aider Claude 3.5 Haiku",
			contextWindow: 200000,
			maxTokens: 8096,
			supportsImages: false,
			supportsPromptCache: true,
			inputPrice: 0.8,
			outputPrice: 4.0,
			cacheWritesPrice: 1.0,
			cacheReadsPrice: 0.08,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "claude-3-opus-20240229",
			name: "Aider Claude 3 Opus",
			contextWindow: 200000,
			maxTokens: 4096,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 15.0,
			outputPrice: 75.0,
			cacheWritesPrice: 18.75,
			cacheReadsPrice: 1.5,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "claude-3-haiku-20240307",
			name: "Aider Claude 3 Haiku",
			contextWindow: 200000,
			maxTokens: 4096,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 0.25,
			outputPrice: 1.25,
			cacheWritesPrice: 0.3125,
			cacheReadsPrice: 0.025,
			provider: PROVIDER_IDS.AIDER,
		},
		// Google Gemini Models
		{
			id: "gemini-2.0-flash-exp",
			name: "Aider Gemini 2.0 Flash Exp",
			contextWindow: 1000000,
			maxTokens: 8192,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 0.0,
			outputPrice: 0.0,
			cacheWritesPrice: 0.0,
			cacheReadsPrice: 0.0,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "gemini-1.5-pro",
			name: "Aider Gemini 1.5 Pro",
			contextWindow: 2000000,
			maxTokens: 8192,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 1.25,
			outputPrice: 5.0,
			cacheWritesPrice: 1.5625,
			cacheReadsPrice: 0.125,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "gemini-1.5-flash",
			name: "Aider Gemini 1.5 Flash",
			contextWindow: 1000000,
			maxTokens: 8192,
			supportsImages: true,
			supportsPromptCache: true,
			inputPrice: 0.075,
			outputPrice: 0.3,
			cacheWritesPrice: 0.09375,
			cacheReadsPrice: 0.0075,
			provider: PROVIDER_IDS.AIDER,
		},
		// DeepSeek Models
		{
			id: "deepseek-chat",
			name: "Aider DeepSeek Chat",
			contextWindow: 64000,
			maxTokens: 8192,
			supportsImages: false,
			supportsPromptCache: true,
			inputPrice: 0.14,
			outputPrice: 0.28,
			cacheWritesPrice: 0.14,
			cacheReadsPrice: 0.014,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "deepseek-coder",
			name: "Aider DeepSeek Coder",
			contextWindow: 64000,
			maxTokens: 8192,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 0.14,
			outputPrice: 0.28,
			provider: PROVIDER_IDS.AIDER,
		},
		// Mistral Models
		{
			id: "mistral-large-latest",
			name: "Aider Mistral Large",
			contextWindow: 128000,
			maxTokens: 8192,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 2.0,
			outputPrice: 6.0,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "mistral-medium-latest",
			name: "Aider Mistral Medium",
			contextWindow: 32000,
			maxTokens: 8192,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 2.7,
			outputPrice: 8.1,
			provider: PROVIDER_IDS.AIDER,
		},
		// Meta Llama Models
		{
			id: "meta-llama/llama-3.1-70b-instruct",
			name: "Aider Llama 3.1 70B",
			contextWindow: 128000,
			maxTokens: 8192,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 0.35,
			outputPrice: 0.4,
			provider: PROVIDER_IDS.AIDER,
		},
		{
			id: "meta-llama/llama-3.1-405b-instruct",
			name: "Aider Llama 3.1 405B",
			contextWindow: 128000,
			maxTokens: 8192,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 2.7,
			outputPrice: 2.7,
			provider: PROVIDER_IDS.AIDER,
		},
	],
	requiredFields: ["apiKey", "baseUrl"],
}

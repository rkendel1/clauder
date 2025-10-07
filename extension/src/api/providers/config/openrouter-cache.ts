// OpenRouter model cache manager
import axios from "axios"
import * as vscode from "vscode"
import { ModelInfo } from "../types"
import { PROVIDER_IDS } from "../constants"
import { CacheManager } from "./cache-manager"

/**
 * OpenRouter Model Cache Manager - Singleton class to handle caching OpenRouter models
 */
export class OpenRouterModelCache {
	private static instance: OpenRouterModelCache | null = null
	private cacheManager: CacheManager<ModelInfo[]>

	private constructor(context: vscode.ExtensionContext) {
		this.cacheManager = new CacheManager<ModelInfo[]>(context, {
			filename: "openrouter-models.json",
			ttl: 60 * 60 * 1000, // 1 hour
			useMemoryCache: true,
		})
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(context?: vscode.ExtensionContext): OpenRouterModelCache {
		if (!OpenRouterModelCache.instance) {
			if (!context) {
				throw new Error("Context must be provided when creating the OpenRouterModelCache instance")
			}
			OpenRouterModelCache.instance = new OpenRouterModelCache(context)
		}
		return OpenRouterModelCache.instance
	}

	/**
	 * Fetch models from OpenRouter API
	 */
	private async fetchModelsFromApi(): Promise<ModelInfo[]> {
		try {
			console.log("Fetching fresh OpenRouter models")
			const response = await axios.get("https://openrouter.ai/api/v1/models", {
				headers: {
					"HTTP-Referer": "https://kodu.ai", // Required by OpenRouter
					"X-Title": "Kodu.ai",
				},
			})

			if (response.status !== 200 || !response.data?.data) {
				throw new Error(`Failed to fetch OpenRouter models: ${response.statusText}`)
			}

			// Transform OpenRouter models to our format
			const models = response.data.data.map((model: any): ModelInfo => {
				// Parse pricing data if available
				const inputPrice = model.pricing?.prompt ? parseFloat(model.pricing.prompt) * 1000000 : 5
				const outputPrice = model.pricing?.completion ? parseFloat(model.pricing.completion) * 1000000 : 15

				const modelInfo: ModelInfo = {
					id: model.id,
					name: model.name || model.id,
					contextWindow: model.context_length || 8192,
					maxTokens: model.top_provider?.max_completion_tokens || 4096,
					supportsImages: model.architecture?.modality?.includes("image") || false,
					inputPrice,
					outputPrice,
					supportsPromptCache: false,
					provider: PROVIDER_IDS.OPENROUTER,
				}

				if (model.id.includes("anthropic")) {
					modelInfo.supportsPromptCache = true
					// Cache write tokens are 25% more expensive than base input tokens
					// Cache read tokens are 90% cheaper than base input tokens
					// Regular input and output tokens are priced at standard rates
					modelInfo.inputPrice = inputPrice
					modelInfo.outputPrice = outputPrice
					modelInfo.cacheWritesPrice = inputPrice * 1.25
					modelInfo.cacheReadsPrice = inputPrice * 0.1
				}
				// Detect all DeepSeek models (not just deepseek-chat)
				if (model.id.includes("deepseek")) {
					modelInfo.supportsPromptCache = true
					// DeepSeek cache pricing: cache writes same as input, reads are 10% of input
					if (model.id === "deepseek/deepseek-chat") {
						modelInfo.inputPrice = 0
						modelInfo.cacheWritesPrice = 0.14
						modelInfo.cacheReadsPrice = 0.014
					} else {
						modelInfo.cacheWritesPrice = inputPrice || 0.14
						modelInfo.cacheReadsPrice = (inputPrice || 0.14) * 0.1
					}
				}

				return modelInfo
			})

			return models
		} catch (error) {
			console.error("Error fetching OpenRouter models:", error)
			return []
		}
	}

	/**
	 * Get models - returns cached models or fetches new ones if cache is stale
	 */
	public async getModels(): Promise<ModelInfo[]> {
		const models = await this.cacheManager.get(() => this.fetchModelsFromApi())
		return models || []
	}

	/**
	 * Invalidate the cache manually
	 */
	public async invalidateCache(): Promise<void> {
		await this.cacheManager.invalidate()
	}

	/**
	 * Check if cache is valid
	 */
	public isCacheValid(): boolean {
		return this.cacheManager.isValid()
	}

	/**
	 * Get cache age in milliseconds
	 */
	public getCacheAge(): number {
		return this.cacheManager.getCacheAge()
	}
}


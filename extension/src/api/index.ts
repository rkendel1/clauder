import type { Anthropic } from "@anthropic-ai/sdk"
import { KoduHandler } from "./providers/kodu"
import { WebSearchResponseDto } from "./interfaces"
import { koduSSEResponse } from "../shared/kodu"
import { ApiHistoryItem } from "../agent/v1/main-agent"
import { CustomApiHandler } from "./providers/custom-provider"
import { PROVIDER_IDS, ProviderId } from "./providers/constants"
import { customProviderSchema, ModelInfo, ProviderConfig } from "./providers/types"
import { z } from "zod"

export interface ApiHandlerMessageResponse {
	message: Anthropic.Messages.Message | Anthropic.Beta.PromptCaching.Messages.PromptCachingBetaMessage
	userCredits?: number
	errorString?: string
	errorCode?: number
}

export type ApiConfiguration = {
	providerId: ProviderId
	modelId: string
	koduApiKey: string
}

export type ApiHandlerOptions = Omit<ProviderConfig, "models"> & {
	model: ProviderConfig["models"][number]
}

export type ApiConstructorOptions = {
	providerSettings: ProviderSettings
	models: ProviderConfig["models"]
	model: ProviderConfig["models"][number]
}

export interface ApiHandler {
	createMessageStream({
		systemPrompt,
		messages,
		abortSignal,
		top_p,
		tempature,
		modelId,
		appendAfterCacheToLastMessage,
		updateAfterCacheInserts,
	}: {
		systemPrompt: string[]
		messages: ApiHistoryItem[]
		abortSignal: AbortSignal | null
		top_p?: number
		tempature?: number
		modelId: string
		appendAfterCacheToLastMessage?: (lastMessage: Anthropic.Messages.Message) => void
		updateAfterCacheInserts?: (
			messages: ApiHistoryItem[],
			systemMessages: Anthropic.Beta.PromptCaching.Messages.PromptCachingBetaTextBlockParam[]
		) => Promise<[ApiHistoryItem[], Anthropic.Beta.PromptCaching.Messages.PromptCachingBetaTextBlockParam[]]>
	}): AsyncIterableIterator<koduSSEResponse>

	get options(): ApiConstructorOptions

	getModel(): { id: string; info: ModelInfo }
}

/**
 * Builds the appropriate API handler based on provider configuration.
 * 
 * This function implements a provider-agnostic routing mechanism:
 * - All providers are treated equally through the ApiHandler interface
 * - Handler selection is based on technical requirements, not provider preference
 * - Kodu uses KoduHandler due to its custom streaming protocol implementation
 * - All other providers use CustomApiHandler which leverages the universal AI SDK
 * 
 * Design rationale:
 * - CustomApiHandler (via Vercel AI SDK) provides consistent behavior for OpenAI-compatible APIs
 * - KoduHandler demonstrates that custom implementations are supported when technically necessary
 * - Any provider can use either handler pattern based on technical needs
 * - The interface contract (ApiHandler) ensures all handlers behave consistently
 * 
 * @param configuration - Provider settings and model configuration
 * @returns An ApiHandler instance (either KoduHandler or CustomApiHandler)
 */
export function buildApiHandler(configuration: ApiConstructorOptions): ApiHandler {
	// Use KoduHandler only for the Kodu provider, all others use CustomApiHandler
	// This maintains backward compatibility while treating Kodu as a regular provider
	if (configuration.providerSettings.providerId === "kodu") {
		return new KoduHandler(configuration)
	}
	return new CustomApiHandler(configuration)
}

export function withoutImageData(
	userContent: Array<
		| Anthropic.TextBlockParam
		| Anthropic.ImageBlockParam
		| Anthropic.ToolUseBlockParam
		| Anthropic.ToolResultBlockParam
	>
): Array<
	Anthropic.TextBlockParam | Anthropic.ImageBlockParam | Anthropic.ToolUseBlockParam | Anthropic.ToolResultBlockParam
> {
	return userContent.map((part) => {
		if (part.type === "image") {
			return { ...part, source: { ...part.source, data: "..." } }
		} else if (part.type === "tool_result" && typeof part.content !== "string") {
			return {
				...part,
				content: part.content?.map((contentPart) => {
					if (contentPart.type === "image") {
						return { ...contentPart, source: { ...contentPart.source, data: "..." } }
					}
					return contentPart
				}),
			}
		}
		return part
	})
}
export const providerSettingsSchema = z
	.object({
		// id: z.string(),
		providerId: z.nativeEnum(PROVIDER_IDS),
		modelId: z.string().optional(),
		apiKey: z.string().optional(),
		// Google Vertex specific fields
		clientEmail: z.string().optional(),
		privateKey: z.string().optional(),
		project: z.string().optional(),
		location: z.string().optional(),
		// Amazon Bedrock specific fields
		region: z.string().optional(),
		accessKeyId: z.string().optional(),
		secretAccessKey: z.string().optional(),
		sessionToken: z.string().optional(),
	})
	.merge(customProviderSchema.partial())

export type ProviderSettings = z.infer<typeof providerSettingsSchema>

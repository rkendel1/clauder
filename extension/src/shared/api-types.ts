import Anthropic from "@anthropic-ai/sdk"

/**
 * Standard error codes for API operations
 */
export enum API_ERROR_CODES {
	/**
	 * Invalid request error: There was an issue with the format or content of your request.
	 */
	INVALID_REQUEST_ERROR = 400,
	/**
	 * Authentication error: There's an issue with your API key.
	 */
	AUTHENTICATION_ERROR = 401,
	/**
	 * Payment required: Please add credits to your account.
	 */
	PAYMENT_REQUIRED = 402,
	/**
	 * Permission error: Your API key does not have permission to use the specified resource.
	 */
	PERMISSION_ERROR = 403,
	/**
	 * Not found error: The requested resource was not found.
	 */
	NOT_FOUND_ERROR = 404,
	/**
	 * Request too large: Request exceeds the maximum allowed number of bytes.
	 */
	REQUEST_TOO_LARGE = 413,
	/**
	 * Rate limit error: Your account has hit a rate limit.
	 */
	RATE_LIMIT_ERROR = 429,
	/**
	 * API error: An unexpected error has occurred.
	 */
	API_ERROR = 500,
	/**
	 * Overloaded error: API is temporarily overloaded.
	 */
	OVERLOADED_ERROR = 529,
	/**
	 * Network refused to connect
	 */
	NETWORK_REFUSED_TO_CONNECT = 1,
}

export const apiErrorMessages: Record<API_ERROR_CODES, string> = {
	400: "There was an issue with the format or content of your request.",
	401: "Unauthorized. Please check your API key.",
	402: "Payment Required. Please add credits to your account.",
	403: "Your API key does not have permission to use the specified resource.",
	404: "The requested resource was not found.",
	413: "Request exceeds the maximum allowed number of bytes.",
	429: "Your account has hit a rate limit.",
	500: "An unexpected error has occurred.",
	529: "The API is temporarily overloaded.",
	1: "Network refused to connect",
}

export class ApiError extends Error {
	public errorCode: API_ERROR_CODES
	constructor({ code }: { code: number }) {
		if (code in API_ERROR_CODES) {
			super(apiErrorMessages[code as API_ERROR_CODES])
		} else {
			super("Unknown error")
		}
		this.name = "ApiError"
		this.errorCode = code
	}
}

/**
 * Streaming response type for API handlers
 */
export type ApiStreamResponse =
	| {
			code: 0
			body: undefined
	  }
	| {
			code: 1
			body: {
				anthropic: Anthropic.Beta.PromptCaching.Messages.PromptCachingBetaMessage
				internal: {
					cost: number
					userCredits?: number
					inputTokens: number
					outputTokens: number
					cacheCreationInputTokens: number
					cacheReadInputTokens: number
				}
			}
	  }
	| {
			code: 4
			body: {
				/**
				 * internal reasoning from the model (should not be saved to api history)
				 */

				reasoningDelta: string
			}
	  }
	| {
			code: 2
			body: {
				/**
				 * Text message received
				 */
				text: string
			}
	  }
	| {
			code: 3
			body: {
				/**
				 * Content block received
				 */
				contentBlock: Anthropic.Messages.ContentBlock
			}
	  }
	| {
			/**
			 * Error response received
			 */
			code: -1
			body: {
				status: number | undefined
				msg: string
			}
	  }

# Provider Implementation Guide

## Architecture Overview

The Clauder extension uses a **universal provider system** that treats all AI providers equally. This architecture ensures:

- **No vendor lock-in**: Any AI provider can be integrated without special treatment
- **Consistent interfaces**: All providers implement the same `ApiHandler` interface
- **Flexible configuration**: Providers are configured through a unified settings system
- **Plugin-based design**: Easy to add new providers without modifying core logic

Providers consist of:
- **Configuration**: Defines models/endpoints (in `config/`)
- **Class Implementation**: Handles API calls (extends `ApiHandler`)
- **Type Definitions**: Interfaces/Schemas (in `types.ts`)
- **Frontend Integration**: Automatic UI registration

## Provider Types

### 1. Standard Providers
Most providers use the `CustomApiHandler` which leverages the AI SDK for consistent behavior across different LLM providers:
- Anthropic
- OpenAI
- DeepSeek
- Mistral
- Google Gen AI
- OpenRouter
- And more...

### 2. Specialized Providers
Some providers require custom implementation (e.g., Kodu) due to unique features like:
- Custom streaming protocols
- Special authentication flows
- Proprietary APIs

**Important**: All providers, including specialized ones, follow the same configuration patterns and interface contracts. The system does not favor any particular provider.

## Creating a New Provider

### 1. Configuration File
Create new config in `config/` directory:
```ts
// config/example-provider.ts
import { ProviderConfig } from "../types"

export const exampleConfig = {
  id: "example" as const,
  name: "Example Provider",
  baseUrl: "https://api.example.com/v1",
  models: [
    {
      id: "example-model",
      name: "Example Model",
      contextWindow: 128000,
      maxTokens: 4096,
      supportsImages: false,
      inputPrice: 0.5,
      outputPrice: 1.5,
      provider: "example"
    }
  ],
  requiredFields: ["apiKey"]
}
```

### 2. Register Configuration
Add to `config/index.ts`:
```ts
import { exampleConfig } from "./example-provider"

export const providerConfigs = {
  ...existingConfigs,
  [PROVIDER_IDS.EXAMPLE]: exampleConfig
}
```

### 3. Implement Provider Class
Extend `CustomApiHandler` in `custom-provider.ts`:
```ts
case PROVIDER_IDS.EXAMPLE:
  if (!settings.apiKey) throw error
  return createExampleSDK({
    apiKey: settings.apiKey
  }).languageModel(modelId)
```

### 4. Update Type Definitions
Add to `types.ts`:
```ts
export interface ExampleSettings extends BaseProviderSettings {
  providerId: "example"
  apiKey: string
  baseUrl?: string
}

// Add to ProviderSettings union
export type ProviderSettings = ... | ExampleSettings
```

## Frontend Integration
Models automatically appear in UI when:
1. Added to providerConfigs
2. ModelInfo.provider matches provider ID
3. Type definitions are properly extended

**No provider receives special treatment in the UI** - all providers are displayed equally based on their configuration.

## Provider Selection and Routing

The system uses a dynamic provider selection mechanism in `buildApiHandler()`:

```typescript
export function buildApiHandler(configuration: ApiConstructorOptions): ApiHandler {
  // Kodu uses KoduHandler due to custom streaming implementation
  if (configuration.providerSettings.providerId === "kodu") {
    return new KoduHandler(configuration)
  }
  // All other providers use the universal CustomApiHandler
  return new CustomApiHandler(configuration)
}
```

This design:
- Keeps the door open for any provider to use custom implementations if needed
- Defaults to the universal `CustomApiHandler` for standard providers
- Maintains a single interface (`ApiHandler`) that all handlers must implement
- Ensures no provider gets preferential treatment in the routing logic

## Validation Requirements
- Implement Zod schema for custom providers
- Handle API key validation
- Throw `CustomProviderError` for provider-specific issues

## Provider Storage and Configuration

All providers are stored in a unified way using VSCode's secret storage:

```typescript
// All providers are stored in the same "providers" array
const providers = [
  { providerId: "anthropic", apiKey: "...", modelId: "..." },
  { providerId: "openai", apiKey: "...", modelId: "..." },
  { providerId: "kodu", apiKey: "...", modelId: "..." },
  // ... etc
]
```

**Key principles:**
- All providers use the same storage mechanism
- No provider has special storage privileges
- Legacy compatibility is maintained through fallback logic
- Provider switching is seamless and consistent

## Universal Provider Interface

All providers must implement the `ApiHandler` interface:

```typescript
export interface ApiHandler {
  createMessageStream(params): AsyncIterableIterator<koduSSEResponse>
  get options(): ApiConstructorOptions
  getModel(): { id: string; info: ModelInfo }
}
```

This ensures:
- Consistent behavior across all providers
- Easy provider switching without code changes
- Predictable error handling and streaming
- No hidden dependencies on specific providers

## Example Workflow (Adding Mistral)
1. Create `config/mistral.ts`
2. Add to providerConfigs
3. Implement Mistral handler in custom-provider.ts 
4. Extend types.ts with MistralSettings
5. Models appear automatically in model picker

## Testing Guidelines
1. Verify provider appears in settings
2. Test API key validation
3. Check model streaming functionality
4. Verify cost calculations
5. Confirm UI displays all model metadata
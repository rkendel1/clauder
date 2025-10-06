# Caching Mechanism

The extension now includes a unified caching mechanism to improve performance and reduce redundant API calls across all providers.

## Overview

The caching system provides:
- **Persistent Storage**: Caches are stored in the file system for persistence across sessions
- **In-Memory Cache**: Fast access to frequently used data
- **Configurable TTL**: Time-to-live settings to control cache freshness
- **Manual Invalidation**: Ability to clear caches when needed
- **Thread-Safe Operations**: Prevents concurrent fetch operations

## Architecture

### Generic Cache Manager

The `CacheManager` class provides a reusable caching solution that can be used by any provider:

```typescript
import { CacheManager } from './config/cache-manager'

const cacheManager = new CacheManager<ModelInfo[]>(context, {
  filename: 'my-cache.json',
  ttl: 60 * 60 * 1000, // 1 hour
  useMemoryCache: true,
})

// Fetch data with automatic caching
const data = await cacheManager.get(async () => {
  return await fetchDataFromAPI()
})
```

### Configuration Options

- **filename**: Name of the cache file (stored in extension's global storage)
- **ttl**: Time-to-live in milliseconds (default: 1 hour)
- **useMemoryCache**: Enable in-memory cache for faster access (default: true)

## Current Implementations

### 1. OpenRouter Model Cache

OpenRouter model lists are cached to reduce API calls:
- **TTL**: 1 hour
- **Location**: `cache/openrouter-models.json`
- **Purpose**: Caches the list of available OpenRouter models

### 2. Prompt Caching Support

Many models now support prompt caching to reduce costs:

#### Supported Models with Prompt Caching:

**OpenAI Models:**
- GPT-4o (cache writes: $3.125/1M tokens, reads: $0.25/1M tokens)
- GPT-4o Mini (cache writes: $0.1875/1M tokens, reads: $0.015/1M tokens)

**Claude Models (Anthropic):**
- Claude 3.5 Sonnet (cache writes: $3.75/1M tokens, reads: $0.30/1M tokens)
- Claude 3.5 Haiku (cache writes: $1.00/1M tokens, reads: $0.08/1M tokens)
- Claude 3 Opus (cache writes: $18.75/1M tokens, reads: $1.50/1M tokens)
- Claude 3 Haiku (cache writes: $0.3125/1M tokens, reads: $0.025/1M tokens)

**Google Gemini Models:**
- Gemini 2.0 Flash Exp (free with caching)
- Gemini 1.5 Pro (cache writes: $1.5625/1M tokens, reads: $0.125/1M tokens)
- Gemini 1.5 Flash (cache writes: $0.09375/1M tokens, reads: $0.0075/1M tokens)

**DeepSeek Models:**
- DeepSeek Chat (cache writes: $0.14/1M tokens, reads: $0.014/1M tokens)

## Cache Management

### Checking Cache Status

```typescript
// Check if cache is valid
const isValid = cacheManager.isValid()

// Get cache age in milliseconds
const age = cacheManager.getCacheAge()
```

### Manual Cache Invalidation

```typescript
// Invalidate cache to force fresh fetch
await cacheManager.invalidate()
```

For OpenRouter specifically:

```typescript
const cache = OpenRouterModelCache.getInstance(context)
await cache.invalidateCache()
```

## Cache Storage Location

All caches are stored in the extension's global storage directory:
- **Path**: `<extension-storage>/cache/`
- **Format**: JSON files with timestamp metadata
- **Persistence**: Survives VS Code restarts

## Cache File Format

```json
{
  "timestamp": 1634567890123,
  "data": {
    // Cached data here
  }
}
```

The timestamp is used to calculate cache age and determine if the cache is stale.

## Benefits

1. **Reduced API Calls**: Minimize network requests and API costs
2. **Improved Performance**: Faster response times with cached data
3. **Cost Savings**: Prompt caching reduces token costs significantly
4. **Better User Experience**: Reduced loading times

## Best Practices

1. **Set Appropriate TTL**: Balance between freshness and performance
2. **Monitor Cache Size**: Regularly clean up old caches if needed
3. **Use Prompt Caching**: Enable for models that support it to reduce costs
4. **Invalidate When Needed**: Clear cache after configuration changes

## Future Enhancements

Planned improvements include:
- Response caching for similar queries
- Configurable cache size limits
- Cache warming for frequently used data
- Cache statistics and monitoring

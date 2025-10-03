# Provider System Migration Guide

## Overview

This guide explains the evolution of the Clauder provider system from its initial architecture to the current universal provider architecture. It covers backward compatibility, migration paths, and best practices.

## Architecture Evolution

### Version 1.x - 2.x (Legacy)
- Kodu had dedicated storage (`koduApiKey`)
- Other providers stored in `providers` array
- Special case handling in multiple locations
- Implied Kodu as "primary" provider

### Version 2.3+ (Current - Universal Architecture)
- All providers treated equally
- Unified storage mechanism
- Provider-agnostic routing
- Backward compatibility maintained

## Backward Compatibility

### For End Users

**No action required.** The system automatically handles legacy configurations:

1. **Existing Kodu users**: Your `koduApiKey` continues to work
2. **Provider switching**: Seamlessly switch between any providers
3. **New providers**: Add additional providers without conflicts

### For Developers

The system maintains backward compatibility through:

```typescript
// Modern approach - unified providers array
const providers = await getProviders()
const koduProvider = providers.find(p => p.providerId === "kodu")

// Legacy fallback - automatic
if (providerId === "kodu" && !koduProvider) {
  const apiKey = await getSecretState("koduApiKey")
  // Use legacy key
}
```

## Migration Paths

### Option 1: Automatic Migration (Recommended)

The system will automatically migrate when:
- User updates Kodu settings
- New provider is added
- Settings are synchronized

**No manual intervention needed.**

### Option 2: Manual Migration

For developers who want explicit control:

```typescript
// 1. Read legacy key
const koduApiKey = await SecretStateManager.getInstance().getSecretState("koduApiKey")

// 2. Get existing providers
const providersData = await SecretStateManager.getInstance().getSecretState("providers")
const providers = JSON.parse(providersData || "[]")

// 3. Add Kodu to providers array if it has a key
if (koduApiKey && !providers.find(p => p.providerId === "kodu")) {
  providers.push({
    providerId: "kodu",
    apiKey: koduApiKey,
    modelId: "claude-3-7-sonnet-20250219" // or user's preferred model
  })
  
  await SecretStateManager.getInstance().updateSecretState(
    "providers",
    JSON.stringify(providers)
  )
}

// 4. Optional: Remove legacy key
// await SecretStateManager.getInstance().deleteSecretState("koduApiKey")
```

## Best Practices

### For Extension Developers

**DO:**
- ✅ Use `getModelProviderData()` to access provider settings
- ✅ Check `providerConfigs` for available providers
- ✅ Implement new providers following the existing patterns
- ✅ Write provider-agnostic code using the `ApiHandler` interface

**DON'T:**
- ❌ Hard-code provider IDs in business logic
- ❌ Make assumptions about Kodu being available
- ❌ Access `koduApiKey` directly (use `getModelProviderData`)
- ❌ Create special cases for specific providers

### For Provider Implementers

When adding a new provider:

1. **Create configuration** in `config/your-provider.ts`
2. **Add to registry** in `config/index.ts`
3. **Choose handler pattern:**
   - Use `CustomApiHandler` if OpenAI-compatible
   - Create custom handler only if technically necessary
4. **Document requirements** in provider config
5. **Test** with the existing provider switching flows

## API Changes

### Deprecated (Still Supported)

```typescript
// Direct access to koduApiKey
const key = await getSecretState("koduApiKey")

// Special case checks
if (providerId === "kodu") { /* special logic */ }

// customProvidersConfigs export
import { customProvidersConfigs } from "./config"
```

### Recommended

```typescript
// Unified provider access
const providerData = await getModelProviderData("kodu")
const apiKey = providerData.currentProvider.apiKey

// Provider-agnostic logic
const handler = buildApiHandler(apiConfiguration)

// Direct access to all providers
import { providerConfigs } from "./config"
```

## Breaking Changes

### None in Current Version

The migration maintains **100% backward compatibility**. Legacy code continues to work while new code benefits from the universal architecture.

### Future Versions

A future major version may:
- Remove `customProvidersConfigs` export
- Deprecate direct `koduApiKey` access
- Require explicit provider configuration

Migration notices will be provided well in advance.

## Testing Your Integration

### For End Users

Test provider switching:
1. Open settings
2. Add a new provider (e.g., Anthropic, OpenAI)
3. Switch between providers
4. Verify all providers work correctly

### For Developers

```typescript
// Test 1: Verify provider enumeration
const providers = await listProviders()
assert(providers.length > 0, "Should have providers")

// Test 2: Verify provider selection
await selectModel({ providerId: "anthropic", modelId: "claude-3-opus-20240229" })
const settings = await getCurrentApiSettings()
assert(settings.providerSettings.providerId === "anthropic")

// Test 3: Verify handler creation
const handler = buildApiHandler(settings)
assert(handler instanceof CustomApiHandler || handler instanceof KoduHandler)

// Test 4: Verify API calls work
const stream = handler.createMessageStream({...})
// Should work regardless of provider
```

## Troubleshooting

### Issue: Provider not found

**Symptom:** Error "Provider not found" when switching providers

**Solution:**
```typescript
// Verify provider exists in config
console.log(Object.keys(providerConfigs))

// Check provider settings
const providerData = await getModelProviderData(providerId)
console.log(providerData.currentProvider)
```

### Issue: Legacy key not working

**Symptom:** Kodu provider fails despite having `koduApiKey`

**Solution:**
The fallback mechanism should handle this automatically. If not:
1. Check that `koduApiKey` is actually stored
2. Verify no conflicting entry in `providers` array
3. Manually migrate using Option 2 above

### Issue: New provider not appearing

**Symptom:** Added provider config but not visible in UI

**Solution:**
1. Ensure provider is registered in `config/index.ts`
2. Verify provider ID is in `PROVIDER_IDS` constants
3. Check provider config follows `ProviderConfig` schema
4. Restart extension host

## Getting Help

- **Documentation**: See `ARCHITECTURE.md` for design details
- **Examples**: Check existing provider implementations in `config/`
- **Issues**: Report problems on GitHub
- **Community**: Join Discord for questions

## Summary

The universal provider architecture:
- ✅ Maintains full backward compatibility
- ✅ Treats all providers equally
- ✅ Simplifies adding new providers
- ✅ Eliminates vendor lock-in
- ✅ Future-proofs the extension

No immediate action required - the system handles migration automatically while preserving all existing functionality.

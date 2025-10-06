/**
 * Test suite for Aider provider integration
 * 
 * These tests validate that the Aider provider is properly configured
 * and can be used with the extension's provider system.
 */

import * as assert from 'assert'
import { providerConfigs } from '../../../src/api/providers/config'
import { PROVIDER_IDS } from '../../../src/api/providers/constants'
import { AiderSettings } from '../../../src/api/providers/types'

suite('Aider Provider Integration', () => {
	test('Aider provider is registered in provider configs', () => {
		assert.ok(providerConfigs[PROVIDER_IDS.AIDER], 'Aider provider should be registered')
	})

	test('Aider provider has correct configuration', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		assert.strictEqual(aiderConfig.id, PROVIDER_IDS.AIDER, 'Provider ID should match')
		assert.strictEqual(aiderConfig.name, 'Aider', 'Provider name should be Aider')
		assert.strictEqual(aiderConfig.baseUrl, 'http://localhost:8080/v1', 'Base URL should be localhost:8080/v1')
	})

	test('Aider provider has required fields configured', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		assert.ok(Array.isArray(aiderConfig.requiredFields), 'Required fields should be an array')
		assert.ok(aiderConfig.requiredFields.includes('apiKey'), 'API key should be required')
		assert.ok(aiderConfig.requiredFields.includes('baseUrl'), 'Base URL should be required')
	})

	test('Aider provider has models configured', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		assert.ok(Array.isArray(aiderConfig.models), 'Models should be an array')
		assert.ok(aiderConfig.models.length > 0, 'Should have at least one model configured')
	})

	test('Aider models have required properties', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		aiderConfig.models.forEach((model) => {
			assert.ok(model.id, 'Model should have an id')
			assert.ok(model.name, 'Model should have a name')
			assert.ok(typeof model.contextWindow === 'number', 'Model should have a context window')
			assert.ok(typeof model.maxTokens === 'number', 'Model should have max tokens')
			assert.ok(typeof model.supportsImages === 'boolean', 'Model should specify image support')
			assert.ok(typeof model.inputPrice === 'number', 'Model should have input price')
			assert.ok(typeof model.outputPrice === 'number', 'Model should have output price')
			assert.strictEqual(model.provider, PROVIDER_IDS.AIDER, 'Model provider should be Aider')
		})
	})

	test('Aider has GPT-4 model configured', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		const gpt4Model = aiderConfig.models.find(m => m.id === 'gpt-4')
		
		assert.ok(gpt4Model, 'GPT-4 model should be available')
		assert.strictEqual(gpt4Model.name, 'Aider GPT-4', 'Model name should be Aider GPT-4')
	})

	test('Aider has Claude model configured', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		const claudeModels = aiderConfig.models.filter(m => m.id.includes('claude'))
		
		assert.ok(claudeModels.length >= 4, 'Should have at least 4 Claude models (3.5 Sonnet, 3.5 Haiku, 3 Opus, 3 Haiku)')
		
		// Check for specific Claude models
		const sonnet = claudeModels.find(m => m.id.includes('3-5-sonnet'))
		const haiku = claudeModels.find(m => m.id.includes('3-5-haiku'))
		const opus = claudeModels.find(m => m.id.includes('3-opus'))
		
		assert.ok(sonnet, 'Should have Claude 3.5 Sonnet')
		assert.ok(haiku, 'Should have Claude 3.5 Haiku')
		assert.ok(opus, 'Should have Claude 3 Opus')
	})

	test('Aider recommended model is properly marked', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		const recommendedModels = aiderConfig.models.filter(m => m.isRecommended)
		
		assert.ok(recommendedModels.length > 0, 'Should have at least one recommended model')
	})

	test('Aider settings type has correct structure', () => {
		// This is a compile-time test to ensure the type is correctly defined
		const settings: AiderSettings = {
			providerId: 'aider',
			apiKey: 'test-key',
			baseUrl: 'http://localhost:8080/v1'
		}
		
		assert.strictEqual(settings.providerId, 'aider', 'Provider ID should be aider')
		assert.ok(settings.apiKey, 'Should have apiKey property')
		assert.ok(settings.baseUrl, 'Should have baseUrl property')
	})

	test('Aider models support various capabilities', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		// Check for models with different capabilities
		const imageModels = aiderConfig.models.filter(m => m.supportsImages)
		assert.ok(imageModels.length > 0, 'Should have models that support images')
		
		// Check for models with prompt caching support
		const cacheModels = aiderConfig.models.filter(m => m.supportsPromptCache)
		assert.ok(cacheModels.length > 0, 'Should have models that support prompt caching')
		
		// Verify cache pricing is set for models that support caching
		cacheModels.forEach(model => {
			if (model.supportsPromptCache) {
				assert.ok(
					model.cacheWritesPrice !== undefined || model.inputPrice === 0,
					`Model ${model.id} should have cache writes pricing`
				)
				assert.ok(
					model.cacheReadsPrice !== undefined || model.inputPrice === 0,
					`Model ${model.id} should have cache reads pricing`
				)
			}
		})
		
		// All Aider models should have pricing info
		aiderConfig.models.forEach(model => {
			assert.ok(model.inputPrice >= 0, 'Input price should be non-negative')
			assert.ok(model.outputPrice >= 0, 'Output price should be non-negative')
		})
	})
})

suite('Aider Provider Constants', () => {
	test('Aider provider ID is defined', () => {
		assert.ok(PROVIDER_IDS.AIDER, 'AIDER provider ID should be defined')
		assert.strictEqual(PROVIDER_IDS.AIDER, 'aider', 'AIDER provider ID should be "aider"')
	})

	test('Aider provider is in the provider list', () => {
		const providerIds = Object.values(PROVIDER_IDS)
		assert.ok(providerIds.includes('aider' as any), 'AIDER should be in provider IDs list')
	})

	test('Aider has expanded model selection', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		// Should have at least 20 models
		assert.ok(aiderConfig.models.length >= 20, `Should have at least 20 models, has ${aiderConfig.models.length}`)
	})

	test('Aider has OpenAI models', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		const gpt4o = aiderConfig.models.find(m => m.id === 'gpt-4o')
		const gpt4oMini = aiderConfig.models.find(m => m.id === 'gpt-4o-mini')
		const o1Preview = aiderConfig.models.find(m => m.id === 'o1-preview')
		const o1Mini = aiderConfig.models.find(m => m.id === 'o1-mini')
		
		assert.ok(gpt4o, 'Should have GPT-4o')
		assert.ok(gpt4oMini, 'Should have GPT-4o Mini')
		assert.ok(o1Preview, 'Should have O1 Preview')
		assert.ok(o1Mini, 'Should have O1 Mini')
		
		// Check thinking models are marked correctly
		assert.ok(o1Preview?.isThinkingModel, 'O1 Preview should be marked as thinking model')
		assert.ok(o1Mini?.isThinkingModel, 'O1 Mini should be marked as thinking model')
	})

	test('Aider has Gemini models', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		const geminiModels = aiderConfig.models.filter(m => m.id.includes('gemini'))
		assert.ok(geminiModels.length >= 3, 'Should have at least 3 Gemini models')
		
		const gemini2Flash = geminiModels.find(m => m.id.includes('2.0-flash'))
		const gemini15Pro = geminiModels.find(m => m.id.includes('1.5-pro'))
		
		assert.ok(gemini2Flash, 'Should have Gemini 2.0 Flash')
		assert.ok(gemini15Pro, 'Should have Gemini 1.5 Pro')
	})

	test('Aider has DeepSeek models', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		const deepseekChat = aiderConfig.models.find(m => m.id === 'deepseek-chat')
		const deepseekCoder = aiderConfig.models.find(m => m.id === 'deepseek-coder')
		
		assert.ok(deepseekChat, 'Should have DeepSeek Chat')
		assert.ok(deepseekCoder, 'Should have DeepSeek Coder')
		
		// DeepSeek Chat should support caching
		assert.ok(deepseekChat?.supportsPromptCache, 'DeepSeek Chat should support prompt caching')
	})

	test('Aider has Mistral models', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		const mistralModels = aiderConfig.models.filter(m => m.id.includes('mistral'))
		assert.ok(mistralModels.length >= 2, 'Should have at least 2 Mistral models')
	})

	test('Aider has Llama models', () => {
		const aiderConfig = providerConfigs[PROVIDER_IDS.AIDER]
		
		const llamaModels = aiderConfig.models.filter(m => m.id.includes('llama'))
		assert.ok(llamaModels.length >= 2, 'Should have at least 2 Llama models')
	})
})

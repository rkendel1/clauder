/**
 * Test suite for the generic Cache Manager
 * 
 * These tests validate that the cache manager works correctly
 * for storing and retrieving data with TTL support.
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import { CacheManager } from '../../../src/api/providers/config/cache-manager'

// Mock extension context for testing
class MockExtensionContext implements vscode.ExtensionContext {
	subscriptions: { dispose(): any }[] = []
	workspaceState!: vscode.Memento
	globalState!: vscode.Memento & { setKeysForSync(keys: readonly string[]): void }
	secrets!: vscode.SecretStorage
	extensionUri!: vscode.Uri
	extensionPath!: string
	environmentVariableCollection!: vscode.GlobalEnvironmentVariableCollection
	asAbsolutePath(relativePath: string): string {
		return relativePath
	}
	storageUri!: vscode.Uri
	storagePath!: string
	globalStorageUri: vscode.Uri = vscode.Uri.file('/tmp/test-cache')
	globalStoragePath!: string
	logUri!: vscode.Uri
	logPath!: string
	extensionMode!: vscode.ExtensionMode
	extension!: vscode.Extension<any>
	languageModelAccessInformation!: vscode.LanguageModelAccessInformation
}

suite('Cache Manager', () => {
	let context: vscode.ExtensionContext
	let cacheManager: CacheManager<any>

	setup(() => {
		context = new MockExtensionContext()
	})

	test('Cache manager can be created', () => {
		cacheManager = new CacheManager(context, {
			filename: 'test-cache.json',
			ttl: 1000,
		})
		
		assert.ok(cacheManager, 'Cache manager should be created')
	})

	test('Cache manager uses default TTL', () => {
		cacheManager = new CacheManager(context, {
			filename: 'test-cache.json',
		})
		
		assert.ok(cacheManager, 'Cache manager should be created with default TTL')
	})

	test('Cache manager can fetch and cache data', async () => {
		cacheManager = new CacheManager<string>(context, {
			filename: 'test-fetch-cache.json',
			ttl: 5000,
		})
		
		let fetchCount = 0
		const fetchFn = async () => {
			fetchCount++
			return 'test-data'
		}
		
		const data1 = await cacheManager.get(fetchFn)
		assert.strictEqual(data1, 'test-data', 'Should return fetched data')
		assert.strictEqual(fetchCount, 1, 'Should call fetch function once')
		
		// Second call should use cache
		const data2 = await cacheManager.get(fetchFn)
		assert.strictEqual(data2, 'test-data', 'Should return cached data')
		assert.strictEqual(fetchCount, 1, 'Should not call fetch function again')
	})

	test('Cache manager can invalidate cache', async () => {
		cacheManager = new CacheManager<string>(context, {
			filename: 'test-invalidate-cache.json',
			ttl: 5000,
		})
		
		let fetchCount = 0
		const fetchFn = async () => {
			fetchCount++
			return `test-data-${fetchCount}`
		}
		
		const data1 = await cacheManager.get(fetchFn)
		assert.strictEqual(data1, 'test-data-1', 'Should return first fetched data')
		
		await cacheManager.invalidate()
		
		const data2 = await cacheManager.get(fetchFn)
		assert.strictEqual(data2, 'test-data-2', 'Should fetch new data after invalidation')
		assert.strictEqual(fetchCount, 2, 'Should call fetch function twice after invalidation')
	})

	test('Cache manager reports cache validity', async () => {
		cacheManager = new CacheManager<string>(context, {
			filename: 'test-validity-cache.json',
			ttl: 100, // Very short TTL
		})
		
		assert.strictEqual(cacheManager.isValid(), false, 'Cache should be invalid initially')
		
		await cacheManager.get(async () => 'test-data')
		
		assert.strictEqual(cacheManager.isValid(), true, 'Cache should be valid after fetch')
		
		// Wait for cache to expire
		await new Promise(resolve => setTimeout(resolve, 150))
		
		assert.strictEqual(cacheManager.isValid(), false, 'Cache should be invalid after TTL expires')
	})

	test('Cache manager tracks cache age', async () => {
		cacheManager = new CacheManager<string>(context, {
			filename: 'test-age-cache.json',
			ttl: 5000,
		})
		
		const infiniteAge = cacheManager.getCacheAge()
		assert.strictEqual(infiniteAge, Infinity, 'Cache age should be Infinity when no data cached')
		
		await cacheManager.get(async () => 'test-data')
		
		const age = cacheManager.getCacheAge()
		assert.ok(age >= 0 && age < 1000, 'Cache age should be between 0 and 1000ms after fetch')
	})

	test('Cache manager handles array data', async () => {
		cacheManager = new CacheManager<number[]>(context, {
			filename: 'test-array-cache.json',
			ttl: 5000,
		})
		
		const data = await cacheManager.get(async () => [1, 2, 3, 4, 5])
		
		assert.ok(Array.isArray(data), 'Should return array')
		assert.strictEqual(data?.length, 5, 'Array should have 5 elements')
		assert.deepStrictEqual(data, [1, 2, 3, 4, 5], 'Array should match expected values')
	})

	test('Cache manager handles object data', async () => {
		interface TestData {
			name: string
			value: number
		}
		
		cacheManager = new CacheManager<TestData>(context, {
			filename: 'test-object-cache.json',
			ttl: 5000,
		})
		
		const data = await cacheManager.get(async () => ({ name: 'test', value: 42 }))
		
		assert.ok(data, 'Should return object')
		assert.strictEqual(data?.name, 'test', 'Object name should match')
		assert.strictEqual(data?.value, 42, 'Object value should match')
	})

	test('Cache manager can disable memory cache', async () => {
		cacheManager = new CacheManager<string>(context, {
			filename: 'test-no-memory-cache.json',
			ttl: 5000,
			useMemoryCache: false,
		})
		
		const data = await cacheManager.get(async () => 'test-data')
		assert.strictEqual(data, 'test-data', 'Should return data even without memory cache')
	})
})

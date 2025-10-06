/**
 * Generic Cache Manager for Provider Models
 * 
 * This module provides a unified caching mechanism that can be used across all providers
 * to cache model lists, responses, and other data to improve performance and reduce
 * redundant API calls.
 * 
 * Features:
 * - Configurable cache TTL (Time To Live)
 * - Persistent storage using file system
 * - In-memory cache for fast access
 * - Thread-safe operations with fetch locking
 * - Manual cache invalidation
 */

import * as vscode from "vscode"
import * as fs from "fs/promises"
import * as path from "path"

// Default cache lifetime (1 hour in milliseconds)
const DEFAULT_CACHE_LIFETIME = 60 * 60 * 1000

export interface CacheOptions {
	/**
	 * Cache filename (without path)
	 */
	filename: string
	
	/**
	 * Cache TTL in milliseconds (default: 1 hour)
	 */
	ttl?: number
	
	/**
	 * Whether to use in-memory cache in addition to file cache
	 */
	useMemoryCache?: boolean
}

/**
 * Generic Cache Manager class
 */
export class CacheManager<T> {
	private context: vscode.ExtensionContext
	private options: Required<CacheOptions>
	private memoryCache: T | null = null
	private lastFetched: number = 0
	private isFetching: boolean = false

	constructor(context: vscode.ExtensionContext, options: CacheOptions) {
		this.context = context
		this.options = {
			filename: options.filename,
			ttl: options.ttl || DEFAULT_CACHE_LIFETIME,
			useMemoryCache: options.useMemoryCache !== false,
		}
	}

	/**
	 * Check if cache is stale
	 */
	private isCacheStale(): boolean {
		return Date.now() - this.lastFetched > this.options.ttl
	}

	/**
	 * Get cache file path
	 */
	private async getCacheFilePath(): Promise<string> {
		const cacheDir = await this.ensureCacheDirectoryExists()
		return path.join(cacheDir, this.options.filename)
	}

	/**
	 * Ensures the cache directory exists
	 */
	private async ensureCacheDirectoryExists(): Promise<string> {
		const cacheDir = path.join(this.context.globalStorageUri.fsPath, "cache")
		try {
			await fs.mkdir(cacheDir, { recursive: true })
		} catch (error) {
			console.error("Error creating cache directory:", error)
		}
		return cacheDir
	}

	/**
	 * Load data from cache file
	 */
	private async loadFromCache(): Promise<T | null> {
		try {
			const cacheFilePath = await this.getCacheFilePath()
			const data = await fs.readFile(cacheFilePath, "utf-8")
			const parsed = JSON.parse(data)
			
			// Check if cache has metadata with timestamp
			if (parsed.timestamp && parsed.data) {
				const cacheAge = Date.now() - parsed.timestamp
				if (cacheAge < this.options.ttl) {
					this.lastFetched = parsed.timestamp
					return parsed.data as T
				}
			} else {
				// Legacy cache format without timestamp
				return parsed as T
			}
		} catch (error) {
			console.log(`No cache file found or error reading cache (${this.options.filename})`)
		}
		return null
	}

	/**
	 * Save data to cache file
	 */
	private async saveToCache(data: T): Promise<void> {
		try {
			const cacheFilePath = await this.getCacheFilePath()
			const cacheData = {
				timestamp: Date.now(),
				data,
			}
			await fs.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2))
			console.log(`Data saved to cache (${this.options.filename})`)
		} catch (error) {
			console.error(`Error saving data to cache (${this.options.filename}):`, error)
		}
	}

	/**
	 * Get data from cache or fetch using provided function
	 * 
	 * @param fetchFn Function to fetch fresh data if cache is stale or empty
	 * @returns Cached or fresh data
	 */
	public async get(fetchFn: () => Promise<T>): Promise<T | null> {
		// If we have in-memory cache and it's not stale, return it
		if (this.options.useMemoryCache && this.memoryCache !== null && !this.isCacheStale()) {
			return this.memoryCache
		}

		// If we're already fetching, wait a bit and try again
		if (this.isFetching) {
			await new Promise((resolve) => setTimeout(resolve, 500))
			return this.get(fetchFn)
		}

		try {
			this.isFetching = true

			// Try to load from file cache first
			if (this.memoryCache === null || this.isCacheStale()) {
				const cached = await this.loadFromCache()
				
				// If we got data from the cache and it's not stale, use it
				if (cached !== null) {
					if (this.options.useMemoryCache) {
						this.memoryCache = cached
					}
					return cached
				}
			}

			// If cache is stale or empty, fetch new data
			const freshData = await fetchFn()

			if (freshData !== null && freshData !== undefined) {
				if (this.options.useMemoryCache) {
					this.memoryCache = freshData
				}
				this.lastFetched = Date.now()
				await this.saveToCache(freshData)
			}

			return freshData
		} finally {
			this.isFetching = false
		}
	}

	/**
	 * Manually invalidate the cache
	 */
	public async invalidate(): Promise<void> {
		this.memoryCache = null
		this.lastFetched = 0
		
		try {
			const cacheFilePath = await this.getCacheFilePath()
			await fs.unlink(cacheFilePath)
			console.log(`Cache invalidated (${this.options.filename})`)
		} catch (error) {
			// Ignore errors if file doesn't exist
			console.log(`Cache file not found during invalidation (${this.options.filename})`)
		}
	}

	/**
	 * Get cache age in milliseconds
	 */
	public getCacheAge(): number {
		if (this.lastFetched === 0) {
			return Infinity
		}
		return Date.now() - this.lastFetched
	}

	/**
	 * Check if cache exists and is valid
	 */
	public isValid(): boolean {
		return this.lastFetched > 0 && !this.isCacheStale()
	}
}

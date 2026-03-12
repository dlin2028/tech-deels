/**
 * Simple in-memory cache with TTL.
 * Acts as a drop-in layer that can be replaced with Redis (Upstash) by swapping
 * the storage backend while keeping the same get/set/invalidate API.
 *
 * In production with high traffic, replace the `store` Map with an Upstash Redis
 * client: https://docs.upstash.com/redis/sdks/javascriptsdk/overview
 */

interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 60_000; // 1 minute

export const cache = {
	get<T>(key: string): T | null {
		const entry = store.get(key) as CacheEntry<T> | undefined;
		if (!entry) return null;
		if (Date.now() > entry.expiresAt) {
			store.delete(key);
			return null;
		}
		return entry.value;
	},

	set<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS): void {
		store.set(key, { value, expiresAt: Date.now() + ttlMs });
	},

	invalidate(pattern: string | RegExp): void {
		for (const key of store.keys()) {
			const match =
				typeof pattern === 'string' ? key.startsWith(pattern) : pattern.test(key);
			if (match) store.delete(key);
		}
	},

	/** Wrap an async function with caching */
	async wrap<T>(key: string, fn: () => Promise<T>, ttlMs = DEFAULT_TTL_MS): Promise<T> {
		const cached = this.get<T>(key);
		if (cached !== null) return cached;
		const value = await fn();
		this.set(key, value, ttlMs);
		return value;
	}
};

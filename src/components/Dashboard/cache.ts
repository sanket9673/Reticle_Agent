type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export interface CacheLog {
  timestamp: string;
  type: "hit" | "miss" | "set" | "expire" | "info";
  message: string;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<any>>();
  private ttl: number; // in milliseconds
  
  // Statistics
  private totalRequests = 0;
  private cacheHits = 0;
  private logs: CacheLog[] = [];
  private onUpdateCallbacks: Set<() => void> = new Set();

  constructor(ttlSeconds: number = 30) {
    this.ttl = ttlSeconds * 1000;
  }

  private addLog(type: CacheLog["type"], message: string) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logs.unshift({ timestamp: timeStr, type, message });
    if (this.logs.length > 50) {
      this.logs.pop();
    }
    this.notifyUpdate();
  }

  subscribe(callback: () => void) {
    this.onUpdateCallbacks.add(callback);
    return () => {
      this.onUpdateCallbacks.delete(callback);
    };
  }

  private notifyUpdate() {
    this.onUpdateCallbacks.forEach(cb => cb());
  }

  get<T>(key: string): T | null {
    this.totalRequests++;
    const entry = this.cache.get(key);

    if (!entry) {
      this.addLog("miss", `GET "${key}" -> CACHE MISS (Fetching from server)`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      this.addLog("expire", `GET "${key}" -> CACHE EXPIRED (Evicted key from store)`);
      return null;
    }

    this.cacheHits++;
    const savings = ((this.cacheHits / this.totalRequests) * 100).toFixed(1);
    this.addLog("hit", `GET "${key}" -> CACHE HIT! Returned in 0ms (Saved round-trip. Total reduction: ${savings}%)`);
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.addLog("set", `SET "${key}" -> Stored entry in memory cache`);
  }

  getStats() {
    const total = this.totalRequests;
    const hits = this.cacheHits;
    const rate = total > 0 ? (hits / total) * 100 : 0;
    return {
      totalRequests: total,
      cacheHits: hits,
      reductionRate: Math.round(rate),
      latencySavedMs: hits * 500, // Estimate 500ms saved per cache hit
    };
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.cache.clear();
    this.totalRequests = 0;
    this.cacheHits = 0;
    this.logs = [];
    this.addLog("info", "Cache cleared. Statistics reset.");
    this.notifyUpdate();
  }
}

export const responseCache = new ResponseCache(60); // 60 seconds Cache TTL

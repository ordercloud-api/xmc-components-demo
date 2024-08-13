import { Cache, CacheClass } from 'memory-cache';


export interface CacheClient<T> {

  setCacheValue(key: string, value: T): T;

  getCacheValue(key: string): T | null;
}


const DEFAULTS = Object.freeze({
  cacheTimeout: 60,
  cacheEnabled: true,
});


export interface CacheOptions {

  cacheEnabled?: boolean;

  cacheTimeout?: number;
}


export class MemoryCacheClient<T> implements CacheClient<T> {
  private cache: CacheClass<string, T>;


  constructor(public options: CacheOptions) {
    this.cache = new Cache();

    this.options.cacheTimeout = (this.options.cacheTimeout ?? DEFAULTS.cacheTimeout) * 1000;

    if (this.options.cacheEnabled === undefined) {
      this.options.cacheEnabled = DEFAULTS.cacheEnabled;
    }
  }

  getCacheValue(key: string): T | null {
    return this.options.cacheEnabled ? this.cache.get(key) : null;
  }

  setCacheValue(key: string, value: T): T {
    return this.options.cacheEnabled
      ? this.cache.put(key, value, this.options.cacheTimeout)
      : value;
  }
}
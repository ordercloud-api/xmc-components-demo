import { SiteSettings } from 'src/types/sitesettings/SiteSettings'
import { CacheClient, CacheOptions, MemoryCacheClient } from './cache-client'

export interface SiteSettingsService {
  fetchSiteSettingsData(language: string): Promise<SiteSettings>
}

export abstract class SiteSettingsServiceBase
  implements SiteSettingsService, CacheClient<SiteSettings>
{
  private cache: CacheClient<SiteSettings>

  constructor(public options: CacheOptions) {
    this.cache = this.getCacheClient()
  }

  setCacheValue(key: string, value: SiteSettings): SiteSettings {
    return this.cache.setCacheValue(key, value)
  }

  getCacheValue(key: string): SiteSettings | null {
    return this.cache.getCacheValue(key)
  }

  protected getCacheClient(): CacheClient<SiteSettings> {
    return new MemoryCacheClient<SiteSettings>(this.options)
  }

  abstract fetchSiteSettingsData(language: string): Promise<SiteSettings>
}

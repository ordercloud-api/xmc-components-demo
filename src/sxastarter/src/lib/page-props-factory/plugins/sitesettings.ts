import { SitecorePageProps } from 'lib/page-props'
import { Plugin } from '..'
import {  SiteSettingsService } from '../../sitesettings-service'
import { siteSettingsServiceFactory } from '../../sitesettings-service-factory'

class SiteSettingsPlugin implements Plugin {
  private siteSettingsServices: Map<string, SiteSettingsService>

  order = 4

  constructor() {
    this.siteSettingsServices = new Map<string, SiteSettingsService>()
  }

  async exec(
    props: SitecorePageProps
  ): Promise<SitecorePageProps> {

    const siteSettingsService = this.getSiteSettingsService(props.site.name)
    props.siteSettings = await siteSettingsService.fetchSiteSettingsData(props.locale)

    return props
  }

  private getSiteSettingsService(siteName: string): SiteSettingsService {
    if (this.siteSettingsServices.has(siteName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.siteSettingsServices.get(siteName)!
    }

    const siteSettingsService = siteSettingsServiceFactory.create(siteName)
    this.siteSettingsServices.set(siteName, siteSettingsService)

    return siteSettingsService
  }
}

export const sitesettingsPlugin = new SiteSettingsPlugin()

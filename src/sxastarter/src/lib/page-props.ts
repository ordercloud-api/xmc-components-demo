import {
  DictionaryPhrases,
  ComponentPropsCollection,
  LayoutServiceData,
  SiteInfo,
  HTMLLink,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { SiteSettings } from 'src/types/sitesettings/SiteSettings'

/**
 * Sitecore page props
 */
export type SitecorePageProps = {
  site: SiteInfo
  locale: string
  dictionary: DictionaryPhrases
  componentProps: ComponentPropsCollection
  notFound: boolean
  layoutData: LayoutServiceData
  headLinks: HTMLLink[]
  siteSettings: SiteSettings
}

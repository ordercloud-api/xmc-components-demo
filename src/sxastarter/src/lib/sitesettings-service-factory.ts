import {  SiteSettingsService } from './sitesettings-service'
import {  GraphQLSiteSettingsService } from './graphql-sitesettings-service'
import config from 'temp/config';
  

  export class SiteSettingsServiceFactory {

    create(siteName: string): SiteSettingsService {
      return new GraphQLSiteSettingsService({
            endpoint: config.graphQLEndpoint,
            apiKey: config.sitecoreApiKey,
            siteName
          })
    }
  }
  
  export const siteSettingsServiceFactory = new SiteSettingsServiceFactory();
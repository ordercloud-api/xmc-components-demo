/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLClient, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss'
import { SiteSettingsServiceBase } from './sitesettings-service'
import { CacheOptions } from './cache-client'

import { SiteSettingsSearchQueryResult } from '../types/sitesettings/site-settings-search-query-result'
import { AppRootQueryResult } from '../types/approot/app-root-query-result'
import { SiteSettings } from 'src/types/sitesettings/SiteSettings'

/** @private */
export const queryError =
  'Valid value for rootItemId not provided and failed to auto-resolve app root item.'

export interface GraphQLSiteSettingsServiceConfig extends CacheOptions {
  siteName: string
  endpoint?: string
  apiKey?: string
}

export class GraphQLSiteSettingsService extends SiteSettingsServiceBase {
  private graphQLClient: GraphQLClient

  constructor(public options: GraphQLSiteSettingsServiceConfig) {
    super(options)
    this.graphQLClient = this.getGraphQLClient()
  }

  async fetchSiteSettingsData(language: string): Promise<SiteSettings> {
    const cacheKey = this.options.siteName + language
    const cachedValue = this.getCacheValue(cacheKey)

    if (cachedValue) {
      return cachedValue
    }

    const appRootQuery = await this.graphQLClient.request<AppRootQueryResult>(
      `query AppRootQuery($headlessSiteTemplateIds: [String]!, $siteName: String!, $language: String!) {
        layout(site: $siteName, routePath: "/", language: $language) {
          homePage: item {
            rootItem: ancestors(includeTemplateIDs: $headlessSiteTemplateIds) {
              id
            }
          }
        }
      }`,
      {
        siteName: this.options.siteName,
        language: language,
        headlessSiteTemplateIds: [
          '{A2B9FDC3-F641-4966-94A5-B63944DC39DE}',
          '{6E027BE3-0058-49BC-A911-DD73D3EBEAB9}',
        ], //_Base Site Root template ID
      }
    )

    const rootItemId = appRootQuery.layout?.homePage?.rootItem[0]?.id ?? null

    if (!rootItemId) {
      throw new Error(queryError)
    }

    const siteSettingsItemsQuery = await this.graphQLClient.request<SiteSettingsSearchQueryResult>(
      `query SiteSettingsSearchQuery(
        $rootItemId: String!
        $language: String!
        $siteSettingsTemplate: String!
      ) {
        search(
          where: {
            AND: [
              { name: "_path", value: $rootItemId, operator: CONTAINS }
              { name: "_language", value: $language, operator: EQ }
              { name: "_templates", value: $siteSettingsTemplate, operator: CONTAINS }
            ]
          }
          first: 1
        ) {
          total
          pageInfo {
            endCursor
            hasNext
          }
          results {
              orderCloudAPIID: field(name: "OrderCloudAPIID") {
                  value
              }
              orderCloudAPIUrl: field(name: "OrderCloudAPIUrl") {
                  value
              }
              orderCloudScope: field(name: "OrderCloudScope") {
                  value
              }
              xMCWebsiteTheme: field(name: "XMCWebsiteTheme") {
                  value
              }
              allowAnonymous: field(name: "AllowAnonymous") {
                  value
              }
              showInventory: field(name: "ShowInventory") {
                  value
              }
          }
        }
      }
      `,
      {
        rootItemId: rootItemId,
        language: language,
        siteSettingsTemplate: '{F59F3791-E717-4846-9820-B77BAE9CE391}', //SiteSettings template ID
      }
    )

    const siteSettings = siteSettingsItemsQuery.search?.results[0] as SiteSettings

    this.setCacheValue(cacheKey, siteSettings)
    return siteSettings
  }

  protected getGraphQLClient(): GraphQLClient {
    return new GraphQLRequestClient(this.options.endpoint, {
      apiKey: this.options.apiKey,
    })
  }
}

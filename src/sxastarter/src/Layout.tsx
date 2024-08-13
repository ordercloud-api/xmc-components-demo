/* eslint-disable react-hooks/exhaustive-deps */
/**
 * This Layout is needed for Starter Kit.
 */
import { ColorModeScript, Container, SimpleGrid, VStack } from '@chakra-ui/react'
import { Field, HTMLLink, LayoutServiceData, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs'
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils'
import { appConfig } from 'components/appConfig/config'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ApiRole } from 'ordercloud-javascript-sdk'
import { useEffect } from 'react'
import Scripts from 'src/Scripts'
import { OcConfig } from 'src/redux/ocConfig'
import Cookies from 'universal-cookie'
import { Chakra } from '../src/components/Chakra'
import OcProvider from '../src/redux/ocProvider'
import generictheme from './styles/generictheme'
import { SiteSettings } from './types/sitesettings/SiteSettings'

// Prefix public assets with a public URL to enable compatibility with Sitecore Experience Editor.
// If you're not supporting the Experience Editor, you can remove this   .
const publicUrl = getPublicUrl()

interface LayoutProps {
  layoutData: LayoutServiceData
  headLinks: HTMLLink[]
  siteSettings: SiteSettings
}

interface RouteFields {
  [key: string]: unknown
  Title?: Field
}

const Layout = ({ layoutData, siteSettings }: LayoutProps): JSX.Element => {
  const ocConfig: OcConfig = {
    clientId:
      siteSettings?.orderCloudAPIID?.value ??
      'CA37B312-F5BC-46CE-A82E-056D4344FCD5' /* This is the client ID of your seeded OrderCloud organization  ORDER CLOUD MARKETPLACE */,
    baseApiUrl:
      siteSettings?.orderCloudAPIUrl?.value ??
      'https://sandboxapi.ordercloud.io' /* API Url, leave as is for Sandbox */,
    isPreviewing:
      Boolean(process.env.EXPERIENCE_EDITOR_MODE) ||
      true /* Whether or not this is being rendered in xm experience editor*/,
    scope:
      (siteSettings?.orderCloudScope?.value.split(',') as ApiRole[]) ??
      ([
        'FullAccess',
        'Shopper',
        'MeAddressAdmin',
        'OrderAdmin',
        'OverrideShipping',
        'SpendingAccountAdmin',
      ] as ApiRole[]) /* Default user role */,
    allowAnonymous:
      siteSettings?.allowAnonymous?.value === 'true' ??
      true /* Whether anonymous product browsing is allowed */,
  }
  const xmcWebSiteTheme =
    siteSettings?.xMCWebsiteTheme?.value ?? 'generictheme' /* Default theme for the website */
  const { route } = layoutData.sitecore
  const fields = route?.fields as RouteFields
  const isPageEditing = layoutData.sitecore.context.pageEditing
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode'
  const { query } = useRouter()
  //Query used to allow a developer to add a querystring to add padding to the chakra components while in pages

  useEffect(() => {
    // Update cookies
    const cookies = new Cookies()
    cookies.set('showinventory', siteSettings?.showInventory?.value ?? true, {
      path: '/',
    })
  }, [])

  return (
    <>
      <Scripts />
      <OcProvider config={ocConfig}>
        <ColorModeScript initialColorMode={generictheme.config.initialColorMode} />
        <Chakra currentTheme={xmcWebSiteTheme}>
          <Head>
            <title>
              {appConfig.MarketplaceOwnerID
                ? 'CircuitCore'
                : fields?.Title?.value?.toString() || 'Derp'}
            </title>
            <link
              rel="icon"
              href={
                appConfig.MarketplaceOwnerID
                  ? `${publicUrl}/cc_favicon.ico`
                  : `${publicUrl}/favicon.ico`
              }
            />
            {query.addstyles ? (
              <link
                rel="stylesheet"
                href={`${publicUrl}/editingcss.css`}
              />
            ) : (
              ''
            )}
          </Head>

          {/* root placeholder for the app, which we add components to using route data */}
          <VStack
            gap={0}
            minH={'100vh'}
            className={mainClassPageEditing}
          >
            <Container
              as="header"
              id="header"
              maxW="full"
              position="sticky"
              top="0"
              shadow="sm"
              zIndex={3}
            >
              {route && (
                <Placeholder
                  name="headless-header"
                  rendering={route}
                />
              )}
            </Container>
            <VStack
              id="content"
              layerStyle="section.main"
              flexGrow="1"
              px="3"
              maxW="container.2xl"
              as="main"
            >
              {route && (
                <Placeholder
                  name="headless-main"
                  rendering={route}
                />
              )}
            </VStack>
            <SimpleGrid
              as="footer"
              bgColor="chakra-subtle-bg"
              width="full"
              id="footer"
            >
              {route && (
                <Placeholder
                  name="headless-footer"
                  rendering={route}
                />
              )}
            </SimpleGrid>
          </VStack>
        </Chakra>
      </OcProvider>
    </>
  )
}

export default Layout

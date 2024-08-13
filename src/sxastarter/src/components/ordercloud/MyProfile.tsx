import React, { useEffect } from 'react'
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { VStack, HStack, Container, Heading, Show } from '@chakra-ui/react'
import UserTabs from './users/UserTabs'
import UserProfile from './users/UserProfile'
import { useRouter } from 'next/router'
import { useOcSelector } from 'src/redux/ocStore'

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext()
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  const phKey = `my-profile-${props.params.DynamicPlaceholderId}`
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))
  const router = useRouter()

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    }
  }

  useEffect(() => {
    if (isAnonymous) {
      // anonymous users shouldn't be allowed to access profile page
      router.push('/')
    }
  }, [isAnonymous, router])

  return (
    <Container
      className={`component container ${styles}`}
      style={backgroundStyle}
      as={HStack}
      maxW="container.2xl"
      w="full"
      alignItems="flex-start"
    >
      <HStack
        alignItems="flex-start"
        w="full"
      >
        <Show above="lg">
          <UserTabs />
        </Show>
        <VStack
          alignItems="flex-start"
          w="100%"
          width="full"
        >
          <HStack
            justifyContent={{ base: 'space-between', lg: 'flex-start' }}
            alignItems={{ base: 'center', lg: 'center' }}
            borderBottomWidth="1px"
            borderColor="chakra-border-color"
            w="full"
            mb={3}
            pb={3}
          >
            <Heading
              as="h1"
              w="full"
              variant="section"
            >
              My Profile
            </Heading>
            <Show below="lg">
              <UserTabs />
            </Show>
          </HStack>
          <UserProfile />
        </VStack>
      </HStack>
      <Placeholder
        name={phKey}
        rendering={props.rendering}
      />
    </Container>
  )
}

import { Container, HStack, Heading, Show, VStack } from '@chakra-ui/react'
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import CostCentersList from './users/CostCentersList'
import UserTabs from './users/UserTabs'

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
  const phKey = `my-credit-cards-${props.params.DynamicPlaceholderId}`
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    }
  }

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
              Cost Centers
            </Heading>
            <Show below="lg">
              <UserTabs />
            </Show>
          </HStack>
          <CostCentersList />
        </VStack>
        <Placeholder
          name={phKey}
          rendering={props.rendering}
        />
      </HStack>
    </Container>
  )
}

import {
  Button,
  ButtonGroup,
  Container,
  HStack,
  Heading,
  Show,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { BuyerAddress, Me } from 'ordercloud-javascript-sdk'
import { useCallback, useEffect, useState } from 'react'
import OcAddressFormNotMapped from './checkout/OcAddressFormNotMapped'
import UserTabs from './users/UserTabs'
const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const [userAddress, setUserAddress] = useState([] as BuyerAddress)
  const { query } = useRouter()
  const { sitecoreContext } = useSitecoreContext()
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  const phKey = `my-addresses-${props.params.DynamicPlaceholderId}`
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    }
  }

  const initialize = useCallback(async () => {
    const userAddress: BuyerAddress = await Me.GetAddress(query.addressid as string)
    setUserAddress(userAddress)
  }, [query.addressid])

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSaveAddress = (address: Partial<BuyerAddress>) => {
    console.log('Save Address' + address)
  }
  return (
    <Container
      className={`component container ${styles}`}
      as={HStack}
      maxW="container.2xl"
      w="full"
      alignItems="flex-start"
    >
      <Show above="lg">
        <UserTabs />
      </Show>
      <VStack
        alignItems="flex-start"
        w="100%"
        width="full"
        style={backgroundStyle}
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
            w="full"
            as="h1"
            variant="section"
          >
            Address Details:{' '}
            <Text
              as="span"
              color="primary"
            >
              {userAddress.AddressName}
            </Text>
          </Heading>
          <NextLink
            href={`my-profile/my-addresses/address-details`}
            passHref
          >
            <Button size="sm">Add address</Button>
          </NextLink>
          <Show below="lg">
            <UserTabs />
          </Show>
        </HStack>
        <ButtonGroup mt="3">
          <Button
            size="sm"
            variant="solid"
            type="submit"
          >
            Save Address
          </Button>
          <NextLink
            href="/my-profile/my-addresses"
            passHref
          >
            <Button
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
          </NextLink>
        </ButtonGroup>
        <OcAddressFormNotMapped
          id="billing"
          address={userAddress}
          onSubmit={handleSaveAddress}
        />
      </VStack>
      <Placeholder
        name={phKey}
        rendering={props.rendering}
      />
    </Container>
  )
}

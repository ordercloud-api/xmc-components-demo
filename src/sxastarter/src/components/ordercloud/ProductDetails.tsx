/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, HStack, VStack } from '@chakra-ui/react'
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs'

import { useRouter } from 'next/router'
import OcProductDetail from './products/OcProductDetails'

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (_props: ComponentProps): JSX.Element => {
  const { isReady, query, push } = useRouter()

  const handleLineItemUpdated = () => {
    push('/cart')
  }

  return (
    <VStack
      alignItems="flex-start"
      className={`component container`}
    >
      {/* <Heading as="h3">Have it all in</Heading> //TODO: was this supposed to be deleted? */}

      <HStack
        as="section"
        w="100%"
        width="full"
        className="component-content"
      >
        <Container maxW="full">
          {isReady ? (
            <OcProductDetail
              onLineItemUpdated={handleLineItemUpdated}
              productId={query.productid as string}
              lineItemId={query.lineitem as string}
            />
          ) : (
            <h3>Loading</h3>
          )}
        </Container>
      </HStack>
    </VStack>
  )
}

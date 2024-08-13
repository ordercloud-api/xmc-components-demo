import Head from 'next/head'
import Image from 'next/image'
/**
 * Rendered in case if we have 404 error
 */
import { Button, ChakraProvider, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import svg from '../public/404.svg'

const NotFound = (): JSX.Element => (
  <ChakraProvider>
    <Head>
      <title>404: Not Found</title>
    </Head>
    <SimpleGrid
      h="100dvh"
      w="100dvw"
      placeItems="center center"
      style={{ padding: 10 }}
    >
      <VStack
        gap={3}
        mt={-12}
      >
        <Image
          alt="404 Image"
          color="transparent"
          style={{ minWidth: '20vw' }}
          src={svg}
        />
        <Heading
          as="h1"
          size="4xl"
        >
          Page not found
        </Heading>
        <NextLink href="/">
          <Button
            size="lg"
            mt={6}
            colorScheme="green"
            borderRadius="100px"
          >
            Go to the Home page
          </Button>
        </NextLink>
      </VStack>
    </SimpleGrid>
  </ChakraProvider>
)

export default NotFound

import {
  Button,
  ButtonGroup,
  CardBody,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'

import Card from 'components/card/Card'
import NextLink from 'next/link'
import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent, useCallback } from 'react'
import { MdPhoto } from 'react-icons/md'
import formatPrice from 'src/utils/formatPrice'
import FavoritesListButton from '../products/FavoritesButton'
import { useRouter } from 'next/router'

// import formatPrice from "../../../utils/formatPrice"

interface ProductCardProps {
  product: BuyerProduct
}

const ProductCard: FunctionComponent<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const handleClick = useCallback(() => {
    router.push(`product-details?productid=${product.ID}`)
  }, [product?.ID, router])
  return (
    <Card
      layerStyle="interactive.raise"
      onClick={handleClick}
    >
      <CardBody
        alignItems="flex-start"
        as={VStack}
        p={0}
      >
        {product.xp?.Images[0]?.ThumbnailUrl ? (
          <Image
            width="100%"
            maxH="300px"
            objectFit="cover"
            bgColor="chakra-subtle-bg"
            alignItems="bottom"
            color="neutral"
            fontSize=".5em"
            justifyContent="center"
            display="flex"
            aspectRatio="1 / 1"
            src={product.xp?.Images[0]?.ThumbnailUrl}
            alt={product.Name}
            aria-label={product.Name}
          />
        ) : (
          <Flex
            alignItems="center"
            justifyContent="center"
            w="100%"
            aspectRatio="1 / 1"
            maxH="300px"
            bgColor="chakra-subtle-bg"
          >
            <Icon
              fontSize="5em"
              opacity=".25"
              color="chakra-placeholder-color"
              as={MdPhoto}
              sx={{ '& path:first-of-type': { display: 'none' } }}
            />
          </Flex>
        )}
        <VStack
          flex="1"
          alignItems="flex-start"
          p="6"
        >
          <Heading
            as="h3"
            size="md"
          >
            {product.Name}
          </Heading>
          <Text
            mt="-1"
            fontSize="xs"
            color="chakra-subtle-text"
          >
            {product.ID}
          </Text>
          <Text
            fontSize="sm"
            color="chakra-subtle-text"
            style={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
              overflow: 'hidden',
            }}
          >
            {product.Description}
          </Text>
          <Stack
            direction={{ base: 'row', lg: 'row' }}
            w="full"
            mt="auto"
            pt="4"
            justifyContent="space-between"
            alignItems="center"
          >
            <ButtonGroup>
              <NextLink
                href={`product-details?productid=${product.ID}`}
                passHref
              >
                <Button
                  size="sm"
                  _hover={{ textDecoration: 'none' }}
                  as={Link}
                >
                  View details
                </Button>
              </NextLink>
              <FavoritesListButton />
            </ButtonGroup>
            <VStack
              alignItems="flex-end"
              gap={0}
            >
              {product?.PriceSchedule?.PriceBreaks[0]?.SalePrice && (
                <Text
                  fontSize="sm"
                  color="chakra-subtle-text"
                  as="s"
                >
                  Reg. {formatPrice(product?.PriceSchedule?.PriceBreaks[0]?.Price)}
                </Text>
              )}
              <Text
                mt={-1}
                fontWeight="700"
                fontSize="lg"
                color="green.500"
              >
                <>
                  {product?.PriceSchedule?.PriceBreaks[0].Price === undefined ? (
                    <Text
                      fontWeight="500"
                      fontStyle="italic"
                      fontSize="xs"
                    >
                      Inquire For Price
                    </Text>
                  ) : (
                    <>
                      {product?.PriceSchedule?.PriceBreaks[0]?.SalePrice
                        ? formatPrice(product?.PriceSchedule?.PriceBreaks[0].SalePrice)
                        : formatPrice(product?.PriceSchedule?.PriceBreaks[0].Price)}
                    </>
                  )}
                </>
              </Text>
            </VStack>
          </Stack>
        </VStack>
      </CardBody>
    </Card>
  )
}
export default ProductCard

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FormEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { createLineItem, updateLineItem } from '../../../redux/ocCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../../redux/ocStore'

import NextLink from 'next/link'
import FavoritesListButton from './FavoritesButton'
//import { Parser } from 'html-to-react';
import { Spec } from 'ordercloud-javascript-sdk'
import formatPrice from 'src/utils/formatPrice'
import Cookies from 'universal-cookie'
import useOcProductDetail from '../../../hooks/useOcProductDetail'
import ProductPriceBreaks from './ProductPriceBreaks'
import ProductSpecField from './ProductSpecField'
import QuantityInput from './QuantityInput'

// import FEAASProductDetails from "../products/ProductDetails_feaas"

interface ProductDetailProps {
  productId: string
  lineItemId?: string
  onLineItemAdded?: () => void
  onLineItemUpdated?: () => void
}

const determineDefaultOptionId = (spec: Spec) => {
  if (spec.DefaultOptionID) return spec.DefaultOptionID
  return spec.OptionCount ? spec.Options[0].ID : undefined
}

const OcProductDetail: FunctionComponent<ProductDetailProps> = ({
  productId,
  lineItemId,
  onLineItemAdded,
  onLineItemUpdated,
}) => {
  const dispatch = useOcDispatch()
  const { product, specs } = useOcProductDetail(productId)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [specValues, setSpecValues] = useState([])
  const lineItem = useOcSelector((s: any) =>
    lineItemId && s.ocCurrentOrder.lineItems
      ? s.ocCurrentOrder.lineItems.find((li: any) => li.ID === lineItemId)
      : undefined
  )

  useEffect(() => {
    if (lineItem) {
      setSpecValues(lineItem.Specs)
    } else if (specs) {
      setSpecValues(
        specs.map((s) => {
          return {
            SpecID: s.ID,
            OptionID: determineDefaultOptionId(s),
            Value: s.DefaultValue ? s.DefaultValue : undefined,
          }
        })
      )
    }
  }, [specs, lineItem])

  const [quantity, setQuantity] = useState(
    lineItem ? lineItem.Quantity : (product && product.PriceSchedule?.MinQuantity) || 1
  )

  const formattedPrice = useMemo(() => {
    if (product?.PriceSchedule?.PriceBreaks?.length) {
      return (
        <VStack
          alignItems="flex-start"
          gap={0}
          my={3}
        >
          <Text
            fontSize="4xl"
            fontWeight="600"
          >
            {product.PriceSchedule.IsOnSale ? (
              <>
                <Text
                  display="inline-block"
                  color="red"
                  fontWeight="300"
                  mr="2"
                >
                  {`-${(
                    product.PriceSchedule.PriceBreaks[0].Price *
                    ((100 - product.PriceSchedule.PriceBreaks[0].SalePrice) / 100)
                  ).toFixed()}%`}
                </Text>
                <Text display="inline-block">
                  {formatPrice(product.PriceSchedule.PriceBreaks[0].SalePrice)}
                </Text>

                <Text
                  fontSize="xs"
                  color="chakra-placeholder-color"
                >
                  MSRP:{' '}
                  <Text as="s">{formatPrice(product.PriceSchedule.PriceBreaks[0].Price)}</Text>
                </Text>
              </>
            ) : (
              <Text>{formatPrice(product.PriceSchedule.PriceBreaks[0].Price)}</Text>
            )}
          </Text>
        </VStack>
      )
    }
    return (
      <Text
        fontWeight="500"
        fontStyle="italic"
        fontSize="xs"
      >
        Inquire For Price
      </Text>
    )
  }, [product])

  const handleAddToCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)
      let xpValues = null

      xpValues = {
        Type: product.xp.Type,
      }

      console.log('xp:' + xpValues)

      await dispatch(
        createLineItem({
          ProductID: product.ID,
          Quantity: quantity,
          Specs: specValues,
          xp: xpValues,
        })
      )
      setLoading(false)
      if (onLineItemAdded) {
        onLineItemAdded()
      }
    },
    [dispatch, product, quantity, onLineItemAdded, specValues]
  )

  const handleSpecFieldChange = (values: { SpecID: string; OptionID?: string; Value?: string }) => {
    setSpecValues((sv) =>
      sv.map((s) => {
        if (s.SpecID === values.SpecID) {
          return {
            SpecID: values.SpecID,
            OptionID: values.OptionID === 'OpenText' ? undefined : values.OptionID,
            Value: values.Value,
          }
        }
        return s
      })
    )
  }

  const handleUpdateCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)
      await dispatch(updateLineItem({ ...lineItem, Quantity: quantity, Specs: specValues }))
      setLoading(false)
      if (onLineItemUpdated) {
        onLineItemUpdated()
      }
    },
    [dispatch, lineItem, quantity, onLineItemUpdated, specValues]
  )

  const cookies = new Cookies()
  let showinventory = false
  if (cookies.get('showinventory') !== null) {
    showinventory = cookies.get('showinventory')
  }
  return product ? (
    <>
      <SimpleGrid
        gridTemplateColumns={{ md: '1fr 1fr' }}
        gap={6}
      >
        <Image
          shadow="sm"
          src={product.xp?.Images[0]?.ThumbnailUrl}
          aria-label={product.Name}
        ></Image>
        <VStack
          alignItems="flex-start"
          maxW="3xl"
        >
          <Heading
            as="h1"
            fontWeight="500"
            size="xl"
          >
            {product.Name}
          </Heading>

          {formattedPrice}

          {(product.xp?.Calories || product.xp?.Serving) && (
            <HStack>
              <Box
                borderRight="1px"
                borderColor="gray.200"
                mr={2}
                pr={2}
              >
                <Text>{product.xp?.Calories}</Text>
              </Box>
              <Text>{product.xp?.Serving}</Text>
            </HStack>
          )}
          <VStack
            as="form"
            alignItems="flex-start"
            onSubmit={lineItem ? handleUpdateCart : handleAddToCart}
          >
            <VStack
              alignItems="flex-start"
              gap={6}
            >
              {specs &&
                specs.map((s) => {
                  const specValue = specValues.find((sv) => sv.SpecID === s.ID)
                  return (
                    <ProductSpecField
                      key={s.ID}
                      spec={s}
                      onChange={handleSpecFieldChange}
                      optionId={specValue && specValue.OptionID}
                      value={specValue && specValue.Value}
                    />
                  )
                })}
              <HStack
                alignItems="center"
                gap={3}
              >
                <QuantityInput
                  controlId="addToCart"
                  priceSchedule={product.PriceSchedule}
                  quantity={quantity}
                  onChange={setQuantity}
                />
                {showinventory && product?.Inventory?.Enabled && (
                  <Text
                    pt={6}
                    color="green"
                    fontSize="sm"
                    fontWeight="500"
                  >
                    {product?.Inventory?.QuantityAvailable} In Stock
                  </Text>
                )}
              </HStack>
            </VStack>
            <ButtonGroup
              alignItems="center"
              mt={6}
            >
              <Button
                cursor="pointer"
                colorScheme="green"
                minW="250"
                size="lg"
                fontSize="lg"
                type="submit"
                disabled={loading}
                onClick={() => setIsModalOpen(true)}
              >
                {`${lineItem ? 'Update' : 'Add to Cart'} `}
              </Button>
              <FavoritesListButton />
              {product.xp?.FreeShipping && <Badge colorScheme="yellow">FREE SHIPPING!</Badge>}
            </ButtonGroup>
          </VStack>
          <HStack
            alignItems="flex-start"
            borderTop="1px solid"
            borderColor="chakra-border-color"
            mt={6}
            w="full"
          >
            {product.PriceSchedule?.PriceBreaks.length > 1 && (
              <VStack
                alignItems="flex-start"
                borderRight={product.Description && '1px solid'}
                borderColor="chakra-border-color"
                p="3"
              >
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="chakra-subtle-text"
                  mb={3}
                >
                  Buy More And Save!
                </Text>
                <ProductPriceBreaks priceSchedule={product.PriceSchedule} />
              </VStack>
            )}
            {product.Description && (
              <VStack
                alignItems="flex-start"
                p="3"
              >
                <>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="chakra-subtle-text"
                    mb={3}
                  >
                    Product Description
                  </Text>
                  <Text
                    color="chakra-subtle-text"
                    dangerouslySetInnerHTML={{ __html: product.Description }}
                  />
                </>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="chakra-subtle-text"
                  my={3}
                >
                  Product ID
                </Text>
                <Text color="chakra-subtle-text">{product.ID}</Text>
              </VStack>
            )}
          </HStack>
        </VStack>
      </SimpleGrid>
      <Container
        maxW="full"
        display="flex"
        my={3}
        gap={6}
      ></Container>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={12}>
            <Heading size="xl">Item Added To Cart</Heading>
            <HStack
              pt="6"
              alignSelf="center"
            >
              <Image
                shadow="sm"
                boxSize="65px"
                src={product.xp?.Images[0]?.ThumbnailUrl}
              />
              <Text>{product.Name}</Text>
            </HStack>
          </ModalBody>
          <ModalFooter
            gap={3}
            pt={0}
          >
            <NextLink
              href={`/`}
              passHref
            >
              <Button
                as={Link}
                size="sm"
                variant="link"
                color="neutral"
              >
                <Text>Continue shopping</Text>
              </Button>
            </NextLink>
            <NextLink
              href={`/shopping-cart`}
              passHref
            >
              <Button
                as={Link}
                size="sm"
                variant="outline"
                color="green"
              >
                Go to cart
              </Button>
            </NextLink>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  ) : null
}

export default OcProductDetail

import {
  Button,
  ButtonGroup,
  HStack,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { FormEvent, FunctionComponent, useCallback, useState } from 'react'
import { removeLineItem, updateLineItem } from '../../../redux/ocCurrentOrder'

import NextLink from 'next/link'
import { LineItem } from 'ordercloud-javascript-sdk'
import formatPrice from 'src/utils/formatPrice'
import useOcProduct from '../../../hooks/useOcProduct'
import { useOcDispatch } from '../../../redux/ocStore'
import OcQuantityInput from './OcQuantityInput'
import React from 'react'

interface OcLineItemCardProps {
  lineItem: LineItem
  editable?: boolean
}

const OcLineItemCard: FunctionComponent<OcLineItemCardProps> = ({ lineItem, editable }) => {
  const dispatch = useOcDispatch()
  const [disabled, setDisabled] = useState(false)
  const [quantity, setQuantity] = useState(lineItem.Quantity)
  const product = useOcProduct(lineItem.ProductID)
  const [isDeliveryInstructionsModalOpen, setIsDeliveryInstructionsModalOpen] = useState(false)

  const handleRemoveLineItem = useCallback(async () => {
    setDisabled(true)
    await dispatch(removeLineItem(lineItem.ID))
    setDisabled(false)
  }, [dispatch, lineItem])

  const handleUpdateLineItem = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setDisabled(true)
      await dispatch(updateLineItem({ ...lineItem, Quantity: quantity }))
      setDisabled(false)
    },
    [dispatch, quantity, lineItem]
  )

  // const isUpdateDisabled = useMemo(() => {
  //   return disabled || lineItem.Quantity === quantity
  // }, [lineItem, disabled, quantity])

  return (
    <>
      <HStack
        id="lineItemRow"
        flexWrap="wrap"
        mb={6}
        pb={6}
        p={{ base: 3, md: 'unset' }}
        gap={9}
        w="full"
      >
        <Image
          boxSize="100px"
          objectFit="cover"
          aspectRatio="1 / 1"
          shadow="sm"
          borderRadius="sm"
          src={lineItem?.Product?.xp?.Images[0].ThumbnailUrl}
        />
        <VStack
          alignItems="flex-start"
          gap={3}
        >
          <NextLink
            href={`product-details?productid=${lineItem?.Product?.ID}`}
            passHref
          >
            <Link
              fontSize="xl"
              display="inline-block"
              maxW="md"
            >
              {lineItem.Product.Name}
            </Link>
          </NextLink>
          <Text
            mt={-3}
            fontSize="xs"
            color="chakra-subtle-text"
          >
            <Text
              fontWeight="600"
              display="inline"
            >
              Item number:{' '}
            </Text>
            {lineItem.Product.ID}
          </Text>
          {lineItem?.Specs.map((spec) => (
            <React.Fragment key={spec.SpecID}>
              <Text
                mt={-3}
                fontSize="xs"
                color="chakra-subtle-text"
              >
                <Text
                  fontWeight="600"
                  display="inline"
                >
                  {spec.Name}:
                </Text>{' '}
                {spec.Value}
              </Text>
            </React.Fragment>
          ))}
          <ButtonGroup
            spacing="3"
            alignItems="center"
          >
            {/* TODO: determine if we are adding delivery instructions via line item or via order comments */}
            {/* <Button
              type="button"
              variant="link"
              size="xs"
              fontSize=".7em"
              colorScheme="neutral"
              onClick={() => setIsDeliveryInstructionsModalOpen(true)}
            >
              Add Delivery Instructions
            </Button>
            <Text
              fontWeight="200"
              pb="3px"
              color="chakra-border-color"
            >
              |
            </Text> */}
            {editable && (
              <Button
                type="button"
                variant="link"
                size="xs"
                fontSize=".7em"
                colorScheme="danger"
                onClick={handleRemoveLineItem}
              >
                Remove
              </Button>
            )}
          </ButtonGroup>
        </VStack>
        {editable ? (
          <>
            {/* <HStack justifyContent="flex-end">
             <Link href={`/products/${lineItem.ProductID}?lineitem=${lineItem.ID}`}>
            <a aria-label="Edit Line Item">Edit</a>
          </Link>
          </HStack> */}
            {product && (
              <VStack
                alignItems="flex-start"
                ml="auto"
                as="form"
                onSubmit={handleUpdateLineItem}
              >
                <OcQuantityInput
                  controlId={`${lineItem.ID}_quantity`}
                  quantity={quantity}
                  disabled={disabled}
                  onChange={setQuantity}
                  priceSchedule={product.PriceSchedule}
                />
                <Button
                  type="submit"
                  aria-label="Update Line Item Quantity"
                  variant="link"
                  size="xs"
                  fontSize=".7em"
                  colorScheme="neutral"
                  disabled={disabled}
                >
                  Update quantity
                </Button>
              </VStack>
            )}
          </>
        ) : (
          <Text ml="auto">Qty: {lineItem.Quantity}</Text>
        )}
        <VStack
          minW="85px"
          alignItems="flex-end"
        >
          <Text
            fontWeight="600"
            fontSize="lg"
          >
            {formatPrice(lineItem.LineSubtotal)}
          </Text>
          <Text
            fontSize=".7em"
            color="chakra-subtle-text"
          >
            ({formatPrice(lineItem.UnitPrice)} each)
          </Text>
        </VStack>
      </HStack>

      <Modal
        isOpen={isDeliveryInstructionsModalOpen}
        onClose={() => setIsDeliveryInstructionsModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="full"
          w="100%"
          maxWidth="800px"
        >
          <ModalHeader>
            <Heading>Add Delivery Instructions</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Textarea
                placeholder="Delivery instructions"
                height="175px"
              />
              <HStack
                w="100%"
                width="full"
                justifyItems="space-between"
                justifyContent="space-between"
                mb={6}
              >
                <Button
                  type="button"
                  aria-describedby="ae-checkout-tip"
                  border="1px"
                  borderColor="gray.300"
                  variant="primaryButton"
                  height="50px"
                  onClick={() => setIsDeliveryInstructionsModalOpen(false)}
                >
                  <Text fontSize="18px">Add Delivery Instructions</Text>
                </Button>

                <Button
                  type="button"
                  aria-describedby="ae-checkout-tip"
                  border="1px"
                  borderColor="gray.300"
                  variant="secondaryButton"
                  height="50px"
                  onClick={() => setIsDeliveryInstructionsModalOpen(false)}
                >
                  <Text fontSize="18px">Cancel</Text>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OcLineItemCard

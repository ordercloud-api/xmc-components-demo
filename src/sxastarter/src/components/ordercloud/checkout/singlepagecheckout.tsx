/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { Address, BuyerCreditCard, Me } from 'ordercloud-javascript-sdk'
import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FunctionComponent, useEffect, useState } from 'react'
import {
  addPayment,
  patchOrder,
  removeAllPayments,
  saveBillingAddress,
  saveShippingAddress,
  submitOrder,
} from '../../../redux/ocCurrentOrder'

import AddressCard from '../cards/AddressCard'
import React from 'react'
import { formatCreditCardDate } from '../../../utils/formatDate'
import formatPrice from '../../../utils/formatPrice'
import useOcCurrentOrder from '../../../hooks/useOcCurrentOrder'
import { useOcDispatch } from '../../../redux/ocStore'
import { useRouter } from 'next/router'

type ShippingSpeed = 'overnight' | '2day' | 'ground'

const OcCheckout: FunctionComponent<{ onSubmitted: any }> = ({}) => {
  const toast = useToast()
  const router = useRouter()
  const dispatch = useOcDispatch()

  const { order, payments } = useOcCurrentOrder()
  const [addresses, setAddresses] = useState([] as Address[])
  const [selectedAddress, setSelectedAddress] = useState({} as Address)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [creditCards, setCreditCards] = useState([] as BuyerCreditCard[])
  const [shippingSpeed, setShippingSpeed] = useState('' as ShippingSpeed)
  const [selectedCreditCard, setSelectedCreditCard] = useState({} as BuyerCreditCard)
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false)
  const [submittedOrderId, setSubmittedOrderId] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    const handleOrderSubmit = async () => {
      try {
        setSubmittedOrderId(null)
        setSubmitLoading(true)
        const orderSubmitResponse = await dispatch(submitOrder(order)).unwrap()
        toast({
          title: 'Thank you!',
          description: 'Your order has been submitted',
          status: 'success',
          duration: 8000,
          isClosable: true,
          position: 'top',
        })
        setSubmitLoading(false)
        router.push(`/my-profile/my-orders/order-details?orderid=${orderSubmitResponse.order.ID}`)
      } catch (e) {
        setSubmittedOrderId(null)
        setSubmitLoading(false)
        toast({
          title: 'An unknown error occurred',
          description: 'Oops, an unknown error occurred. Please contact support for assistance',
          status: 'error',
          duration: 800,
          isClosable: true,
          position: 'top',
        })
      }
    }

    if (submittedOrderId) {
      handleOrderSubmit()
    }
  }, [submittedOrderId])

  useEffect(() => {
    const initialize = async () => {
      if (!order?.ID) {
        return
      }
      // address stuff
      const addressList = await Me.ListAddresses({ sortBy: ['DateCreated'] })
      setAddresses(addressList.Items)
      const address =
        addressList.Items.find((a) => a.ID === order.ShippingAddressID) ?? addressList.Items[0]
      setSelectedAddress(address)

      // credit card stuff
      const creditcardList = await Me.ListCreditCards({ sortBy: ['DateCreated'] })
      setCreditCards(creditcardList.Items)
      const creditCard = !payments.length
        ? creditcardList.Items[0]
        : creditcardList.Items.find((c) => c.ID === payments[0].CreditCardID)
      setSelectedCreditCard(creditCard)
    }
    initialize()
  }, [order?.ID])

  useEffect(() => {
    const saveAddressToOrder = async () => {
      setIsAddressModalOpen(false)
      await dispatch(saveShippingAddress(selectedAddress))
      await dispatch(saveBillingAddress(selectedAddress))
    }
    if (selectedAddress?.ID && order?.ID) {
      saveAddressToOrder()
    }
  }, [selectedAddress?.ID])

  useEffect(() => {
    const saveCreditCardToOrder = async () => {
      setIsCreditCardModalOpen(false)
      if (!payments?.length) {
        dispatch(
          addPayment({
            Type: 'CreditCard',
            CreditCardID: selectedCreditCard.ID,
            // bit of a hack here for demo, ideally this would get set to true in middleware and we wouldn't grant buyer users OrderAdmin role
            Accepted: true,
          })
        )
      } else if (
        payments[0].Amount !== order.Total ||
        payments[0].CreditCardID !== selectedCreditCard.ID
      ) {
        await dispatch(removeAllPayments())
        await dispatch(
          addPayment({
            Type: 'CreditCard',
            CreditCardID: selectedCreditCard.ID,
            // bit of a hack here for demo, ideally this would get set to true in middleware and we wouldn't grant buyer users OrderAdmin role
            Accepted: true,
          })
        )
      }
    }
    if (selectedCreditCard?.ID && order?.ID) {
      saveCreditCardToOrder()
    }
  }, [selectedCreditCard?.ID])

  useEffect(() => {
    const saveShippingSpeedToOrder = async () => {
      // This is a bit of a hack put in for demo purposes
      // ideally would use shippingestimates integration event
      // and not grant user OverrideShipping role
      dispatch(
        patchOrder({
          ShippingCost: shippingSpeed === 'ground' ? 7.99 : shippingSpeed === '2day' ? 9.99 : 12.99,
        })
      )
    }

    if (shippingSpeed) {
      saveShippingSpeedToOrder()
    }
  }, [shippingSpeed])

  if (!order) {
    return <div></div>
  }

  return (
    <>
      <VStack
        w="100%"
        width="full"
        justifyContent="space-between"
      >
        <HStack
          w="100%"
          width="full"
        >
          <VStack
            w="100%"
            width="full"
          >
            <HStack
              w="100%"
              width="full"
              alignItems="flex-start"
            >
              <Text fontWeight="bold">1</Text>
              <HStack w="40%">
                <Text fontWeight="bold">Shipping address</Text>
              </HStack>
              <VStack
                w="80%"
                justifyContent="flex-start"
                textAlign="left"
              >
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  {selectedAddress.FirstName} {selectedAddress.LastName}
                </Text>
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  {selectedAddress.Street1}
                </Text>
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  {selectedAddress.City}, {selectedAddress.State} {selectedAddress.Zip}
                </Text>
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  textDecoration="underline"
                  fontSize="12"
                >
                  Add delivery instructions
                </Text>
              </VStack>
              <Link onClick={() => setIsAddressModalOpen(true)}>
                <Text
                  textDecoration="underline"
                  fontSize="12"
                >
                  Change
                </Text>
              </Link>
            </HStack>
            <Divider borderColor="gray.300"></Divider>
            <HStack
              w="100%"
              width="full"
              alignItems="flex-start"
            >
              <Text fontWeight="bold">2</Text>
              <Text
                w="40%"
                fontWeight="bold"
              >
                Payment method
              </Text>
              <VStack
                w="80%"
                justifyContent="flex-start"
                textAlign="left"
              >
                <HStack
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  <Box
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="lg"
                    bgColor="gray.200"
                    p="2px"
                  >
                    {selectedCreditCard.CardType}
                  </Box>{' '}
                  <Text>ending in {selectedCreditCard.PartialAccountNumber}</Text>
                </HStack>
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  Billing address: {selectedAddress.FirstName} {selectedAddress.LastName},{' '}
                  {selectedAddress.Street1}...
                </Text>
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Add a gift card or promotion code or voucher
                </Text>
                <Box
                  w="100%"
                  width="full"
                  textAlign="left"
                >
                  <Input
                    w="100%"
                    width="full"
                    maxW="200"
                    size="sm"
                    mr="10px"
                    placeholder="Enter code"
                  ></Input>
                  <Button
                    bgColor="white"
                    border="1px"
                    borderColor="gray.200"
                    size="sm"
                    borderRadius="lg"
                  >
                    Apply
                  </Button>
                </Box>
              </VStack>
              <Link>
                <Text
                  textDecoration="underline"
                  fontSize="12"
                  onClick={() => setIsCreditCardModalOpen(true)}
                >
                  Change
                </Text>
              </Link>
            </HStack>
            <Divider borderColor="gray.300"></Divider>
            <HStack
              w="100%"
              width="full"
              alignItems="flex-start"
            >
              <Text fontWeight="bold">3</Text>
              <Text
                w="40%"
                fontWeight="bold"
              >
                Review items and shipping
              </Text>
              <VStack
                w="80%"
                justifyContent="flex-start"
                textAlign="left"
              >
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  Delivery Options
                </Text>
                <Text
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  Shipping estimates are based on delivery speed after items have been shipped by
                  the carrier. Items requiring customization could take longer to ship.
                </Text>
                <Box
                  w="100%"
                  width="full"
                  textAlign="left"
                >
                  <Select
                    value={shippingSpeed}
                    placeholder="How fast should this ship?"
                    fontSize="12px"
                    onChange={(e) => setShippingSpeed(e.currentTarget.value as ShippingSpeed)}
                  >
                    <option value="overnight">Standard overnight ($12.99) - est 1 day</option>
                    <option value="2day">2 Day ($9.99) - est 4 days</option>
                    <option value="ground">Ground ($7.99) - est 2 days</option>
                  </Select>
                </Box>
              </VStack>
            </HStack>
            <HStack
              w="100%"
              width="full"
              border="1px"
              borderColor="gray.300"
              borderRadius="lg"
              p="5"
              ml="15px"
            >
              <Button
                bgColor="brand.500"
                color="white"
                borderRadius="lg"
                size="lg"
                fontSize="16"
                fontWeight="normal"
                onClick={() => setSubmittedOrderId(order.ID)}
                disabled={submitLoading}
              >
                {submitLoading ? <Spinner color="brand.500" /> : 'Place your order'}
              </Button>
              <VStack
                justifyContent="flex-start"
                textAlign="left"
                w="100%"
                width="full"
                pl="10"
              >
                <Text
                  fontSize="24"
                  w="100%"
                  width="full"
                >
                  Order total: {formatPrice(order.Total)}
                </Text>
                <Text
                  w="100%"
                  width="full"
                  fontSize="12"
                >
                  By placing your order, you agree to our <b>privacy notice</b> and terms and{' '}
                  <b>conditions of use</b>.{' '}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </HStack>
        <HStack>Order Summary</HStack>
      </VStack>
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {addresses.map((address) => (
              <Box
                key={address.ID}
                onClick={() => setSelectedAddress(address)}
                padding={5}
                marginBottom={5}
                border="1px solid lightgray"
                _hover={{ bg: 'brand.100' }}
              >
                <AddressCard address={address} />
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isCreditCardModalOpen}
        onClose={() => setIsCreditCardModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Credit Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {creditCards.map((creditCard) => (
              <Box
                key={creditCard.ID}
                onClick={() => setSelectedCreditCard(creditCard)}
                padding={5}
                marginBottom={5}
                border="1px solid lightgray"
                _hover={{ bg: 'brand.100' }}
              >
                <VStack fontSize="12">
                  <Text fontSize="12">{creditCard.CardholderName}</Text>
                  <HStack>
                    <Box
                      border="1px"
                      borderColor="gray.400"
                      borderRadius="lg"
                      bgColor="gray.200"
                      p="2px"
                    >
                      {creditCard.CardType}
                    </Box>{' '}
                    <Text>ending in {creditCard.PartialAccountNumber}</Text>
                  </HStack>
                  <Text>Expires {formatCreditCardDate(creditCard.ExpirationDate)}</Text>
                </VStack>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OcCheckout

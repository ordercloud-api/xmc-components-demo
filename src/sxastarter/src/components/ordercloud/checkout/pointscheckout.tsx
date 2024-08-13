/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  Address,
  BuyerCreditCard,
  //LineItems,
  Me,
  SpendingAccount,
  SpendingAccounts,
} from 'ordercloud-javascript-sdk'
import {
  Box,
  Button,
  HStack,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import useOcCurrentOrder from '../../../hooks/useOcCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../../redux/ocStore'
import { useRouter } from 'next/router'
import formatPoints from 'src/utils/formatPoints'

type ShippingSpeed = 'overnight' | '2day' | 'ground'

const OcPointsCheckout: FunctionComponent<{ onSubmitted: any }> = () => {
  const toast = useToast()
  const router = useRouter()
  const dispatch = useOcDispatch()

  const { order, lineItems, payments } = useOcCurrentOrder()
  const { user } = useOcSelector((s: any) => ({
    user: s.ocUser.user,
  }))
  const [addresses, setAddresses] = useState([] as Address[])
  const [selectedAddress, setSelectedAddress] = useState({} as Address)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [creditCards, setCreditCards] = useState([] as BuyerCreditCard[])
  const [shippingSpeed] = useState('' as ShippingSpeed)
  const [selectedCreditCard, setSelectedCreditCard] = useState({} as BuyerCreditCard)
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false)
  const [submittedOrderId, setSubmittedOrderId] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const [spendingAccount, setSpendingAccount] = useState({} as SpendingAccount)
  const [availablePoints, setAvailablePoints] = useState(0)
  const [pointsRequiredForPurchase, setPointsRequiredForPurchase] = useState(0)
  const [pointsRemaining, setPointsRemaining] = useState(0)

  useEffect(() => {
    const initialize = async () => {
      if (!order?.ID) {
        return
      }

      const account = await Me.ListSpendingAccounts()
      setSpendingAccount(account.Items[0])
      setAvailablePoints(account.Items[0].Balance)

      //Get required points from shopping cart line items
      const orderTotal = order.Total
      setPointsRequiredForPurchase(orderTotal)
      setPointsRemaining(account.Items[0].Balance - orderTotal)

      // address stuff
      const addressList = await Me.ListAddresses({ sortBy: ['DateCreated'] })
      setAddresses(addressList.Items)
      const address =
        addressList.Items.find((a) => a.ID === order.ShippingAddressID) ?? addressList.Items[0]
      setSelectedAddress(address)

      // credit card stuff
      const creditcardList = await Me.ListCreditCards({ sortBy: ['DateCreated'] })
      setCreditCards(creditcardList.Items)
      const creditCard = !payments?.length
        ? creditcardList.Items[0]
        : creditcardList.Items.find((c) => c.ID === payments[0].CreditCardID)
      setSelectedCreditCard(creditCard)
    }
    initialize()
  }, [order?.ID])

  useEffect(() => {
    const handleOrderSubmit = async () => {
      try {
        setSubmittedOrderId(null)
        setSubmitLoading(true)
        //Add xp to order details
        await dispatch(
          patchOrder({
            xp: {
              category: 'Points Redemption Events',
              PaymentMethodType:
                lineItems.filter((li) => li.Product?.xp?.Type === 'Timeshare Trial').length > 0
                  ? 'Dollars'
                  : 'Points',
            },
          })
        )
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
        //Deduct points from spending account
        await SpendingAccounts.Patch(user.Buyer.ID, spendingAccount.ID, {
          Balance: pointsRemaining,
        })
        router.push(`/my-profile/my-orders/order-details?orderid=${orderSubmitResponse.order.ID}`)
      } catch (e) {
        console.log(e)
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
            Type: 'SpendingAccount',
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
        justifyContent="flex-start"
        textAlign="left"
        alignItems="flex-start"
      >
        <Heading fontSize="xl">Book with your loyalty points</Heading>
        <HStack
          w="100%"
          width="full"
          textAlign="left"
          alignItems="flex-start"
        >
          <VStack
            w="100%"
            width="full"
            textAlign="left"
            alignItems="flex-start"
          >
            <Heading
              fontSize="sm"
              mb="32px"
            >
              Points available:
            </Heading>
            <Box
              border="1px"
              borderColor="gray.400"
              borderRadius="lg"
              bgColor="white"
              p={10}
            >
              <Text fontSize="xl">{formatPoints(availablePoints)} pts</Text>
            </Box>
          </VStack>
          <VStack
            w="100%"
            width="full"
            textAlign="left"
            alignItems="flex-start"
          >
            <Heading
              width="180px"
              fontSize="sm"
            >
              Points needed for Purchase:
            </Heading>
            <Box
              border="1px"
              borderColor="gray.400"
              borderRadius="lg"
              bgColor="white"
              p={10}
            >
              <Text fontSize="xl">{formatPoints(pointsRequiredForPurchase)} pts</Text>
            </Box>
          </VStack>

          <VStack
            w="100%"
            width="full"
            textAlign="left"
            alignItems="flex-start"
          >
            <Heading
              width="180px"
              fontSize="sm"
            >
              Points remaining after purchase:
            </Heading>
            <Box
              border="1px"
              borderColor="gray.400"
              borderRadius="lg"
              bgColor="white"
              p={10}
            >
              <Text fontSize="xl">{formatPoints(pointsRemaining)} pts</Text>
            </Box>
          </VStack>
          <VStack
            w="100%"
            width="full"
          >
            <HStack
              w="100%"
              width="full"
            >
              <VStack
                w="100%"
                width="full"
                textAlign="left"
                alignItems="flex-start"
              >
                <Heading
                  fontSize="sm"
                  color="gray.200"
                  mb="32px"
                >
                  Credit card:
                </Heading>
                <Box
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bgColor="white"
                  p={10}
                >
                  <Text
                    fontSize="xl"
                    color="gray.200"
                  >
                    $0
                  </Text>
                </Box>
              </VStack>
              <HStack
                w="100%"
                width="full"
              >
                <VStack
                  w="100%"
                  width="full"
                  textAlign="left"
                  fontSize="12"
                >
                  <Box
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bgColor="white"
                    p="2px"
                  >
                    {selectedCreditCard.CardType}
                  </Box>{' '}
                  <Text color="gray.200">ending in {selectedCreditCard.PartialAccountNumber}</Text>
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
            </HStack>
          </VStack>
        </HStack>
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
              <VStack
                w="100%"
                justifyContent="flex-start"
                textAlign="left"
                alignItems="flex-start"
              ></VStack>
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
                {submitLoading ? <Spinner color="brand.500" /> : 'Book your stay'}
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
                  {/* Order total: {formatPrice(order.Total)} */}
                  Order total: {formatPoints(pointsRequiredForPurchase)} pts
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

export default OcPointsCheckout

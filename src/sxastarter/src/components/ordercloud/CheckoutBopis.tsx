/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Address,
  BuyerCreditCard,
  Me,
  SpendingAccount,
  SpendingAccounts,
} from 'ordercloud-javascript-sdk'
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useToast,
  Textarea,
} from '@chakra-ui/react'
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs'
import {
  addPayment,
  patchOrder,
  removeAllPayments,
  saveBillingAddress,
  saveShippingAddress,
  submitOrder,
} from '../../redux/ocCurrentOrder'
import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import AddressCard from './cards/AddressCard'
import React from 'react'
import { formatCreditCardDate, formatShortDate } from '../../utils/formatDate'
import formatPrice from '../../utils/formatPrice'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'
import { useRouter } from 'next/router'
import Card from 'components/card/Card'
import { Form, Formik } from 'formik'
import { InputControl } from 'formik-chakra-ui'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import formatPoints from 'src/utils/formatPoints'
import OcCurrentOrderLineItemFoodOrder from './shoppingcart/OcCurrentOrderLineItemList'
import OcCurrentOrderLineItemList from './shoppingcart/OcCurrentOrderLineItemList'

//type ShippingSpeed = 'overnight' | '2day' | 'ground';

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  //let backgroundStyle: {[key: string]: string} = {}
  const { lineItems } = useOcCurrentOrder()

  const toast = useToast()
  const router = useRouter()
  const dispatch = useOcDispatch()
  const { order, payments } = useOcCurrentOrder()
  const [addresses, setAddresses] = useState([] as Address[])
  const [selectedAddress, setSelectedAddress] = useState({} as Address)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isDeliveryInstructionsModalOpen, setIsDeliveryInstructionsModalOpen] = useState(false)
  const [isPreperationInstructionsModalOpen, setIsPreperationInstructionsModalOpen] =
    useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)

  const [creditCards, setCreditCards] = useState([] as BuyerCreditCard[])
  const [shippingSpeed, setShippingSpeed] = React.useState('0')
  const [selectedCreditCard, setSelectedCreditCard] = useState({} as BuyerCreditCard)
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false)
  const [submittedOrderId, setSubmittedOrderId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [availablePoints, setAvailablePoints] = React.useState(0)
  const [currentTip, setCurrentTip] = React.useState(0)
  const [currentShipping, setCurrentShipping] = React.useState(0)
  const [sliderValue, setSliderValue] = React.useState(0)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [spendingAccount, setSpendingAccount] = useState({} as SpendingAccount)

  // Getting Menu Items List
  const menuItems = lineItems?.filter(function (p) {
    return p.xp?.Type == 'Menu'
  })

  // Getting Products List
  const productItems = lineItems?.filter(function (p) {
    return p.xp?.Type == 'Shop'
  })

  const { user } = useOcSelector((s: any) => ({
    user: s.ocUser.user,
  }))

  useEffect(() => {
    const handleOrderSubmit = async () => {
      try {
        setSubmittedOrderId(null)
        setSubmitLoading(true)

        let pointsPaymentString = ''
        if (sliderValue > 0) {
          pointsPaymentString = ' | Points'
        }
        const paymentType = 'Credit Card' + pointsPaymentString

        await dispatch(
          patchOrder({
            ShippingCost: currentShipping,
            Total: order.Total - sliderValue * 0.25 + currentShipping + currentTip,
            xp: {
              category: 'Order Management System',
              tip: currentTip,
              pointsused: sliderValue,
              pointsvalue: sliderValue * 0.25,
              PaymentMethodType: paymentType,
            },
          })
        )

        const account = await Me.ListSpendingAccounts()
        const orderSubmitResponse = await dispatch(submitOrder(order)).unwrap()

        const pointsAfterPurchase = availablePoints - sliderValue * 0.25

        toast({
          title: 'Thank you!',
          description: 'Your order has been submitted',
          status: 'success',
          duration: 8000,
          isClosable: true,
          position: 'top',
        })
        console.log('SPENDING ACCOUNT')
        console.log(sliderValue)
        console.log(account.Items[0].Balance - availablePoints * (sliderValue / 100))
        console.log(account.Items[0].Balance - sliderValue * 0.25)
        console.log(pointsAfterPurchase)
        //Deduct points from spending account
        await SpendingAccounts.Patch(user.Buyer.ID, spendingAccount.ID, {
          Balance: Number(account.Items[0].Balance - availablePoints * (sliderValue / 100)),
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
  }, [
    availablePoints,
    currentShipping,
    currentTip,
    dispatch,
    order,
    router,
    sliderValue,
    spendingAccount.ID,
    submittedOrderId,
    toast,
    user?.Buyer?.ID,
  ])

  useEffect(() => {
    const initialize = async () => {
      if (!order?.ID) {
        return
      }
      const account = await Me.ListSpendingAccounts()
      setSpendingAccount(account.Items[0])
      setAvailablePoints(account.Items[0].Balance)
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
      if (creditCard) setSelectedCreditCard(creditCard)
    }
    initialize()
  }, [order?.ID, order?.ShippingAddressID, payments])

  useEffect(() => {
    const saveAddressToOrder = async () => {
      setIsAddressModalOpen(false)
      await dispatch(saveShippingAddress(selectedAddress))
      await dispatch(saveBillingAddress(selectedAddress))
    }
    if (selectedAddress?.ID && order?.ID) {
      saveAddressToOrder()
    }
  }, [dispatch, order?.ID, selectedAddress, selectedAddress?.ID])

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
        payments[0].Amount !== order?.Total ||
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
  }, [dispatch, order?.ID, order?.Total, payments, selectedCreditCard.ID])

  useEffect(() => {
    const saveShippingSpeedToOrder = async () => {
      // This is a bit of a hack put in for demo purposes
      // ideally would use shippingestimates integration event
      // and not grant user OverrideShipping role
      //dispatch(
      // patchOrder({
      //   ShippingCost: shippingSpeed === 'ground' ? 7.99 : shippingSpeed === '2day' ? 9.99 : 12.99,
      // })
      //);
    }

    if (shippingSpeed) {
      saveShippingSpeedToOrder()
      setCurrentShipping(Number(shippingSpeed))
      console.log(
        'Total: ' +
          order?.Total +
          '  Points Value: ' +
          sliderValue * 0.25 +
          '  Tip: ' +
          currentTip +
          '  Shipping ; ' +
          currentShipping
      )
    }
  }, [currentShipping, currentTip, dispatch, order?.Total, shippingSpeed, sliderValue])

  if (!order) {
    return <div></div>
  }
  function setSubmitting(term: string) {
    console.log(term)
  }

  return (
    <>
      <VStack
        w="100%"
        width="full"
        justifyContent="space-between"
        verticalAlign="top"
        className={`component container ${styles}`}
        //style={backgroundStyle}
      >
        <HStack
          w="100%"
          width="full"
          justifyContent="space-between"
          textAlign="left"
          verticalAlign="top"
          alignItems="start"
          mt={50}
          mb={50}
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
              <VStack
                w="100%"
                width="full"
                textAlign="left"
                alignItems="flex-start"
              >
                {menuItems && menuItems.length ? (
                  <VStack
                    w="100%"
                    width="full"
                    textAlign="left"
                    alignItems="flex-start"
                  >
                    <Heading fontSize="x-large">MENU ITEMS FOR CURBSIDE PICKUP</Heading>
                    <HStack
                      w="100%"
                      width="full"
                      textAlign="left"
                      bgColor="#efeeee"
                      p={4}
                    >
                      <VStack
                        w="100%"
                        width="full"
                        textAlign="left"
                        alignItems="flex-start"
                      >
                        <Heading
                          fontSize="lg"
                          mb="0"
                        >
                          Ordering from: Lakeville
                        </Heading>
                        <Text>17189 Kenyon Ave., Lakeville, MN</Text>
                        <NextLink
                          href="tel:952-898-5151"
                          passHref
                        >
                          <Link color="brand.500">
                            <Text>952-898-5151</Text>
                          </Link>
                        </NextLink>
                      </VStack>
                      <HStack
                        w="100%"
                        width="full"
                      >
                        <Box
                          bgColor="gray.100"
                          border="1px"
                          borderColor="#fafafa"
                          pt={2}
                          pb={2}
                          pl={4}
                          pr={4}
                          borderRadius={2}
                        >
                          <Text
                            onClick={() => setIsVehicleModalOpen(true)}
                            cursor="pointer"
                          >
                            Change Vehicle
                          </Text>
                        </Box>
                      </HStack>
                      <HStack
                        w="100%"
                        width="full"
                      >
                        <Text>Pickup Info</Text>
                        <Box
                          bgColor="#fff"
                          border="1px"
                          borderColor="gray.400"
                          pt={2}
                          pb={2}
                          pl={4}
                          pr={4}
                          borderRadius={2}
                        >
                          <Text>{formatShortDate(order.DateCreated)}</Text>
                        </Box>
                      </HStack>
                    </HStack>
                    <VStack
                      w="100%"
                      width="full"
                      justifyContent="space-between"
                      alignItems="flex-end"
                      pt="10"
                    >
                      <OcCurrentOrderLineItemFoodOrder
                        emptyMessage="Your cart is empty"
                        editable
                        productType="Menu"
                      />
                    </VStack>

                    <Divider
                      mt={10}
                      mb={10}
                    ></Divider>
                  </VStack>
                ) : (
                  <VStack></VStack>
                )}
              </VStack>
              {productItems && productItems.length ? (
                <VStack
                  w="100%"
                  width="full"
                  textAlign="left"
                  alignItems="flex-start"
                >
                  <Heading fontSize="x-large">ITEMS FOR DELIVERY</Heading>
                  <Box
                    w="100%"
                    width="full"
                    textAlign="left"
                  >
                    <Select
                      value="0"
                      placeholder="How fast should this ship?"
                      fontSize="16px"
                      onChange={(e) => setShippingSpeed(e.currentTarget.value)}
                    >
                      <option value="12.99">Standard overnight ($12.99) - est 1 day</option>
                      <option value="9.99">2 Day ($9.99) - est 4 days</option>
                      <option value="7.99">Ground ($7.99) - est 2 days</option>
                    </Select>
                  </Box>
                  <HStack
                    w="100%"
                    width="full"
                    textAlign="left"
                    bgColor="#efeeee"
                    p={4}
                  >
                    <VStack
                      w="100%"
                      justifyContent="flex-start"
                      textAlign="left"
                    >
                      <Text
                        w="100%"
                        width="full"
                        textAlign="left"
                        fontSize="16"
                      >
                        {selectedAddress.FirstName} {selectedAddress.LastName}
                      </Text>
                      <Text
                        w="100%"
                        width="full"
                        textAlign="left"
                        fontSize="16"
                      >
                        {selectedAddress.Street1} {selectedAddress.City}, {selectedAddress.State}{' '}
                        {selectedAddress.Zip}
                      </Text>
                    </VStack>
                    <HStack
                      w="100%"
                      width="full"
                    >
                      <Box
                        bgColor="gray.100"
                        border="1px"
                        borderColor="#fafafa"
                        pt={2}
                        pb={2}
                        pl={4}
                        pr={4}
                        borderRadius={2}
                      >
                        <Text>
                          <Link onClick={() => setIsAddressModalOpen(true)}>
                            <Text
                              textDecoration="underline"
                              fontSize="16"
                            >
                              Change
                            </Text>
                          </Link>
                        </Text>
                      </Box>
                    </HStack>
                    <HStack
                      w="100%"
                      width="full"
                    >
                      <Text>Delivery Date</Text>
                      <Box
                        bgColor="#fff"
                        border="1px"
                        borderColor="gray.400"
                        pt={2}
                        pb={2}
                        pl={4}
                        pr={4}
                        borderRadius={2}
                      >
                        <Text>{formatShortDate(order.DateCreated)}</Text>
                      </Box>
                    </HStack>
                  </HStack>
                  <VStack
                    w="100%"
                    width="full"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    pt="10"
                  >
                    <OcCurrentOrderLineItemList
                      emptyMessage="Your cart is empty"
                      editable
                      productType="Shop"
                    />
                  </VStack>

                  <Divider
                    mt={10}
                    mb={10}
                  ></Divider>
                </VStack>
              ) : (
                <VStack></VStack>
              )}
              <Heading fontSize="x-large">PAYMENT</Heading>
              <HStack
                w="100%"
                width="full"
                textAlign="left"
                bgColor="#efeeee"
                p={4}
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
                  >
                    <HStack
                      w="100%"
                      width="full"
                      textAlign="left"
                      fontSize="16"
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
                      fontSize="16"
                    >
                      Billing address: {selectedAddress.FirstName} {selectedAddress.LastName},{' '}
                      {selectedAddress.Street1} <br />
                      {selectedAddress.City}, {selectedAddress.State} {selectedAddress.Zip}
                    </Text>
                  </VStack>
                  <Link>
                    <Box
                      bgColor="gray.100"
                      border="1px"
                      borderColor="#fafafa"
                      pt={2}
                      pb={2}
                      pl={4}
                      pr={4}
                      borderRadius={2}
                    >
                      <Text
                        textDecoration="underline"
                        fontSize="16"
                        onClick={() => setIsCreditCardModalOpen(true)}
                      >
                        Change
                      </Text>
                    </Box>
                  </Link>
                </HStack>
              </HStack>
              <Divider
                mt={10}
                mb={10}
              ></Divider>
              <HStack
                w="100%"
                width="full"
                justifyContent="space-between"
              >
                <HStack
                  w="100%"
                  width="full"
                  textAlign="left"
                >
                  <NextLink
                    href="/"
                    passHref
                  >
                    <Link color="brand.500">
                      <HStack>
                        <HiChevronLeft
                          fontSize="36px"
                          color="brand.500"
                        />
                        <Text>Continue Shopping</Text>
                      </HStack>
                    </Link>
                  </NextLink>
                </HStack>
                <HStack
                  w="100%"
                  width="full"
                  alignItems="flex-end"
                  justifyContent="flex-end"
                >
                  <NextLink
                    href="/shopping-cart"
                    passHref
                  >
                    <Link color="brand.500">
                      <Button variant="secondaryButton">
                        <Text>Clear cart</Text>
                      </Button>
                    </Link>
                  </NextLink>
                </HStack>
              </HStack>
            </VStack>
          </HStack>

          <HStack
            w="100%"
            width="full"
            textAlign="left"
            maxWidth="250px"
            ml={30}
          >
            <Card variant="">
              <Heading>SUMMARY</Heading>
              <Text>Apply a promo code</Text>
              <Formik
                initialValues={{ search: '' }}
                onSubmit={async (values) => {
                  setSubmitting(values.search)
                }}
              >
                <Form>
                  <HStack
                    w="100%"
                    width="full"
                  >
                    <InputControl
                      name="search"
                      inputProps={{
                        placeholder: 'Enter promotion code',
                        border: '1px',
                        borderColor: 'gray.300',
                        height: '41px',
                        color: 'gray.500',
                        background: 'none',
                      }}
                      label=""
                    />

                    <Button
                      mt="0px"
                      pt="10px"
                      pb="10px"
                      pl="20px"
                      pr="20px"
                      bg="brand.500"
                      type="submit"
                      color="white"
                      fontSize="x-small"
                      right="-7px"
                    >
                      Apply
                    </Button>
                  </HStack>
                </Form>
              </Formik>

              <Divider
                mt={10}
                mb={10}
              ></Divider>

              <Heading fontSize="x-large">
                PAY WITH POINTS ({formatPoints(availablePoints)} available)
              </Heading>
              <Slider
                id="slider"
                defaultValue={0}
                min={0}
                max={100}
                colorScheme="teal"
                onChange={(v) => setSliderValue(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderMark
                  value={25}
                  mt="1"
                  ml="-2.5"
                  fontSize="sm"
                >
                  25% <br />({formatPoints(availablePoints * 0.25)} pts)
                </SliderMark>
                <SliderMark
                  value={50}
                  mt="1"
                  ml="-2.5"
                  fontSize="sm"
                >
                  50% <br />({formatPoints(availablePoints * 0.5)} pts)
                </SliderMark>
                <SliderMark
                  value={75}
                  mt="1"
                  ml="-2.5"
                  fontSize="sm"
                >
                  75% <br />({formatPoints(availablePoints * 0.75)} pts)
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="brand.500"
                  color="white"
                  placement="top"
                  isOpen={showTooltip}
                  label={`${sliderValue}% ( ${formatPoints(
                    availablePoints * (sliderValue / 100)
                  )}) pts)`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
              <Divider
                mt={10}
                mb={10}
              ></Divider>

              {menuItems && menuItems.length ? (
                <VStack
                  w="100%"
                  width="full"
                  textAlign="left"
                  alignItems="flex-start"
                >
                  <Text>Dont forget to add a tip!</Text>
                  <HStack
                    w="100%"
                    width="full"
                    justifyContent="center"
                  >
                    <Button
                      id="checkout-tip-0"
                      type="button"
                      aria-describedby="ae-checkout-tip"
                      border="1px"
                      borderColor="gray.300"
                      variant="secondaryButton"
                      height="80px"
                      onClick={() => setCurrentTip(order.Total * 0.15)}
                    >
                      <Text fontSize="18px">
                        15%
                        <br />
                        <Text fontSize="14px">{formatPrice(order.Total * 0.15)}</Text>
                      </Text>
                    </Button>
                    <Button
                      id="checkout-tip-1"
                      type="button"
                      aria-describedby="ae-checkout-tip"
                      border="1px"
                      borderColor="gray.300"
                      variant="secondaryButton"
                      height="80px"
                      onClick={() => setCurrentTip(order.Total * 0.18)}
                    >
                      <Text fontSize="18px">
                        18%
                        <br />
                        <Text fontSize="14px">{formatPrice(order.Total * 0.18)}</Text>
                      </Text>
                    </Button>
                    <Button
                      id="checkout-tip-2"
                      type="button"
                      aria-describedby="ae-checkout-tip"
                      border="1px"
                      borderColor="gray.300"
                      variant="secondaryButton"
                      height="80px"
                      onClick={() => setCurrentTip(order.Total * 0.2)}
                    >
                      <Text fontSize="18px">
                        20%
                        <br />
                        <Text fontSize="14px">{formatPrice(order.Total * 0.2)}</Text>
                      </Text>
                    </Button>
                    <Button
                      id="checkout-other-tip"
                      type="button"
                      aria-describedby="ae-checkout-tip"
                      border="1px"
                      borderColor="gray.300"
                      variant="secondaryButton"
                      height="80px"
                    >
                      <Text fontSize="18px">
                        Other
                        <br />
                        <Text fontSize="14px">Add custom tip</Text>
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack></VStack>
              )}
              <HStack
                w="100%"
                width="full"
                justifyContent="space-between"
                mt={10}
              >
                <HStack>
                  <Text>Points redemption</Text>
                </HStack>
                <HStack>
                  <Text>
                    {formatPrice(sliderValue * 0.25)} (
                    {formatPoints(availablePoints * (sliderValue / 100))} pts)
                  </Text>
                </HStack>
              </HStack>
              <HStack
                w="100%"
                width="full"
                justifyContent="space-between"
                mt={5}
              >
                <HStack>
                  <Text>Subtotal</Text>
                </HStack>
                <HStack>
                  <Text>{formatPrice(order.Subtotal - sliderValue * 0.25)}</Text>
                </HStack>
              </HStack>
              <HStack
                w="100%"
                width="full"
                justifyContent="space-between"
                mt={5}
              >
                <HStack>
                  <Text>Estimated tax</Text>
                </HStack>
                <HStack>
                  <Text>{formatPrice(order.TaxCost)}</Text>
                </HStack>
              </HStack>
              {menuItems && menuItems.length ? (
                <HStack
                  w="100%"
                  width="full"
                  justifyContent="space-between"
                  mt={5}
                >
                  <HStack>
                    <Text>Tip</Text>
                  </HStack>
                  <HStack>
                    <Text>{formatPrice(currentTip)}</Text>
                  </HStack>
                </HStack>
              ) : (
                <VStack></VStack>
              )}
              {productItems && productItems.length ? (
                <HStack
                  w="100%"
                  width="full"
                  justifyContent="space-between"
                  mt={5}
                >
                  <HStack>
                    <Text>Shipping</Text>
                  </HStack>
                  <HStack>
                    <Text>{formatPrice(currentShipping)}</Text>
                  </HStack>
                </HStack>
              ) : (
                <VStack></VStack>
              )}
              <HStack
                w="100%"
                width="full"
                justifyContent="space-between"
                mt={5}
                mb={10}
              >
                <HStack>
                  <Text fontWeight="bold">Total</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">
                    {formatPrice(order.Total - sliderValue * 0.25 + currentShipping + currentTip)}
                  </Text>
                </HStack>
              </HStack>
              <Divider
                mt={10}
                mb={10}
              ></Divider>
              <Heading
                fontSize="xl"
                w="100%"
                width="full"
                textAlign="center"
              >
                Make sure to double-
                <br />
                check your order <br />
                details!
              </Heading>
              <Text
                w="100%"
                width="full"
                fontSize="16"
                mb={15}
                textAlign="center"
              >
                By clicking the &quot;Place my order&quot;
                <br /> button, I agree to{' '}
                <NextLink
                  href="#"
                  passHref
                >
                  <Link>
                    Terms and <br />
                    Conditions.
                  </Link>
                </NextLink>
              </Text>
              <HStack
                w="100%"
                width="full"
                justifyContent="center"
              >
                <Button
                  bgColor="brand.500"
                  color="white"
                  borderRadius="lg"
                  size="lg"
                  fontSize="16"
                  fontWeight="normal"
                  onClick={() => setSubmittedOrderId(order?.ID)}
                  disabled={submitLoading}
                  textAlign="center"
                  mb={10}
                >
                  {submitLoading ? <Spinner color="brand.500" /> : 'Place my order'}
                </Button>
              </HStack>
            </Card>
          </HStack>
        </HStack>
      </VStack>
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="full"
          w="100%"
          maxWidth="800px"
        >
          <ModalHeader>
            <Heading>CURBSIDE PICK UP INFO</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading fontSize="lg">What vehicle are you picking up in?</Heading>
            <Input
              placeholder="Vehicle make"
              height="45px"
              mt={2}
              mb={10}
            />
            <Heading fontSize="lg">Select your vehicle type</Heading>
            <HStack
              w="full"
              mt={4}
              mb={10}
            >
              <HiChevronLeft
                fontSize="40px"
                color="brand.500"
              />
              <VStack>
                <Avatar
                  src="Car-Icon.d328ba1d.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Car</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="Truck-Icon.0667dc91.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Truck</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="SUV-icon.40dd8462.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Suv</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="Van-Icon.d127880b.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Van</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="Hatchback-Icon.052e6a10.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Hatchback</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="Other-Vehicle-Icon.bde51420.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Other</Text>
              </VStack>
              <HiChevronRight
                fontSize="40px"
                color="brand.500"
              />
            </HStack>
            <Heading fontSize="lg">Select your vehicle color</Heading>
            <HStack
              w="full"
              mt={4}
              mb={10}
            >
              <HiChevronLeft
                fontSize="40px"
                color="brand.500"
              />
              <VStack>
                <Avatar
                  src="WhiteIcon.89599fbc.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">White</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="GrayIcon.ccc5e512.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Silver/Gray</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="BlackIcon.28d5a946.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Black</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="RedIcon.02df4fa2.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Red</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="BlueIcon.0ceaced2.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Blue</Text>
              </VStack>
              <VStack>
                <Avatar
                  src="OtherIcon.bf7aaab6.svg"
                  colorScheme="white"
                  border="1px"
                  borderColor="gray.400"
                  width="80px"
                  height="80px"
                />
                <Text fontSize="24px">Other</Text>
              </VStack>
              <HiChevronRight
                fontSize="40px"
                color="brand.500"
              />
            </HStack>
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
                onClick={() => setIsVehicleModalOpen(false)}
              >
                <Text fontSize="18px">Update Profile</Text>
              </Button>
              <Button
                type="button"
                aria-describedby="ae-checkout-tip"
                border="1px"
                borderColor="gray.300"
                variant="secondaryButton"
                height="50px"
                onClick={() => setIsVehicleModalOpen(false)}
              >
                <Text fontSize="18px">cancel</Text>
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isPreperationInstructionsModalOpen}
        onClose={() => setIsPreperationInstructionsModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="full"
          w="100%"
          maxWidth="800px"
        >
          <ModalHeader>
            <Heading>Add Preperation Instructions</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Preperation instructions"
              height="175px"
            />
            <VStack>
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
                  onClick={() => setIsPreperationInstructionsModalOpen(false)}
                >
                  <Text fontSize="18px">Add Instructions To Menu Item</Text>
                </Button>
                <Button
                  type="button"
                  aria-describedby="ae-checkout-tip"
                  border="1px"
                  borderColor="gray.300"
                  variant="secondaryButton"
                  height="50px"
                  onClick={() => setIsPreperationInstructionsModalOpen(false)}
                >
                  <Text fontSize="18px">Cancel</Text>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
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
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="full"
          w="100%"
          maxWidth="800px"
        >
          <ModalHeader>
            <Heading>Change Address</Heading>
          </ModalHeader>
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
        <ModalContent
          width="full"
          w="100%"
          maxWidth="800px"
        >
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
                  <Text>Expires {formatCreditCardDate(creditCard?.ExpirationDate)}</Text>
                </VStack>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

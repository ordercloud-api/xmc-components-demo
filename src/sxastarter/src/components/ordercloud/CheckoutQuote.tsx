import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs'
import { useRouter } from 'next/router'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { Address, BuyerCreditCard, CostCenter, Me, Promotion } from 'ordercloud-javascript-sdk'
import DatePicker from 'react-datepicker'
import { FaCcMastercard, FaCcVisa, FaCreditCard } from 'react-icons/fa6'
import { MdLocalShipping, MdStore } from 'react-icons/md'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'
import {
  addPayment,
  applyPromo,
  patchOrder,
  removeAllPayments,
  saveBillingAddress,
  saveShippingAddress,
  submitOrder,
} from '../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../redux/ocStore'
import { formatCreditCardDate } from '../../utils/formatDate'
import formatPrice from '../../utils/formatPrice'
import AddressCard from './cards/AddressCard'
import OcCurrentOrderLineItemList from './shoppingcart/OcCurrentOrderLineItemList'

type ShippingSpeed = 'overnight' | '2day' | 'ground'

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  //let backgroundStyle: {[key: string]: string} = {}

  const toast = useToast()
  const router = useRouter()
  const dispatch = useOcDispatch()
  const { order, payments } = useOcCurrentOrder()
  const [addresses, setAddresses] = useState([] as Address[])
  const [selectedAddress, setSelectedAddress] = useState({} as Address)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isPickUpModalOpen, setIsPickUpModalOpen] = useState(false)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [creditCards, setCreditCards] = useState([] as BuyerCreditCard[])
  const [promotion, setPromotion] = useState(null as Promotion)
  const [promotioncode, setPromotionCode] = useState(null)
  const [shippingSpeed, setShippingSpeed] = useState(undefined as ShippingSpeed)
  const [selectedCreditCard, setSelectedCreditCard] = useState({} as BuyerCreditCard)
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false)
  const [submittedOrderId, setSubmittedOrderId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [localPickUp, setLocalPickUp] = useState(true)
  const [submittedOrderPromoValid, setSubmittedOrderPromoValid] = useState(false)
  const [costCenters, setCostCenters] = useState([] as CostCenter[])
  const [selectedCostCenter, setSelectedCostCenter] = useState('')

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
  }, [dispatch, order, router, submittedOrderId, toast])

  async function onPromotionSubmit() {
    try {
      setSubmitLoading(true)
      dispatch(applyPromo(promotioncode))
      const promotionList = await Me.ListPromotions({ filters: { Code: promotioncode } })
      toast({
        title: 'Promotion applied!',
        description: 'Your order has been updated and the promotion has been applied',
        status: 'success',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })
      setSubmitLoading(false)
      //console.log(promotionList);
      if (promotionList.Items.length) {
        setSubmittedOrderPromoValid(true)
        setPromotion(promotionList.Items[0])
      }
    } catch (e) {
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

  const [startDate, setStartDate] = useState(new Date())

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
      const creditCard = !payments?.length
        ? creditcardList.Items[0]
        : creditcardList.Items.find((c) => c.ID === payments[0].CreditCardID)
      if (creditCard) setSelectedCreditCard(creditCard)

      // cost center stuff
      const costCenters = await Me.ListCostCenters()
      setCostCenters(costCenters.Items)
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

  const renderCreditCardIcon = useCallback(() => {
    switch (selectedCreditCard?.CardType) {
      case 'Visa':
        return FaCcVisa
      case 'Mastercard' || 'MasterCard':
        return FaCcMastercard
      default:
        return FaCreditCard
    }
  }, [selectedCreditCard])

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
  }, [dispatch, shippingSpeed])

  useEffect(() => {
    const saveCostCenterToOrder = async (costCenter: CostCenter | null) => {
      dispatch(
        patchOrder({
          xp: { CostCenter: costCenter },
        })
      )
    }

    const costCenter = costCenters?.find((c) => (c.ID === selectedCostCenter)) || null
    saveCostCenterToOrder(costCenter)
  }, [costCenters, dispatch, selectedCostCenter])

  const handlePromoCode = (promo: string) => {
    setPromotionCode(promo)
  }

  const handleChangeCreditCard = (creditCard: SetStateAction<BuyerCreditCard>) => {
    setSelectedCreditCard(creditCard)
    setIsCreditCardModalOpen(false)
  }

  if (!order) {
    return <div></div>
  }

  return (
    <>
      <Container
        as={SimpleGrid}
        gridTemplateColumns={{ lg: '3fr 1fr', xl: '4fr 1fr' }}
        alignItems="flex-start"
        gap={3}
        maxW="container.2xl"
      >
        <VStack
          w="full"
          justifyContent="space-between"
          className={`component container ${styles}`}
          //style={backgroundStyle}
        >
          {/* 1 SHIPPING ADDRESS */}
          <SimpleGrid
            gridTemplateColumns="250px 3fr auto"
            w="100%"
          >
            <Heading
              as="h3"
              variant="section"
            >
              <Text
                as="span"
                mr="3"
              >
                1
              </Text>
              Shipping address
            </Heading>
            <VStack
              as="address"
              fontStyle="normal"
              alignItems="flex-start"
              fontSize="lg"
              gap={0}
            >
              <Text>
                {selectedAddress?.FirstName} {selectedAddress?.LastName}
              </Text>
              <Text>{selectedAddress?.Street1}</Text>
              {selectedAddress?.Street2 && <Text>{selectedAddress?.Street2}</Text>}
              <Text>
                {selectedAddress?.City}, {selectedAddress?.State} {selectedAddress?.Zip}
              </Text>
              <Button
                mt={3}
                fontSize="sm"
                variant="link"
                onClick={() => setIsDeliveryModalOpen(true)}
              >
                Add delivery instructions
              </Button>
            </VStack>
            <Link
              fontSize="lg"
              textDecoration="underline"
              onClick={() => setIsAddressModalOpen(true)}
            >
              Change
            </Link>
          </SimpleGrid>
          <Divider
            borderColor="chakra-border-color"
            my="3"
          />
          {/* 2 PAYMENT METHOD */}
          <SimpleGrid
            gridTemplateColumns="250px 3fr auto"
            w="100%"
          >
            <Heading
              as="h3"
              variant="section"
            >
              <Text
                as="span"
                mr="3"
              >
                2
              </Text>
              Payment Method
            </Heading>
            <VStack
              fontStyle="normal"
              alignItems="flex-start"
              gap={0}
            >
              <HStack fontSize="lg">
                <Icon
                  p={0}
                  color="chakra-placeholder-color"
                  boxSize="icon.md"
                  as={renderCreditCardIcon()}
                />
                <Text fontWeight="semibold">
                  Ending in {selectedCreditCard.PartialAccountNumber}
                </Text>
              </HStack>

              <Text fontSize="md">
                Billing address: {selectedAddress?.FirstName} {selectedAddress?.LastName},{' '}
                {selectedAddress?.Street1}...
              </Text>
              {costCenters.length && (
                <HStack
                  w="full"
                  maxW="sm"
                  alignItems="flex-end"
                  gap={6}
                >
                  <FormControl mt={3}>
                    <FormLabel fontSize="xs">
                      Select a cost center{' '}
                      <Text
                        as="span"
                        fontWeight="normal"
                        color="chakra-placeholder-color"
                      >
                        (optional)
                      </Text>
                    </FormLabel>
                    <Select
                      size="sm"
                      borderRadius="md"
                      id="CostCenterSelect"
                      onChange={(e) => setSelectedCostCenter(e.target.value)}
                      placeholder="None selected"
                      value={selectedCostCenter}
                    >
                      {costCenters.map((c) => (
                        <option
                          key={c.ID}
                          value={c.ID}
                        >
                          {c.Name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
              )}
            </VStack>

            <Link
              fontSize="lg"
              textDecoration="underline"
              onClick={() => setIsCreditCardModalOpen(true)}
            >
              Change
            </Link>
          </SimpleGrid>
          <Divider
            borderColor="chakra-border-color"
            my="3"
          />
          {/* 3 REVIEW AND DELIVERY */}
          <SimpleGrid
            gridTemplateColumns="250px 3fr auto"
            w="100%"
          >
            <Heading
              as="h3"
              variant="section"
            >
              <Text
                as="span"
                mr="3"
              >
                3
              </Text>
              Review & Delivery
            </Heading>
            <VStack
              fontStyle="normal"
              alignItems="flex-start"
              gap={0}
            >
              {/* ~~~~ */}
              <RadioGroup
                maxW="prose"
                as={VStack}
                alignItems="flex-start"
                defaultValue="Delivered"
              >
                <Radio
                  value="Delivered"
                  defaultChecked
                  onChange={() => setLocalPickUp(true)}
                >
                  <Text fontWeight="semibold">Deliver to me</Text>
                </Radio>
                <Box
                  as={Collapse}
                  in={localPickUp}
                  w="full"
                >
                  <HStack my={2}>
                    <Icon
                      layerStyle="icon.subtle"
                      boxSize="icon.sm"
                      color="primary"
                      as={MdLocalShipping}
                      sx={{ 'path:first-of-type': { display: 'none' } }}
                    />
                    <Text
                      fontSize="xs"
                      color="chakra-subtle-text"
                    >
                      Shipping estimates are based on delivery speed after items have been shipped
                      by the carrier. Items requiring customization could take longer to ship.
                    </Text>
                  </HStack>
                  <Select
                    size="sm"
                    maxW="300px"
                    borderRadius="md"
                    value={shippingSpeed}
                    onChange={(e) => setShippingSpeed(e.currentTarget.value as ShippingSpeed)}
                  >
                    <option
                      selected
                      disabled
                    >
                      Select shipping method
                    </option>
                    <option value="overnight">Standard overnight ($12.99) - est 1 day</option>
                    <option value="2day">2 Day ($9.99) - est 2-4 days</option>
                    <option value="ground">Ground ($7.99) - est 5-7 days</option>
                  </Select>
                </Box>
                <Radio
                  value="PickUpInStore"
                  onChange={() => setLocalPickUp(false)}
                >
                  <Text fontWeight="semibold">Pick up in store</Text>
                </Radio>
                <Box
                  as={Collapse}
                  in={!localPickUp}
                  w="full"
                >
                  <HStack my={2}>
                    <Icon
                      layerStyle="icon.subtle"
                      boxSize="icon.sm"
                      color="primary"
                      as={MdStore}
                      sx={{ 'path:first-of-type': { display: 'none' } }}
                    />
                    <Text
                      fontSize="xs"
                      color="chakra-subtle-text"
                    >
                      Pick up in store comes with the ability to come in or use our curbside pick up
                      feature. For curbside service, just text us when you arrive and we will bring
                      it out to you.
                    </Text>
                  </HStack>
                </Box>
              </RadioGroup>
              <Card
                w="100%"
                variant="filled"
                p={4}
                mt={4}
                pb={0}
              >
                <OcCurrentOrderLineItemList emptyMessage="Your cart is empty" />
              </Card>
            </VStack>
          </SimpleGrid>
        </VStack>
        <Card
          position="sticky"
          top="100"
          variant=""
          borderLeftWidth="1px"
          borderColor="chakra-border-color"
          minH="300"
        >
          <CardHeader>
            <Heading variant="section">Order Summary</Heading>
          </CardHeader>
          <CardBody
            as={VStack}
            alignItems="flex-start"
          >
            <SimpleGrid
              as="dl"
              gridTemplateColumns={{ lg: '1fr auto' }}
              gap={0}
              fontSize="sm"
              w="full"
            >
              <Text
                as="dt"
                color="chakra-subtle-text"
              >
                Subtotal:
              </Text>
              <Text
                as="dd"
                textAlign="right"
              >
                {formatPrice(order?.Subtotal)}
              </Text>
              <Text
                as="dt"
                color="chakra-subtle-text"
              >
                Delivery:
              </Text>
              <Text
                as="dd"
                textAlign="right"
              >
                {formatPrice(order?.ShippingCost)}
              </Text>
              <Text
                as="dt"
                color="chakra-subtle-text"
              >
                Tax:
              </Text>
              <Text
                as="dd"
                textAlign="right"
              >
                {formatPrice(order?.TaxCost)}
              </Text>
            </SimpleGrid>
            {!submittedOrderPromoValid ? (
              <FormControl
                py={5}
                mt={3}
                borderBlock="1px solid"
                borderColor="chakra-border-color"
              >
                <FormLabel fontSize="xs">Add a gift card or promotion code or voucher</FormLabel>
                <InputGroup size="sm">
                  <Input
                    borderRadius="md"
                    id="PromoCode"
                    placeholder="Enter code"
                    onChange={(e) => handlePromoCode(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => onPromotionSubmit()}
                    >
                      Apply
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            ) : (
              <Alert
                status="success"
                p={2}
                mt={3}
                w="auto"
                alignItems="center"
              >
                <AlertIcon />
                <VStack
                  as={AlertDescription}
                  alignItems="flex-start"
                  gap={0}
                  fontSize="xs"
                >
                  <AlertTitle>Promotion has been applied!</AlertTitle>
                  {(promotion?.ID || promotion?.Code) && (
                    <>
                      <Text>Promotion Code: {promotion?.Code}</Text>
                      <Text>Promotion Code: {promotion?.Code}</Text>
                    </>
                  )}
                </VStack>
              </Alert>
            )}
            <HStack
              fontSize="lg"
              fontWeight="bold"
              justifyContent="space-between"
              w="full"
            >
              <Text>Order total:</Text> <Text>{formatPrice(order.Total)}</Text>
            </HStack>
          </CardBody>
          <CardFooter
            flexDirection="column"
            w="full"
            pt="0"
          >
            <Button
              size="lg"
              colorScheme="green"
              onClick={() => setSubmittedOrderId(order?.ID)}
              isLoading={submitLoading}
              disabled={submitLoading}
            >
              {submitLoading ? 'Placing your order' : 'Place order'}
            </Button>
            <Text
              mt={3}
              fontSize=".75em"
              color="chakra-subtle-text"
            >
              By placing your order, you agree to our <b>privacy notice</b> and terms and{' '}
              <b>conditions of use</b>.{' '}
            </Text>
          </CardFooter>
        </Card>
      </Container>
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="18px">Change Address</ModalHeader>
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
        size="lg"
        isOpen={isCreditCardModalOpen}
        onClose={() => setIsCreditCardModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalHeader>
            <Heading
              mt={-3}
              ml={-6}
              variant="section"
            >
              Change Credit Card
            </Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody
            as={SimpleGrid}
            gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
            gap={3}
          >
            {creditCards.map((creditCard) => (
              <Card
                as={Button}
                key={creditCard.ID}
                isActive={creditCard.ID === selectedCreditCard.ID}
                onClick={() => handleChangeCreditCard}
                p={0}
                aspectRatio="1.5/1"
                boxSize="auto"
                layerStyle="interactive.raise"
                border="1px solid transparent"
                _active={{
                  bgColor: 'primary.50',
                  borderColor: 'primary.100',
                }}
              >
                <CardBody
                  as={VStack}
                  alignItems="flex-start"
                >
                  <VStack
                    alignItems="flex-start"
                    gap={1}
                  >
                    <HStack
                      fontSize="md"
                      mb={2}
                    >
                      <Icon
                        p={0}
                        color="chakra-placeholder-color"
                        boxSize="icon.sm"
                        as={renderCreditCardIcon()}
                      />
                      <Text fontWeight="semibold">
                        Ending in {selectedCreditCard.PartialAccountNumber}
                      </Text>
                    </HStack>
                    <Text
                      fontSize="sm"
                      fontWeight="normal"
                      color="chakra-subtle-text"
                    >
                      {creditCard.CardholderName}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="normal"
                      color="chakra-subtle-text"
                    >
                      Expires {formatCreditCardDate(creditCard?.ExpirationDate)}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="100%"
          w="full"
          maxW="600px"
        >
          <ModalHeader fontSize="18px">Add Delivery Instructions</ModalHeader>
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
                  onClick={() => setIsDeliveryModalOpen(false)}
                >
                  <Text
                    fontSize="18px"
                    mb="0px"
                  >
                    Add
                  </Text>
                </Button>
                <Button
                  type="button"
                  aria-describedby="ae-checkout-tip"
                  border="1px"
                  borderColor="gray.300"
                  variant="secondaryButton"
                  height="50px"
                  onClick={() => setIsDeliveryModalOpen(false)}
                >
                  <Text
                    fontSize="18px"
                    mb="0px"
                  >
                    Cancel
                  </Text>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isPickUpModalOpen}
        onClose={() => setIsPickUpModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="100%"
          w="full"
          maxW="600px"
        >
          <ModalHeader fontSize="24px">Schedule an Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="100%">
            <VStack
              width="100%"
              textAlign="left"
              alignContent="flex-start"
              alignItems="flex-start"
            >
              <Text
                fontSize="18px"
                width="100%"
              >
                Select Date:
              </Text>
              <DatePicker
                selectsStart
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                startDate={startDate}
              />

              <Text
                fontSize="18px"
                mt="20px"
                width="100%"
              >
                Select Time:
              </Text>
              <Select
                fontSize="18px"
                mb="20px"
                p="5px"
                width="100%"
                height="40px"
              >
                <option>available times</option>
                <option>9:00am-10:00am</option>
                <option>1:00pm-2:00pm</option>
                <option>5:00pm-6:00pm</option>
              </Select>
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
                  onClick={() => setIsPickUpModalOpen(false)}
                >
                  <Text
                    fontSize="18px"
                    mb="0px"
                  >
                    Schedule session
                  </Text>
                </Button>
                <Button
                  type="button"
                  aria-describedby="ae-checkout-tip"
                  border="1px"
                  borderColor="gray.300"
                  variant="secondaryButton"
                  height="50px"
                  onClick={() => setIsPickUpModalOpen(false)}
                >
                  <Text
                    fontSize="18px"
                    mb="0px"
                  >
                    Cancel
                  </Text>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

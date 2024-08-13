import React from 'react'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { OcCheckoutStepProps } from './steppedcheckout'
import useOcCurrentOrder from '../../../hooks/useOcCurrentOrder'
import { addPayment, applyPromo, removeAllPayments } from '../../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../../redux/ocStore'
import formatPrice from '../../../utils/formatPrice'
import {
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Divider,
  Box,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Link,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { HiChevronDoubleRight, HiChevronDoubleLeft } from 'react-icons/hi'
import { Address, BuyerCreditCard, Me, Promotion } from 'ordercloud-javascript-sdk'
import { formatCreditCardDate } from 'src/utils/formatDate'

const OcCheckoutPayment: FunctionComponent<OcCheckoutStepProps> = ({ onNext, onPrev }) => {
  const dispatch = useOcDispatch()
  const toast = useToast()
  const { order, payments } = useOcCurrentOrder()
  const [promotion, setPromotion] = useState(null as Promotion)
  const [addresses, setAddresses] = useState([] as Address[])
  const [promotioncode, setPromotionCode] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false)
  const [isNewCreditCardModalOpen, setIsNewCreditCardModalOpen] = useState(false)
  const [creditCards, setCreditCards] = useState([] as BuyerCreditCard[])
  const [submittedOrderPromoValid, setSubmittedOrderPromoValid] = useState(false)
  const [selectedCreditCard, setSelectedCreditCard] = useState({} as BuyerCreditCard)
  const [selectedAddress, setSelectedAddress] = useState({} as Address)
  const handlePromoCode = (promo: string) => {
    setPromotionCode(promo)
  }
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
      console.log(submitLoading)
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
    }
    initialize()
  }, [order?.ID, order?.ShippingAddressID, payments])
  console.log(addresses)
  const amountDue = useMemo(() => {
    if (!order) return 0
    if (!payments || (payments && !payments.length)) return order.Total
    return order.Total - payments.map((p) => p.Amount).reduceRight((p, c) => p + c)
  }, [order, payments])

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
  return (
    <VStack
      w="100%"
      width="full"
    >
      <Heading as="h2">Payment</Heading>
      <Heading as="h3">{`Amount Due ${formatPrice(amountDue)}`}</Heading>
      <VStack
        w="80%"
        justifyContent="flex-start"
        textAlign="left"
      >
        <Heading
          fontSize="18px"
          width="100%"
          w="full"
          textAlign="left"
          mt="20px"
        >
          Promotional Code
        </Heading>
        {!submittedOrderPromoValid ? (
          <>
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
                id="PromoCode"
                w="100%"
                width="full"
                maxW="200"
                size="sm"
                mr="10px"
                mt="5px"
                placeholder="Enter code"
                onChange={(e) => handlePromoCode(e.target.value)}
              ></Input>
              <Button
                variant="primaryButton"
                mt="0px"
                border="1px"
                size="sm"
                borderRadius="lg"
                onClick={() => onPromotionSubmit()}
              >
                Apply
              </Button>
            </Box>
          </>
        ) : (
          <Text
            w="100%"
            width="full"
            textAlign="left"
            fontSize="16"
            fontWeight="bold"
          >
            Promotion has been applied.
            <HStack>
              <Text>Promotion ID:</Text>
              <Text>{promotion?.ID}</Text>
              <Text>Promotion Code:</Text>
              <Text>{promotion?.Code}</Text>
            </HStack>
          </Text>
        )}
        <Heading
          fontSize="18px"
          width="100%"
          w="full"
          textAlign="left"
          mt="30px"
        >
          Pay with card on file
        </Heading>

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
          {selectedAddress.Street1}...
        </Text>
        <HStack
          width="100%"
          w="full"
        >
          <Link>
            <Text
              textDecoration="underline"
              fontSize="16"
              textAlign="left"
              mr="50px"
              onClick={() => setIsCreditCardModalOpen(true)}
            >
              Change Payment Method
            </Text>
          </Link>
          <Link>
            <Text
              textDecoration="underline"
              fontSize="16"
              textAlign="left"
              onClick={() => setIsNewCreditCardModalOpen(true)}
            >
              Add Payment Method
            </Text>
          </Link>
        </HStack>
      </VStack>

      <Divider />
      <HStack
        w="100%"
        width="full"
        justifyContent="space-between"
      >
        <Button
          type="button"
          onClick={onPrev}
          bgColor="white"
          color="brand.500"
          border="1px"
          borderColor="brand.500"
          leftIcon={<HiChevronDoubleLeft />}
        >
          Edit Billing
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!!amountDue}
          bgColor="brand.500"
          color="white"
          rightIcon={<HiChevronDoubleRight />}
        >
          Review Order
        </Button>
      </HStack>
      <Modal
        isOpen={isCreditCardModalOpen}
        onClose={() => setIsCreditCardModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="full"
          w="100%"
          maxWidth="500px"
        >
          <ModalHeader fontSize="18px">Change Credit Card</ModalHeader>
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
                <VStack fontSize="16">
                  <Text fontSize="16">{creditCard.CardholderName}</Text>
                  <VStack>
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
                  </VStack>
                  <Text>Expires {formatCreditCardDate(creditCard?.ExpirationDate)}</Text>
                </VStack>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isNewCreditCardModalOpen}
        onClose={() => setIsNewCreditCardModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="full"
          w="100%"
          maxWidth="600px"
        >
          <ModalHeader fontSize="18px">Add Credit Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="16px">
            {' '}
            <VStack>
              <VStack width="full">
                <FormControl>
                  <FormLabel fontSize="16px">Name on card</FormLabel>
                  <Input
                    value=""
                    type="text"
                    id={`name_on_card`}
                    name="nameoncard"
                    placeholder="Enter name on card"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="16px">Credit Card Number</FormLabel>
                  <Input
                    value=""
                    type="text"
                    id={`credit_card_number`}
                    name="creditcardnumber"
                    placeholder="Enter credit card number"
                    required
                  />
                </FormControl>
              </VStack>
              <HStack width="full">
                <FormControl>
                  <FormLabel fontSize="16px">Expiration Month</FormLabel>
                  <Input
                    value=""
                    type="text"
                    id={`credit_card_expiration_month`}
                    name="creditcardexpirationmonth"
                    placeholder="Enter credit card expiration month"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="16px">Expiration Year</FormLabel>
                  <Input
                    value=""
                    type="text"
                    id={`credit_card_expiration_year`}
                    name="creditcardexpirationyear"
                    placeholder="Enter credit card expiration year"
                    required
                  />
                </FormControl>
              </HStack>
              <HStack>
                <Button
                  type="button"
                  bgColor="brand.500"
                  color="white"
                >
                  Add Payment Method
                </Button>
                <Button
                  type="button"
                  variant="secondaryButton"
                  onClick={() => setIsNewCreditCardModalOpen(false)}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default OcCheckoutPayment

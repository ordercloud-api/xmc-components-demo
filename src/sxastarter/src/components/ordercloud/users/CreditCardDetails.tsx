/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react'
import { FunctionComponent, useEffect } from 'react'
import { useOcSelector } from 'src/redux/ocStore'
import NextLink from 'next/link'
interface CreditCardDetailProps {
  creditCardId: string
}
const CreditCardDetails: FunctionComponent<CreditCardDetailProps> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))

  useEffect(() => {
    const initialize = async () => {
      if (isAnonymous) return
      // credit card stuff
    }
    initialize()
  }, [isAnonymous])

  return (
    <VStack
      w="100%"
      width="full"
      textAlign="left"
    >
      <Box
        as="form"
        w="100%"
        width="full"
        textAlign="left"
      >
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
        </VStack>
        <ButtonGroup mt="10">
          <Button
            variant="solid"
            bg="brand.500"
            color="white"
          >
            Save Credit Card
          </Button>
          <NextLink
            href="/my-profile/my-credit-cards"
            passHref
          >
            <Button variant="outline">Cancel</Button>
          </NextLink>
        </ButtonGroup>
      </Box>
    </VStack>
  )
}

export default CreditCardDetails

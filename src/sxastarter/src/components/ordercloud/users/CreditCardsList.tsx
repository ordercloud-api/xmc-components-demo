/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Badge,
  CardBody,
  CardHeader,
  Center,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import Card from 'components/card/Card'
import NextLink from 'next/link'
import { BuyerCreditCard, ListPage, Me } from 'ordercloud-javascript-sdk'
import { formatCreditCardDate } from '../../../utils/formatDate'
import Pagination from '../pagination/Pagination'

export default function CreditCardsList() {
  const [isLoading, setIsLoading] = useState(true)
  const [creditCards, setCreditCards] = useState<ListPage<BuyerCreditCard>>()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const initialize = async () => {
      // credit card stuff
      const creditCardList = await Me.ListCreditCards({ sortBy: ['!DateCreated'], page })
      setCreditCards(creditCardList)
      setIsLoading(false)
    }
    initialize()
  }, [page])

  return (
    <>
      {isLoading ? (
        <VStack
          position="fixed"
          justifyContent="center"
          inset="20% 50% 50%"
        >
          <Spinner
            size="xl"
            colorScheme="primary"
            color="primary"
            label="gathering credit cards..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Credit Cards...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {creditCards?.Items.length !== 0 ? (
            <>
              {creditCards.Items.map((creditCard) => (
                <Card
                  variant="outline"
                  layerStyle="interactive.raise"
                  key={creditCard.ID}
                  as={LinkBox}
                  aspectRatio="1.5/1"
                >
                  <CardHeader p={4}>
                    <Badge size="xs">{creditCard.CardType}</Badge>
                    <Text
                      fontSize="xl"
                      fontWeight="300"
                      mt={2}
                    >
                      ending in{' '}
                      <Text
                        as="span"
                        fontWeight="600"
                      >
                        {creditCard.PartialAccountNumber}
                      </Text>
                    </Text>
                  </CardHeader>
                  <LinkOverlay
                    as={NextLink}
                    // TODO: Fix Route for Credit Cart Details Form
                    href={`my-profile/my-credit-cards/`}
                    // href={`my-profile/my-credit-cards-details?creditcardid=${creditCard.ID}`}
                    passHref
                  >
                    <CardBody
                      w="full"
                      width="100%"
                      alignItems="flex-start"
                      p={4}
                    >
                      <Text>
                        <Text
                          as="span"
                          fontWeight="600"
                          color="chakra-subtle-text"
                        >
                          Cardholder:{' '}
                        </Text>
                        {creditCard.CardholderName}
                      </Text>
                      <Text>
                        <Text
                          as="span"
                          fontWeight="600"
                          color="chakra-subtle-text"
                        >
                          Expires:{' '}
                        </Text>
                        {formatCreditCardDate(creditCard.ExpirationDate)}
                      </Text>
                    </CardBody>
                  </LinkOverlay>
                </Card>
              ))}
            </>
          ) : (
            <Text mt="3">No orders have been created.</Text>
          )}
          {creditCards && creditCards.Meta && creditCards.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={creditCards.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

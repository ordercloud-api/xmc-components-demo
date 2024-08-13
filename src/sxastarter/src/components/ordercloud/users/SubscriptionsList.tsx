/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ListPage, Me, Subscription } from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'
import { formatShortDate } from '../../../utils/formatDate'
import Pagination from '../pagination/Pagination'

export default function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<ListPage<Subscription>>()
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  useEffect(() => {
    const initialize = async () => {
      // spending account stuff
      const subscriptionsList = await Me.ListSubscriptions({
        sortBy: ['ID'],
        page,
      })
      setSubscriptions(subscriptionsList)
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
            label="gathering subscriptions..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Subscriptions...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {subscriptions?.Items?.length !== 0 ? (
            <>
              {subscriptions.Items.map((subscription) => (
                <Card
                  aspectRatio="1.5/1"
                  key={subscription.ID}
                >
                  <CardHeader p={4}>
                    <Text
                      fontSize="xl"
                      fontWeight="300"
                      mt={2}
                    >
                      {subscription.ID}
                    </Text>
                    {subscription?.xp?.SubscriptionLevel && (
                      <Badge size="xs">{subscription?.xp?.SubscriptionLevel}</Badge>
                    )}
                  </CardHeader>
                  <CardBody
                    as={VStack}
                    alignItems="flex-start"
                  >
                    <Text>
                      <Text
                        as="span"
                        fontWeight="600"
                        color="chakra-subtle-text"
                      >
                        Expires:{' '}
                      </Text>
                      {formatShortDate(subscription.EndDate)}
                    </Text>
                    {subscription.NextOrderDate && (
                      <Text>
                        <Text
                          as="span"
                          fontWeight="600"
                          color="chakra-subtle-text"
                        >
                          Next Order Date:{' '}
                        </Text>
                        {formatShortDate(subscription.NextOrderDate)}
                      </Text>
                    )}
                    {subscription.Frequency && subscription.Interval && (
                      <Text>
                        <Text
                          as="span"
                          fontWeight="600"
                          color="chakra-subtle-text"
                        >
                          Frequency:{' '}
                        </Text>
                        {subscription.Frequency} {subscription.Interval}
                      </Text>
                    )}

                    <NextLink
                      style={{ marginLeft: 'auto' }}
                      href={`my-profile/my-subscriptions-details?subscriptionid=${subscription.ID}`}
                      passHref
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        mt="3"
                      >
                        Edit
                      </Button>
                    </NextLink>
                  </CardBody>
                </Card>
              ))}
            </>
          ) : (
            <Text mt="3">No subscriptions have been created.</Text>
          )}
          {subscriptions && subscriptions.Meta && subscriptions.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={subscriptions.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

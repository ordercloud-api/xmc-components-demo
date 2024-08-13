/* eslint-disable @typescript-eslint/no-unused-vars */
import { Center, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { ListPage, Me, Order } from 'ordercloud-javascript-sdk'
import React, { useEffect, useState } from 'react'
import QuoteCard from '../cards/QuoteCard'
import Pagination from '../pagination/Pagination'

export default function QuotesList() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const initialize = async () => {
      // quotes stuff
      const quotesList = await Me.ListOrders({
        filters: { Status: 'AwaitingApproval' },
        sortBy: ['!DateSubmitted'],
        page
      })
      setOrders(quotesList)
      setIsLoading(false)
    }
    initialize()
  }, [page])

  const [orders, setOrders] = useState<ListPage<Order>>()

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
            label="gathering quotes..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Quotes...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {orders?.Items?.length !== 0 ? (
            <>
              {orders.Items.map((order) => (
                <React.Fragment key={order.ID}>
                  <QuoteCard order={order} />
                </React.Fragment>
              ))}
            </>
          ) : (
            <Text mt="3">No quotes have been created.</Text>
          )}
             {orders && orders.Meta && orders.Meta.TotalPages > 1 && (
            <Center>
              <Pagination page={page} totalPages={orders.Meta.TotalPages} onChange={setPage} />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

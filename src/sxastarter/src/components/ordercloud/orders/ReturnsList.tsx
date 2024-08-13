import { Center, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { ListPage, Me, OrderReturn, OrderReturns } from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'

import React from 'react'
import OrderReturnCard from '../cards/OrderReturnCard'
import Pagination from '../pagination/Pagination'

export default function OrdersList() {
  const [isLoading, setIsLoading] = useState(true)
  const [orderReturns, setOrderReturns] = useState<ListPage<OrderReturn>>()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const initialize = async () => {
      // have to filter by orders only visible to buyer user
      const orders = await Me.ListOrders({
        filters: { IsSubmitted: true },
      })
      if (!orders.Items.length) {
        setOrderReturns(undefined)
      } else {
        const orderFilter = orders.Items.map((o) => o.ID).join('|')
        const orderReturnsList = await OrderReturns.List({
          filters: { OrderID: orderFilter },
          sortBy: ['!DateSubmitted'],
          page,
        })
        setOrderReturns(orderReturnsList)
        setIsLoading(false)
      }
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
            label="gathering returns..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Checking Returns...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {orderReturns?.Items?.length !== 0 ? (
            <>
              {orderReturns.Items.map((or) => (
                <React.Fragment key={or.ID}>
                  <OrderReturnCard orderReturn={or} />
                </React.Fragment>
              ))}
            </>
          ) : (
            <Text mt="3">No order returns have been created.</Text>
          )}
          {orderReturns && orderReturns.Meta && orderReturns.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={orderReturns.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

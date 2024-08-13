import {
  ButtonGroup,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Center,
} from '@chakra-ui/react'
import { CostCenter, ListPage, Me, Order } from 'ordercloud-javascript-sdk'
import { useCallback, useEffect, useState } from 'react'

import React from 'react'
import OrderCard from '../cards/OrderCard'
import Pagination from '../pagination/Pagination'

export default function OrdersList() {
  const [orders, setOrders] = useState<ListPage<Order>>()
  const [costCenters, setCostCenters] = useState([] as CostCenter[])
  const [selectedCostCenter, setSelectedCostCenter] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const getCostCenters = useCallback(async () => {
    const costCenters = await Me.ListCostCenters()
    setCostCenters(costCenters.Items)
  }, [])

  const getOrders = useCallback(async () => {
    setIsLoading(true)
    const filters = {
      IsSubmitted: true,
      Status: status || undefined,
      'xp.CostCenter.ID': selectedCostCenter || undefined,
    }
    const ordersList = await Me.ListOrders({
      filters: filters,
      sortBy: ['!DateSubmitted'],
      page,
    })
    setOrders(ordersList)
    setIsLoading(false)
  }, [selectedCostCenter, status, page])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrders()
    getCostCenters()
  }, [getCostCenters, getOrders])

  useEffect(() => {
    getOrders()
  }, [selectedCostCenter, status, getOrders])

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
            label="gathering orders..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Orders...</Text>
        </VStack>
      ) : (
        <>
          <HStack
            w="full"
            mb={3}
            pb={3}
          >
            <ButtonGroup
              ml="auto"
              size="sm"
              gap={3}
            >
              <FormControl>
                <FormLabel>Cost Center</FormLabel>
                <Select
                  id="CostCenter"
                  onChange={(e) => setSelectedCostCenter(e.target.value)}
                  value={selectedCostCenter}
                >
                  <option
                    key="any"
                    value=""
                  >
                    Any
                  </option>
                  {costCenters?.map((c) => (
                    <option
                      key={c.ID}
                      value={c.ID}
                    >
                      {c.Name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  id="Status"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value="">Any</option>
                  <option value="Declined">Declined</option>
                  <option value="Open">Open</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </Select>
              </FormControl>
            </ButtonGroup>
          </HStack>
          <SimpleGrid
            gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
            gap={3}
            w="full"
          >
            {orders?.Items?.length !== 0 ? (
              <>
                {orders.Items.map((order) => (
                  <React.Fragment key={order.ID}>
                    <OrderCard order={order} />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <Text mt="3">No orders to show.</Text>
            )}
          </SimpleGrid>
          {orders && orders.Meta && orders.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={orders.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </>
      )}
    </>
  )
}

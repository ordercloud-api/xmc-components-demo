/* eslint-disable @typescript-eslint/no-unused-vars */

import { Center, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { Address, ListPage, Me } from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'

import React from 'react'
import AddressCard from '../cards/AddressCard'
import Pagination from '../pagination/Pagination'

export default function AddressesList() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const initialize = async () => {
      // address stuff
      const addressList = await Me.ListAddresses({ sortBy: ['!DateCreated'], page })
      setAddresses(addressList)
      setIsLoading(false)
      // const address =
      //   addressList.Items.find((a) => a.ID === order.ShippingAddressID) ??
      //   addressList.Items[0]
      // setSelectedAddress(address)
    }
    initialize()
  }, [page])

  const [addresses, setAddresses] = useState<ListPage<Address>>()

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
            label="gathering addresses..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Addresses...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {addresses?.Items?.length !== 0 ? (
            <>
              {addresses.Items.map((address) => (
                <React.Fragment key={address.ID}>
                  <AddressCard
                    addressCard
                    address={address}
                  />
                </React.Fragment>
              ))}
            </>
          ) : (
            <Text mt="3">No addresses are set up.</Text>
          )}
          {addresses && addresses.Meta && addresses.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={addresses.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

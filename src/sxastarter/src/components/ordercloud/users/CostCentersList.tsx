/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  CardBody,
  CardHeader,
  Center,
  LinkBox,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import Card from 'components/card/Card'
import { CostCenter, ListPage, Me } from 'ordercloud-javascript-sdk'
import Pagination from '../pagination/Pagination'

export default function CostCentersList() {
  const [isLoading, setIsLoading] = useState(true)
  const [costCenters, setCostCenters] = useState<ListPage<CostCenter>>()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const initialize = async () => {
      const costCentersList = await Me.ListCostCenters({page})
      setCostCenters(costCentersList)
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
            label="gathering cost centers..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Cost Centers...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {costCenters?.Items?.length !== 0 ? (
            <>
              {costCenters.Items.map((costCenter) => (
                <Card
                  variant="outline"
                  layerStyle="interactive.raise"
                  key={costCenter.ID}
                  as={LinkBox}
                  aspectRatio="1.5/1"
                >
                  <CardHeader p={4}>
                    <Text
                      fontSize="xl"
                      fontWeight="300"
                      mt={2}
                    >
                      {costCenter.Name}
                    </Text>
                  </CardHeader>
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
                        ID:{' '}
                      </Text>
                      {costCenter.ID}
                    </Text>
                    {costCenter?.Description && (
                      <Text>
                        <Text
                          as="span"
                          fontWeight="600"
                          color="chakra-subtle-text"
                        >
                          Description:{' '}
                        </Text>
                        {costCenter.ID}
                      </Text>
                    )}
                  </CardBody>
                </Card>
              ))}
            </>
          ) : (
            <Text mt="3">No cost centers have been assigned to this user.</Text>
          )}
          {costCenters && costCenters.Meta && costCenters.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={costCenters.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

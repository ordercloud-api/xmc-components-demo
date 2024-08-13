/* eslint-disable @typescript-eslint/no-unused-vars */

import { CardBody, Center, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { ListPage, Me, SpendingAccount } from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'

import Card from 'components/card/Card'
import { formatShortDate } from '../../../utils/formatDate'
import Pagination from '../pagination/Pagination'

export default function SpendingAccountsList() {
  const [spendingAccounts, setSpendingAccount] = useState<ListPage<SpendingAccount>>()
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const initialize = async () => {
      // spending account stuff
      const spendingaccountList = await Me.ListSpendingAccounts({
        sortBy: ['Name'],
        page,
      })
      setSpendingAccount(spendingaccountList)
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
            label="gathering spending accounts..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering spending accounts...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {spendingAccounts?.Items.length !== 0 ? (
            <>
              {spendingAccounts.Items.map((spendingAccount) => (
                <Card
                  key={spendingAccount.ID}
                  // as={LinkBox}
                  aspectRatio="1.5/1"
                >
                  {/* <LinkOverlay
                    as={NextLink}
                    href={`my-profile/my-spending-account-details?spendingaccountid=${spendingAccount.ID}`}
                    passHref
                  > */}
                  <CardBody
                    w="full"
                    width="100%"
                    alignItems="flex-start"
                    p={4}
                  >
                    {spendingAccount.Name && (
                      <Text
                        fontSize="xl"
                        mb={4}
                        variant="section"
                      >
                        {spendingAccount.Name}
                      </Text>
                    )}
                    <Text>
                      <Text
                        as="span"
                        fontWeight="600"
                        color="chakra-subtle-text"
                      >
                        Current Balance:{' '}
                      </Text>
                      {spendingAccount.Balance}
                    </Text>
                    <Text>
                      <Text
                        as="span"
                        fontWeight="600"
                        color="chakra-subtle-text"
                      >
                        Expires:{' '}
                      </Text>
                      {formatShortDate(spendingAccount.EndDate)}
                    </Text>
                  </CardBody>
                  {/* <CardFooter
            justifyContent="flex-end"
            gap={2}
            px="3"
          >
            <Button
              size="xs"
              variant="ghost"
            >
              Remove
            </Button>
          </CardFooter> */}
                  {/* </LinkOverlay> */}
                </Card>
              ))}
            </>
          ) : (
            <Text mt="3">No spending accounts are set up.</Text>
          )}
          {spendingAccounts && spendingAccounts.Meta && spendingAccounts.Meta.TotalPages > 1 && (
            <Center>
              <Pagination
                page={page}
                totalPages={spendingAccounts.Meta.TotalPages}
                onChange={setPage}
              />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

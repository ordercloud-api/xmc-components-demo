/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { Me, MeUser } from 'ordercloud-javascript-sdk'
import { useCallback, useEffect, useState } from 'react'
import { useOcSelector } from 'src/redux/ocStore'
import formatPoints from 'src/utils/formatPoints'

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState([] as MeUser)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalFavorites, setFavorites] = useState(0)
  const [totalCreditCards, setCreditCards] = useState(0)
  const [totalAddresses, setAddresses] = useState(0)
  // const [spendingAccount, setSpendingAccount] = useState({} as SpendingAccount)
  const [totalAvailablePoints, setAvailablePoints] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))

  const initData = useCallback(async () => {
    const ordersList = await Me.ListOrders()
    const favoritesList = await Me.ListProductCollections()
    const creditcardList = await Me.ListCreditCards()
    const addressesList = await Me.ListAddresses()
    const account = await Me.ListSpendingAccounts()
    if (account.Items.length) {
      // setSpendingAccount(account.Items[0])
      setAvailablePoints(account.Items[0].Balance)
    }

    const userdetails: MeUser = await Me.Get()
    setUserProfile(userdetails)
    setTotalOrders(ordersList.Meta.TotalCount)
    setFavorites(favoritesList.Meta.TotalCount)
    setCreditCards(creditcardList.Meta.TotalCount)
    setAddresses(addressesList.Meta.TotalCount)
  }, [])

  const dashboardData = [
    { label: 'Total orders', value: totalOrders, slug: 'my-orders' },
    { label: 'Total favorites', value: totalFavorites, slug: 'my-favorites' },
    { label: 'Available credit cards', value: totalCreditCards, slug: 'my-credit-cards' },
    { label: 'Available addresses', value: totalAddresses, slug: 'my-addresses' },
    {
      label: 'Member points',
      value: formatPoints(totalAvailablePoints),
      slug: 'my-spending-accounts',
    },
  ]

  useEffect(() => {
    if (isAnonymous) return
    // profile stuff
    initData()
  }, [initData, isAnonymous])

  return (
    <VStack
      w="full"
      alignItems="flex-start"
      gap={6}
    >
      <SimpleGrid
        w="full"
        gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
        gap={3}
      >
        {dashboardData.map((item, idx) => (
          <Card
            layerStyle="interactive.raise"
            key={idx}
            as={LinkBox}
          >
            <NextLink
              passHref
              href={`my-profile/${item.slug}`}
            >
              <LinkOverlay>
                <CardBody
                  display="flex"
                  alignItems={{ base: 'center', lg: 'flex-start' }}
                  flexDirection={{ base: 'row', lg: 'column' }}
                  justifyContent={{ base: 'space-between', lg: 'flex-start' }}
                >
                  <Text fontSize="sm">{item.label}:</Text>
                  <Heading
                    color="primary"
                    fontWeight="300"
                    size="xl"
                  >
                    {item.value}
                  </Heading>
                </CardBody>
              </LinkOverlay>
            </NextLink>
          </Card>
        ))}
      </SimpleGrid>

      <VStack
        maxW="xl"
        as="form"
        alignItems="flex-start"
        gap={3}
        w="full"
      >
        <Stack
          w="full"
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              isRequired
              name="FirstName"
              placeholder="first name"
              value={userProfile.FirstName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input
              isRequired
              name="LastName"
              placeholder="last name"
              value={userProfile.LastName}
            />
          </FormControl>
        </Stack>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            name="Username"
            isRequired
            placeholder="user name"
            value={userProfile.Username}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="Email"
            isRequired
            type="email"
            placeholder="email address"
            value={userProfile.Email}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input
            name="Phone"
            isRequired
            type="tel"
            placeholder="phone number"
            value={userProfile.Phone}
          />
        </FormControl>
        <ButtonGroup>
          <Button size="sm">Save</Button>
          <NextLink
            href="/my-profile"
            passHref
          >
            <Button
              as="a"
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
          </NextLink>
        </ButtonGroup>
      </VStack>
    </VStack>
  )
}

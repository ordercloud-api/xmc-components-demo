/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Button,
  Card,
  Hide,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MdMenu } from 'react-icons/md'
import { VStack } from '@chakra-ui/react'
import { useOcSelector } from 'src/redux/ocStore'
import { useMemo } from 'react'

const userTabsData = [
  { title: 'My Profile', slug: '' },
  { title: 'My Orders', slug: 'my-orders' },
  { title: 'My Quotes', slug: 'my-quotes' },
  { title: 'My Returns', slug: 'my-returns' },
  { title: 'My Favorites', slug: 'my-favorites' },
  { title: 'My Addresses', slug: 'my-addresses' },
  { title: 'My Subscriptions', slug: 'my-subscriptions' },
  { title: 'My Credit Card', slug: 'my-credit-cards' },
  { title: 'My Spending Accounts', slug: 'my-spending-accounts' },
  { title: 'My Cost Centers', slug: 'my-cost-centers' },
  { title: 'My Orders to Approve', slug: 'my-order-approvals'}
]

export default function UserTabs() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useOcSelector((s: any) => ({
    user: s.ocUser.user,
  }))

  const filteredUserTabsData = useMemo(()=> {
    if(!user?.isApprovalAdmin){
      return userTabsData.filter(t => t.slug !== "my-order-approvals")
    } else {
    return userTabsData}
  }, [user])
  
  return (
    <>
      <Show below="lg">
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            minW="auto"
            leftIcon={<MdMenu />}
          >
            My Profile
          </MenuButton>
          <MenuList zIndex="2">
            {filteredUserTabsData.map((item, index) => (
              <MenuItem key={index}>
                <NextLink
                  href={`my-profile/${item.slug}`}
                  passHref
                >
                  <Button
                    w="full"
                    isActive={router.query.path.includes(item.slug)}
                    variant="link"
                    as="a"
                  >
                    {item.title}
                  </Button>
                </NextLink>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Show>
      <Hide below="lg">
        <Card
          shadow="unset"
          w={{ lg: 200, xl: 275 }}
          p={3}
        >
          <List
            as={VStack}
            alignItems="stretch"
            gap={1}
          >
            {filteredUserTabsData.map((item, index) => (
              <ListItem key={index}>
                <NextLink
                  href={`my-profile/${item.slug}`}
                  passHref
                >
                  <Button
                    w="full"
                    isActive={router.query.path.includes(item.slug)}
                    variant="navigation"
                    as="a"
                  >
                    {item.title}
                  </Button>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </Card>
      </Hide>
    </>
  )
}

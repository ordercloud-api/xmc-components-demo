import {
  Box,
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Select,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { ApprovalRule, ApprovalRules, CostCenter, ListPage, Me, Order, User, Users } from 'ordercloud-javascript-sdk'
import { useCallback, useEffect, useState } from 'react'

import OrderCard from '../cards/OrderCard'
import Pagination from '../pagination/Pagination'
import { OrderUserApprovalModal } from './OrderUserApprovalModal'
import { useOcSelector } from 'src/redux/ocStore'

export default function OrderApprovalsList() {
  const [page, setPage] = useState(1)
  const [costCenters, setCostCenters] = useState([] as CostCenter[])
  const [users, setUsers] = useState([] as User[])
  const [selectedCostCenter, setSelectedCostCenter] = useState('')
  const [orderApprovals, setOrderApprovals] = useState<ListPage<Order>>()
  const [approvalRule, setApprovalRule] = useState<ApprovalRule>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useOcSelector((s: any) => ({
    user: s.ocUser.user,
  }))

  const getCostCenters = useCallback(async () => {
    const costCenters = await Me.ListCostCenters()
    setCostCenters(costCenters.Items)
  }, [])

  const getBuyerUsers = useCallback(async () => {
    const userList = await Users.List(user.Buyer.ID)
    setUsers(userList.Items.filter((u) => u.ID !== user.ID))
  }, [user])

  const getApprovalRule = useCallback(async () => {
    // hardcoding approval rule ID for now
    const result = await ApprovalRules.Get(user.Buyer.ID, 'interactivepro-approval')
    setApprovalRule(result)
  }, [user])

  const getOrders = useCallback(async () => {
    const filters = {
      'xp.CostCenter.ID': selectedCostCenter || undefined,
    }
    const ordersList = await Me.ListApprovableOrders({
      filters: filters,
      sortBy: ['!DateSubmitted'],
      page,
    })
    setOrderApprovals(ordersList)
  }, [selectedCostCenter, page])

  useEffect(() => {
    getOrders()
    getCostCenters()
    getBuyerUsers()
    getApprovalRule()
  }, [getApprovalRule, getBuyerUsers, getCostCenters, getOrders])

  useEffect(() => {
    getOrders()
  }, [selectedCostCenter, getOrders])

  const manageUserApprovalsDisclosure = useDisclosure()

  return (
    <VStack
      w="100%"
      width="full"
      textAlign="left"
    >
      <HStack
        w="full"
        mb={3}
        pb={3}
      >
        <Button
          variant="solid"
          onClick={() => manageUserApprovalsDisclosure.onOpen()}
        >
          Manage Approval Rules
        </Button>
        <ButtonGroup
          ml="auto"
          size="sm"
          gap={3}
        >
          <FormControl>
            <FormLabel>Cost Center</FormLabel>
            <Select
              id="CostCenterSelect"
              onChange={(e) => setSelectedCostCenter(e.target.value)}
              value={selectedCostCenter}
            >
              <option value="">Any</option>
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
        </ButtonGroup>
      </HStack>
      <Grid
        as="section"
        templateColumns="repeat(4, 1fr)"
        templateRows="(4, 1fr)"
        gap={3}
        w="full"
        width="100%"
        mt="3"
      >
        {orderApprovals?.Items.length == 0 && (
          <Box
            display="inline-block"
            mt="5"
          >
            <Text mt="3">No orders awaiting approval.</Text>
          </Box>
        )}
        {orderApprovals?.Items.map((order) => (
          <GridItem
            colSpan={1}
            rowSpan={1}
            w="full"
            width="100%"
            key={order.ID}
          >
            <OrderCard
              order={order}
              approvable={true}
            />
          </GridItem>
        ))}
        {orderApprovals && orderApprovals.Meta && orderApprovals.Meta.TotalPages > 1 && (
          <Center>
            <Pagination
              page={page}
              totalPages={orderApprovals.Meta.TotalPages}
              onChange={setPage}
            />
          </Center>
        )}
      </Grid>
      <OrderUserApprovalModal
        disclosure={manageUserApprovalsDisclosure}
        users={users}
        approvalRule={approvalRule}
        buyerID={user?.Buyer.ID}
        onUpdateUsers={getBuyerUsers}
        onUpdateApprovalRule={getApprovalRule}
      />
    </VStack>
  )
}

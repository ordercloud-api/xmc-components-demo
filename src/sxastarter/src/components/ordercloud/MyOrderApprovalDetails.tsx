import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  HStack,
  Heading,
  Hide,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { useRouter } from 'next/router'
import {
  Address,
  LineItem,
  LineItems,
  Order,
  Orders,
} from 'ordercloud-javascript-sdk'
import { useEffect, useState, useMemo } from 'react'
import { formatDate } from 'src/utils/formatDate'
import formatPrice from 'src/utils/formatPrice'
import AddressCard from './cards/AddressCard'
import UserTabs from './users/UserTabs'
import { OrderApprovalModal } from './OrderApprovalModal'

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const router = useRouter()
  const [order, setOrder] = useState(null as Order)
  const [lineItems, setLineItems] = useState([] as LineItem[])
  const [billingAddress, setBillingAddress] = useState(null as Address)
  const { sitecoreContext } = useSitecoreContext()
  const phKey = `order-details-${props.params.DynamicPlaceholderId}`
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}
  const formatCost = (cost: number) => {
    if (order?.xp?.PaymentMethodType === 'Points') {
      return cost
    }
    return formatPrice(cost)
  }

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    }
  }

  useEffect(() => {
    async function initialize() {
      const orderID = router.query.orderid as string
      const order = await Orders.Get('All', orderID)
      const billingAddress = order.BillingAddress
      const lineItems = await LineItems.List('All', orderID)
      setOrder(order)
      setBillingAddress(billingAddress)
      setLineItems(lineItems.Items)
    }
    initialize()
  }, [router.query.orderid])

  const awaitingApproval = useMemo(() => {
    return !!order && order.Status === 'AwaitingApproval'
  }, [order])

  const approveModalDisclosure = useDisclosure()
  const declineModalDisclosure = useDisclosure()

  return (
    <>
      <Container
        as={VStack}
        alignItems="flex-start"
        maxW="container.2xl"
      >
        <Placeholder
          name={phKey}
          rendering={props.rendering}
        />
        <SimpleGrid
          className="component-content"
          style={backgroundStyle}
          w="full"
          gridTemplateColumns={{ md: '1fr 1fr', lg: '1fr auto 1fr' }}
          gap={6}
        >
          <Hide below="lg">
            <UserTabs />
          </Hide>
          {order && (
            <VStack width="full">
              <HStack
                w="full"
                mb={3}
                pb={3}
                borderBottom="1px solid"
                borderColor="chakra-border-color"
              >
                <Heading
                  w="full"
                  as="h1"
                  variant="section"
                >
                  Order Details
                </Heading>
                <ButtonGroup
                  ml="auto"
                  size="sm"
                  gap={3}
                >
                  {awaitingApproval && (
                    <>
                      <Button
                        variant="solid"
                        onClick={approveModalDisclosure.onOpen}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={declineModalDisclosure.onOpen}
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  <Hide above="lg">
                    <UserTabs />
                  </Hide>
                </ButtonGroup>
              </HStack>
              <SimpleGrid
                as="dl"
                gridTemplateColumns={{ lg: '1fr 2fr' }}
                gap={3}
                w="full"
              >
                <Text
                  as="dt"
                  color="chakra-subtle-text"
                >
                  Order Number:
                </Text>
                <Text as="dd">{order?.ID}</Text>
                <Text
                  as="dt"
                  color="chakra-subtle-text"
                >
                  Order Placed:
                </Text>
                <Text as="dd">
                  {formatDate(order.DateSubmitted)} by {order.FromUser.FirstName}{' '}
                  {order.FromUser.LastName}
                </Text>
                <Text
                  as="dt"
                  color="chakra-subtle-text"
                >
                  Billing Address:
                </Text>
                <Text as="dd">
                  <AddressCard
                    address={billingAddress}
                    fontSize="sm"
                  />
                </Text>
              </SimpleGrid>
              <VStack
                maxW="full"
                alignItems="start"
                w="full"
              >
                <Heading
                  w="full"
                  as="h3"
                  mb={3}
                  pb={3}
                  variant="section"
                  borderBottom="1px solid"
                  borderColor="chakra-border-color"
                >
                  Line Items
                </Heading>
                <TableContainer
                  maxH="35vh"
                  overflowY="auto"
                >
                  <Table
                    variant="striped"
                    size="sm"
                  >
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th>Quantity</Th>
                        <Th>Unit Price</Th>
                        <Th>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {lineItems.map((lineItem: LineItem) => (
                        <Tr key={lineItem.ID}>
                          <Td>
                            <VStack alignItems="flex-start">
                              <Text fontWeight="600">{lineItem.Product.Name}</Text>
                              <Text
                                fontSize="xs"
                                maxW="xl"
                                whiteSpace="pre-wrap"
                              >
                                {lineItem.Product.Description}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>{lineItem.Quantity}</Td>
                          <Td>{formatCost(lineItem.UnitPrice)}</Td>
                          <Td>{formatCost(lineItem.LineTotal)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            </VStack>
          )}
          <Card
            shadow="unset"
            borderLeft="1px solid"
            borderLeftColor="chakra-border-color"
            w={{ lg: 200, xl: '350px' }}
          >
            <CardHeader>
              <Heading
                variant="section"
                mb={3}
                pb={3}
                borderBottom="1px solid"
                borderColor="chakra-border-color"
              >
                Order Summary
              </Heading>
            </CardHeader>
            <CardBody
              flex="none"
              alignItems="flex-start"
              pt="0"
              display="grid"
              as="dl"
              gridTemplateColumns={{ lg: '1fr auto' }}
              w="full"
              gap={3}
            >
              {/* Payment Method */}
              {order?.xp?.PaymentMethodType && (
                <>
                  <Text
                    as="dt"
                    color="chakra-subtle-text"
                  >
                    Payment Method:
                  </Text>
                  <Text as="dd">{order?.xp?.PaymentMethodType}</Text>
                </>
              )}
              {/* Subtotal */}
              <Text
                as="dt"
                color="chakra-subtle-text"
              >
                Subtotal:
              </Text>
              <Text as="dd">{formatCost(order?.Subtotal)}</Text>
              {/* Points */}
              {order?.xp?.pointsvalue && (
                <>
                  <Text
                    as="dt"
                    color="chakra-subtle-text"
                  >
                    Points redemption:
                  </Text>
                  <Text as="dd">{formatCost(order?.xp?.pointsvalue)}</Text>
                </>
              )}
              {/* Promotion Discount */}
              {order?.PromotionDiscount !== 0 && (
                <>
                  <Text
                    as="dt"
                    color="chakra-subtle-text"
                  >
                    Promotion Discount:
                  </Text>
                  <Text as="dd">{formatPrice(order?.PromotionDiscount)}</Text>
                </>
              )}
              {/* Tax */}
              <Text
                as="dt"
                color="chakra-subtle-text"
              >
                Tax:
              </Text>
              <Text as="dd">{formatPrice(order?.TaxCost)}</Text>
              {/* Tip */}
              {order?.xp?.tip && (
                <>
                  <Text
                    as="dt"
                    color="chakra-subtle-text"
                  >
                    Tip:
                  </Text>
                  <Text as="dd">{formatPrice(order?.PromotionDiscount)}</Text>
                </>
              )}
              {/* Shipping */}
              {order?.ShippingCost !== 0 && (
                <>
                  <Text
                    as="dt"
                    color="chakra-subtle-text"
                  >
                    Shipping:
                  </Text>
                  <Text as="dd">{formatCost(order?.ShippingCost)}</Text>
                </>
              )}
              {/* Total */}
              <Text
                as="dt"
                color="chakra-subtle-text"
                fontWeight="bold"
              >
                Total:
              </Text>
              <Text
                fontWeight="bold"
                as="dd"
              >
                {formatCost(order?.Total)}
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>

      <OrderApprovalModal
        order={order}
        type="approve"
        disclosure={approveModalDisclosure}
      />

      <OrderApprovalModal
        order={order}
        type="decline"
        disclosure={declineModalDisclosure}
      />
    </>
  )
}

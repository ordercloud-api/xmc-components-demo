import React, { useEffect, useState } from 'react'
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import {
  VStack,
  HStack,
  Container,
  Heading,
  Text,
  CardHeader,
  CardBody,
  Divider,
  Card,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
  Box,
} from '@chakra-ui/react'
import { Address, LineItem, LineItems, Order, Orders } from 'ordercloud-javascript-sdk'
import { useRouter } from 'next/router'
import { formatDate } from 'src/utils/formatDate'
import AddressCard from './cards/AddressCard'
import formatPrice from 'src/utils/formatPrice'
import UserTabs from './users/UserTabs'

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
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
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

  return (
    <VStack
      className={`component container ${styles}`}
      as="section"
      w="100%"
      width="full"
      pt="40px"
      pb="40px"
      mt="30px"
    >
      <Heading as="h1">Order Details</Heading>
      <HStack
        as="section"
        w="100%"
        width="full"
        className="component-content"
        style={backgroundStyle}
      >
        <Container
          maxW="container.xl"
          w="100%"
          width="full"
        >
          <Placeholder
            name={phKey}
            rendering={props.rendering}
          />
          <HStack alignItems="flex-start">
            <UserTabs />
            {order && (
              <VStack width="full">
                <HStack
                  width="full"
                  justifyContent="space-between"
                  alignItems="top"
                >
                  <VStack
                    alignItems="start"
                    maxW="1280px"
                  >
                    <HStack>
                      <Text>Order Number:</Text>
                      <Text
                        fontWeight="bold"
                        color="PrimaryButtonBG"
                      >
                        {order?.ID}
                      </Text>
                    </HStack>
                    <Text marginBottom={10}>
                      Placed on {formatDate(order.DateSubmitted)} by {order.FromUser.FirstName}{' '}
                      {order.FromUser.LastName}
                    </Text>
                    <VStack
                      alignItems="start"
                      marginBottom={10}
                    >
                      <Text
                        fontWeight="bold"
                        color="PrimaryButtonBG"
                      >
                        Billing Address
                      </Text>
                      <AddressCard
                        address={billingAddress}
                        fontSize="16px"
                      />
                    </VStack>
                  </VStack>
                  <Card
                    variant="elevated"
                    minWidth="400px"
                  >
                    <CardHeader>
                      <Text
                        fontWeight="bold"
                        color="PrimaryButtonBG"
                      >
                        Order Summary
                      </Text>
                      <Divider marginY={3} />
                    </CardHeader>
                    <CardBody pt="0px">
                      <VStack
                        w="100%"
                        width="full"
                      >
                        <HStack
                          w="100%"
                          width="full"
                        >
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text>Paid with: </Text>
                          </Box>
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text float="right">{order?.xp?.PaymentMethodType}</Text>
                          </Box>
                        </HStack>

                        <HStack
                          w="100%"
                          width="full"
                        >
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text>Subtotal: </Text>
                          </Box>
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text float="right">{formatCost(order?.Subtotal)}</Text>
                          </Box>
                        </HStack>
                        {order?.xp?.pointsvalue && (
                          <HStack
                            w="100%"
                            width="full"
                          >
                            <Box
                              w="100%"
                              width="full"
                            >
                              <Text>Points redemption: </Text>
                            </Box>
                            <Box
                              w="100%"
                              width="full"
                            >
                              <Text float="right"> - {formatCost(order?.xp?.pointsvalue)}</Text>
                            </Box>
                          </HStack>
                        )}
                        <HStack
                          w="100%"
                          width="full"
                        >
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text>Promotion Discount: </Text>
                          </Box>
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text float="right">{formatPrice(order?.PromotionDiscount)}</Text>
                          </Box>
                        </HStack>
                        <HStack
                          w="100%"
                          width="full"
                        >
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text>Tax: </Text>
                          </Box>
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text float="right">{formatPrice(order?.TaxCost)}</Text>
                          </Box>
                        </HStack>
                        {order?.xp?.tip && (
                          <HStack
                            w="100%"
                            width="full"
                          >
                            <Box
                              w="100%"
                              width="full"
                            >
                              <Text>Tip: </Text>
                            </Box>
                            <Box
                              w="100%"
                              width="full"
                            >
                              <Text float="right">{formatCost(order?.xp?.tip)}</Text>
                            </Box>
                          </HStack>
                        )}
                        {order?.ShippingCost && (
                          <HStack
                            w="100%"
                            width="full"
                          >
                            <Box
                              w="100%"
                              width="full"
                            >
                              <Text>Shipping: </Text>
                            </Box>
                            <Box
                              w="100%"
                              width="full"
                            >
                              <Text float="right">{formatCost(order?.ShippingCost)}</Text>
                            </Box>
                          </HStack>
                        )}
                        <Divider marginY={3} />
                        <HStack
                          w="100%"
                          width="full"
                        >
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text fontWeight="bold">Total: </Text>
                          </Box>
                          <Box
                            w="100%"
                            width="full"
                          >
                            <Text
                              float="right"
                              fontWeight="bold"
                            >
                              {formatCost(order?.Total)}
                            </Text>
                          </Box>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </HStack>
                <VStack
                  alignItems="start"
                  marginBottom={10}
                  mt={10}
                >
                  <Text
                    fontWeight="bold"
                    color="PrimaryButtonBG"
                  >
                    Line Items
                  </Text>
                  <TableContainer>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>
                            <Text fontSize="12px">Product</Text>
                          </Th>
                          <Th>
                            <Text fontSize="12px">Quantity</Text>
                          </Th>
                          <Th>
                            <Text fontSize="12px">Unit Price</Text>
                          </Th>
                          <Th>
                            <Text fontSize="12px">Total</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {lineItems.map((lineItem) => (
                          <Tr key={lineItem.ID}>
                            <Td>
                              <VStack
                                textAlign="left"
                                alignContent="flex-start"
                              >
                                <Text
                                  width="full"
                                  w="100%"
                                  minWidth="500px"
                                  fontSize="14px"
                                >
                                  {lineItem.Product.Name}
                                </Text>
                                <Text
                                  as="span"
                                  display="inline-block"
                                  className="white-space"
                                  width="full"
                                  w="100%"
                                  minWidth="500px"
                                  fontSize="12px"
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
          </HStack>
        </Container>
      </HStack>
    </VStack>
  )
}

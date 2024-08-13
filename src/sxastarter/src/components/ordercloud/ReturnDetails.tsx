import {
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  HStack,
  Heading,
  Hide,
  SimpleGrid,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { useRouter } from 'next/router'
import {
  LineItem,
  LineItems,
  OrderReturn,
  OrderReturnItem,
  OrderReturns,
} from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'
import { formatDate } from 'src/utils/formatDate'
import formatPrice from 'src/utils/formatPrice'
import UserTabs from './users/UserTabs'

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

interface ExtendedReturnItem extends OrderReturnItem {
  LineItem?: LineItem
}

export const Default = (props: ComponentProps): JSX.Element => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orderReturn, setOrderReturn] = useState(null as OrderReturn)
  const [itemsToReturn, setItemsToReturn] = useState(null as ExtendedReturnItem[])
  const { sitecoreContext } = useSitecoreContext()
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  const phKey = `order-details-${props.params.DynamicPlaceholderId}`
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}
  const formatCost = (cost: number) => {
    if (orderReturn?.xp?.PaymentMethodType === 'Points') {
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
      const orderReturnID = router.query.orderreturnid as string
      const orderReturn = await OrderReturns.Get(orderReturnID)
      const orderReturnItems = orderReturn?.ItemsToReturn
      if (orderReturnItems.length) {
        const liIDs = orderReturnItems.map((i) => i.LineItemID).join('|')
        const lineItems = await LineItems.List('All', orderReturn?.OrderID, {
          filters: { ID: liIDs },
        })
        const extendedReturnItems = [] as ExtendedReturnItem[]
        orderReturnItems.forEach((i) => {
          const lineItem = lineItems.Items.find((item) => item.ID === i.LineItemID)
          extendedReturnItems.push({ ...i, LineItem: lineItem } as ExtendedReturnItem)
        })
        setItemsToReturn(extendedReturnItems)
      }
      setOrderReturn(orderReturn)
      setLoading(false)
    }
    initialize()
  }, [router.query.orderreturnid])

  return (
    <>
      <Container
        as={VStack}
        alignItems="flex-start"
        maxW="container.2xl"
        className={`component container ${styles}`}
      >
        <Placeholder
          name={phKey}
          rendering={props.rendering}
        />
        <SimpleGrid
          className="component-content"
          style={backgroundStyle}
          w="full"
          gridTemplateColumns={{ md: '1fr 1fr', lg: '1fr 4fr 1fr' }}
          gap={6}
        >
          <Hide below="lg">
            <UserTabs />
          </Hide>
          {loading ? (
            <Skeleton boxSize="full" />
          ) : (
            <>
              {orderReturn && (
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
                      Order Return Details
                    </Heading>
                    <ButtonGroup
                      ml="auto"
                      size="sm"
                      gap={3}
                    >
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
                      Order Return Number:
                    </Text>
                    <Text as="dd">{orderReturn?.ID}</Text>
                    <Text
                      as="dt"
                      color="chakra-subtle-text"
                    >
                      Order Number:
                    </Text>
                    <Text as="dd">{orderReturn?.OrderID}</Text>
                    <Text
                      as="dt"
                      color="chakra-subtle-text"
                    >
                      Return Submitted:
                    </Text>
                    <Text as="dd">{formatDate(orderReturn?.DateSubmitted)}</Text>
                  </SimpleGrid>
                  <VStack
                    maxW="full"
                    alignItems="start"
                    w="full"
                    mt={6}
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
                            <Th>Quantity Returned</Th>
                            <Th>Refund Amount</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {itemsToReturn?.map((item) => (
                            <Tr key={item.LineItem.ID}>
                              <Td>
                                <VStack alignItems="flex-start">
                                  <Text fontWeight="600">{item.LineItem.Product.Name}</Text>
                                  <Text
                                    fontSize="xs"
                                    maxW="xl"
                                    whiteSpace="pre-wrap"
                                  >
                                    {item.LineItem.Product.Description}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>{item.Quantity}</Td>
                              <Td>{formatCost(item.RefundAmount)}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </VStack>
              )}
            </>
          )}
          <Card
            variant="unstyled"
            borderLeftWidth={{ lg: '1px' }}
            borderLeftColor="chakra-border-color"
            pl={{ lg: 6 }}
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
                Order Return Summary
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
                {formatCost(orderReturn?.RefundAmount)}
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </>
  )
}

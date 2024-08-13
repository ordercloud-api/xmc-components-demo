/* eslint-disable @typescript-eslint/no-unused-vars */

import { Badge, CardBody, CardHeader, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'

import Card from 'components/card/Card'
import NextLink from 'next/link'
import { Order } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import { formatShortDate } from 'src/utils/formatDate'
import formatPrice from 'src/utils/formatPrice'
import { useMemo } from 'react'

interface OrderCardProps {
  order: Order
  approvable?: boolean
}

const OrderCard: FunctionComponent<OrderCardProps> = ({ order, approvable }) => {
  const paidWithPoints = order.xp?.PaymentMethodType === 'Points'
  const dateSubmitted: string = order.DateSubmitted !== undefined ? order.DateSubmitted : ''
  const orderTotal: number = order.Total !== undefined ? order.Total : 0

  const href = useMemo(
    () =>
      approvable
        ? `my-profile/my-order-approvals/my-order-approval-details?orderid=${order.ID}`
        : `my-profile/my-orders/order-details?orderid=${order.ID}`,
    [approvable, order?.ID]
  )
  return (
    <Card
      as={LinkBox}
      aspectRatio="1.5/1"
    >
      <CardHeader p={4}>
        <Badge size="xs">{order.Status}</Badge>
        <Text
          fontSize="xl"
          fontWeight="300"
          mt={2}
        >
          {formatShortDate(dateSubmitted)}
        </Text>
      </CardHeader>
      <LinkOverlay
        as={NextLink}
        href={href}
        passHref
      >
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
            {order.ID}
          </Text>
          <Text>
            <Text
              as="span"
              fontWeight="600"
              color="chakra-subtle-text"
            >
              Items Ordered:{' '}
            </Text>
            {order.LineItemCount}
          </Text>
          {!paidWithPoints && (
            <Text>
              <Text
                as="span"
                fontWeight="600"
                color="chakra-subtle-text"
              >
                Order Total:{' '}
              </Text>
              {formatPrice(orderTotal)}
            </Text>
          )}
          {paidWithPoints && (
            <Text>
              <Text
                as="span"
                fontWeight="600"
                color="chakra-subtle-text"
              >
                Points Total :
              </Text>
              {order.Total}
            </Text>
          )}
        </CardBody>
      </LinkOverlay>
    </Card>
  )
}

export default OrderCard

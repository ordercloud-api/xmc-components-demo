/* eslint-disable @typescript-eslint/no-unused-vars */

import { Badge, Button, CardBody, CardFooter, CardHeader, LinkBox, Text } from '@chakra-ui/react'

import Card from 'components/card/Card'
import NextLink from 'next/link'
import { Order } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import { formatShortDate } from 'src/utils/formatDate'
import formatPrice from 'src/utils/formatPrice'

interface QuoteCardProps {
  order: Order
}

const QuoteCard: FunctionComponent<QuoteCardProps> = ({ order }) => {
  const paidWithPoints = order.xp?.PaymentMethodType === 'Points'
  const dateSubmitted: string = order.DateSubmitted !== undefined ? order.DateSubmitted : ''
  const orderTotal: number = order.Total !== undefined ? order.Total : 0
  return (
    <Card
      as={LinkBox}
      aspectRatio="1.5/1"
    >
      <CardHeader p={4}>
        <Badge size="xs">{order.Status.replace(/([A-Z])/g, ' $1').trim()}</Badge>
        <Text
          fontSize="xl"
          fontWeight="300"
          mt={2}
        >
          {formatShortDate(dateSubmitted)}
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
      <CardFooter
        gap={1}
        p={3}
        justifyContent="flex-end"
      >
        <NextLink
          href={`my-profile/my-quotes/quote-details?quoteid=${order.ID}`}
          passHref
        >
          <Button
            size="sm"
            as="a"
            variant="ghost"
          >
            View Quote
          </Button>
        </NextLink>
      </CardFooter>
    </Card>
  )
}

export default QuoteCard

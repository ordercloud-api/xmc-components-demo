/* eslint-disable @typescript-eslint/no-unused-vars */

import { Badge, Button, CardBody, CardFooter, CardHeader, LinkBox, Text } from '@chakra-ui/react'

import Card from 'components/card/Card'
import NextLink from 'next/link'
import { OrderReturn } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import { formatShortDate } from 'src/utils/formatDate'

interface OrderReturnCardProps {
  orderReturn: OrderReturn
}

const OrderReturnCard: FunctionComponent<OrderReturnCardProps> = ({ orderReturn }) => {
  const dateSubmitted: string = orderReturn.DateSubmitted !== undefined ? orderReturn.DateSubmitted : ''
  return (
    <Card
      as={LinkBox}
      aspectRatio="1.5/1"
    >
      <CardHeader p={4}>
        <Badge size="xs">{orderReturn.Status.replace(/([A-Z])/g, ' $1').trim()}</Badge>
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
          {orderReturn.ID}
        </Text>
        <Text>
          <Text
            as="span"
            fontWeight="600"
            color="chakra-subtle-text"
          >
            Items Returning:{' '}
          </Text>
          {orderReturn.ItemsToReturn.length}
        </Text>
        <Text>
          <Text
            as="span"
            fontWeight="600"
            color="chakra-subtle-text"
          >
            Refund Amount:{' '}
          </Text>
          {orderReturn.RefundAmount}
        </Text>
      </CardBody>
      <CardFooter
        gap={1}
        p={3}
        justifyContent="flex-end"
      >
        <NextLink
          href={`my-profile/my-returns/return-details?orderreturnid=${orderReturn.ID}`}
          passHref
        >
          <Button
            size="sm"
            as="a"
            variant="ghost"
          >
            View order return
          </Button>
        </NextLink>
      </CardFooter>
    </Card>
    // <Card variant="">
    //   <VStack w="full" width="100%" justifyContent="space-between" p={2}>
    //     <VStack
    //       h="100%"
    //       w="full"
    //       width="100%"
    //       justifyContent="space-between"
    //       alignItems="space-between"
    //       verticalAlign="bottom"
    //       p={0}
    //     >
    //       <Text>
    //         <b>Date Created : </b> {formatShortDate(dateCreated)}
    //       </Text>
    //       <Text>
    //         <b>Items Returning: </b> {orderReturn.ItemsToReturn.length}
    //       </Text>
    //       <Text>
    //         <b>Refund Amount: </b> {orderReturn.RefundAmount}
    //       </Text>
    //       <NextLink href={`my-profile/my-returns/return-details?orderreturnid=${orderReturn.ID}`} passHref>
    //         <Button variant="outline" size="sm" mt="3" width="100%" w="full">
    //           View order return
    //         </Button>
    //       </NextLink>
    //     </VStack>
    //   </VStack>
    // </Card>
  )
}

export default OrderReturnCard

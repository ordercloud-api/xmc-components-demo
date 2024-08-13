/* eslint-disable @typescript-eslint/no-unused-vars */

import { Text, VStack } from '@chakra-ui/react'

import { LineItem } from 'ordercloud-javascript-sdk'
import React, { FunctionComponent } from 'react'
import OcLineItemCard from './OcLineItemCard'

interface OcLineItemListProps {
  emptyMessage?: string
  editable?: boolean
  lineItems: LineItem[]
}

const OcLineItemList: FunctionComponent<OcLineItemListProps> = ({
  emptyMessage,
  editable,
  lineItems,
}) => {
  return lineItems && lineItems.length ? (
    <VStack
      gap={6}
      alignItems="flex-start"
      w="full"
    >
      {lineItems.map((li) => (
        <React.Fragment key={li.ID}>
          <OcLineItemCard
            lineItem={li}
            editable={editable}
          />
        </React.Fragment>
      ))}
    </VStack>
  ) : (
    <Text alignSelf="flex-start">{emptyMessage}</Text>
  )
}

export default OcLineItemList

import { PriceSchedule } from 'ordercloud-javascript-sdk'
import { FC } from 'react'
import { Table, TableContainer, Text, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import formatPrice from 'src/utils/formatPrice'

interface IProductPriceBreaks {
  priceSchedule?: PriceSchedule
}

const ProductPriceBreaks: FC<IProductPriceBreaks> = ({ priceSchedule }) => {
  return priceSchedule?.PriceBreaks?.length > 1 ? (
    <TableContainer>
      <Table
        variant="simple"
        size="sm"
      >
        <Thead>
          <Tr>
            <Th>Qty</Th>
            <Th>Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {priceSchedule.PriceBreaks.map((pb, idx) => (
            <Tr key={idx}>
              <Td>{pb.Quantity}</Td>
              <Td>
                <Text>
                  {formatPrice(priceSchedule.IsOnSale ? pb.SalePrice : pb.Price)}
                  {priceSchedule.IsOnSale && (
                    <Text
                      color="chakra-subtle-text"
                      as="s"
                      ml={2}
                    >
                      {formatPrice(pb.Price)}
                    </Text>
                  )}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : null
}

export default ProductPriceBreaks

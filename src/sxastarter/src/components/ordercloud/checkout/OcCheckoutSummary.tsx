/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FunctionComponent, useMemo } from 'react';
import { useOcSelector } from '../../../redux/ocStore';
import formatPrice from '../../../utils/formatPrice';
import { Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react';

const OcCheckoutSummary: FunctionComponent = () => {
  const { order, shipEstimateResponse, payments } = useOcSelector((s: any) => s.ocCurrentOrder);

  const isShippingAccurate = useMemo(() => {
    return (
      shipEstimateResponse &&
      shipEstimateResponse.ShipEstimates &&
      shipEstimateResponse.ShipEstimates.filter((se: any) => !se.SelectedShipMethodID).length === 0
    );
  }, [shipEstimateResponse]);

  const isTaxAccurate = useMemo(() => {
    return order && order.BillingAddress && isShippingAccurate;
  }, [order, isShippingAccurate]);

  return order ? (
    <TableContainer width="100%" w="full" textAlign="right">
      <Table
        size="16px"
        width="100%"
        w="full"
        border="1px"
        borderStyle="solid"
        borderColor="gray.300"
        maxW="500px"
        float="right"
      >
        <Tbody>
          <Tr>
            <Td pt="10px" pb="10px" pl="10px">
              Subtotal
            </Td>
            <Td>{formatPrice(order.Subtotal)}</Td>
          </Tr>
          {order.PromotionDiscount ? (
            <Tr>
              <Td pt="10px" pb="10px" pl="10px">
                Promotion
              </Td>
              <Td>{formatPrice(-order.PromotionDiscount)}</Td>
            </Tr>
          ) : null}
          <Tr>
            <Td pt="10px" pb="10px" pl="10px">
              Shipping
            </Td>
            <Td>{isShippingAccurate ? formatPrice(order.ShippingCost) : '---'}</Td>
          </Tr>
          <Tr>
            <Td pt="10px" pb="10px" pl="10px">
              Tax
            </Td>
            <Td>{isTaxAccurate ? formatPrice(order.TaxCost) : '---'}</Td>
          </Tr>
          <Tr>
            <Td pt="10px" pb="10px" pl="10px">
              Total
            </Td>
            <Td>{formatPrice(order.Total)}</Td>
          </Tr>
          {payments &&
            payments.map((p: any) => (
              <Tr key={p.ID} bgColor="#fafafa">
                <Td pt="10px" pb="10px" pl="10px">{`${p.Type} Payment`}</Td>
                <Td></Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : null;
};

export default OcCheckoutSummary;

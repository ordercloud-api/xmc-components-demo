/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { FunctionComponent } from 'react';
import { useOcSelector } from '../../../redux/ocStore';
import { Box } from '@chakra-ui/react';

interface OcOrderConfirmationProps {
  orderId: string;
}

const OcOrderConfirmation: FunctionComponent<OcOrderConfirmationProps> = ({ orderId }) => {
  const recentOrder = useOcSelector((s: any) =>
    s.ocCurrentOrder.recentOrders.find((ro: any) => ro.order.ID === orderId)
  );

  return (
    <Box>
      <h2>Order Confirmation</h2>
      <pre>{JSON.stringify(recentOrder, null, 2)}</pre>
    </Box>
  );
};

export default OcOrderConfirmation;

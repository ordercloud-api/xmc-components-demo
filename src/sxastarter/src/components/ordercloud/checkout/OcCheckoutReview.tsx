import React from 'react';
import { FunctionComponent, useCallback } from 'react';
import { OcCheckoutStepProps } from './steppedcheckout';
import { submitOrder } from '../../../redux/ocCurrentOrder';
import { useOcDispatch } from '../../../redux/ocStore';
import OcCheckoutSummary from './OcCheckoutSummary';
import { VStack, Heading, Button, HStack } from '@chakra-ui/react';
import { HiChevronDoubleRight, HiChevronDoubleLeft } from 'react-icons/hi';
import OcCurrentOrderLineItemList from '../shoppingcart/OcCurrentOrderLineItemList';

interface OcCheckoutReviewProps extends OcCheckoutStepProps {
  onOrderSubmitted: (orderId: string) => void;
}

const OcCheckoutReview: FunctionComponent<OcCheckoutReviewProps> = ({
  onPrev,
  onOrderSubmitted,
}) => {
  const dispatch = useOcDispatch();
  const handleSubmitOrder = useCallback(async () => {
    await dispatch(submitOrder(onOrderSubmitted));
  }, [dispatch, onOrderSubmitted]);

  return (
    <VStack w="100%" width="full">
      <Heading as="h2">Review Order</Heading>
      <OcCurrentOrderLineItemList />
      <OcCheckoutSummary />
      <HStack w="100%" width="full" justifyContent="space-between">
        <Button
          type="button"
          onClick={onPrev}
          bgColor="white"
          color="brand.500"
          border="1px"
          borderColor="brand.500"
          leftIcon={<HiChevronDoubleLeft />}
        >
          Edit Payment
        </Button>
        <Button
          type="button"
          onClick={handleSubmitOrder}
          bgColor="brand.500"
          color="white"
          rightIcon={<HiChevronDoubleRight />}
        >
          Submit Order
        </Button>
      </HStack>
    </VStack>
  );
};

export default OcCheckoutReview;

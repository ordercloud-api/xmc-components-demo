import { isEqual } from 'lodash';
import { BuyerAddress } from 'ordercloud-javascript-sdk';
import { ChangeEvent, FunctionComponent, useCallback, useMemo } from 'react';
import { OcCheckoutStepProps } from './steppedcheckout';
import { removeBillingAddress, saveBillingAddress } from '../../../redux/ocCurrentOrder';
import { useOcDispatch, useOcSelector } from '../../../redux/ocStore';
// import OcAddressBook from './OcAddressBook';
import OcAddressForm from './OcAddressFormNotMapped';
import {
  VStack,
  Heading,
  Button,
  HStack,
  Input,
  Divider,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { HiChevronDoubleRight, HiChevronDoubleLeft } from 'react-icons/hi';
import React from 'react';

const OcCheckoutBilling: FunctionComponent<OcCheckoutStepProps> = ({ onNext, onPrev }) => {
  const dispatch = useOcDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { initialized, order, lineItems } = useOcSelector((s: any) => ({
    initialized: s.ocCurrentOrder.initialized,
    order: s.ocCurrentOrder.order,
    lineItems: s.ocCurrentOrder.lineItems,
    user: s.ocUser.user,
  }));

  const currentShippingAddress = useMemo(() => {
    if (initialized && lineItems && lineItems.length) {
      return lineItems[0].ShippingAddress;
    }
    return {};
  }, [initialized, lineItems]);

  const currentBillingAddress = useMemo(() => {
    if (initialized && order) {
      return order.BillingAddress;
    }
    return null;
  }, [initialized, order]);
  console.log(currentBillingAddress);

  // const showAddressBook = useMemo(() => {
  //   return user && user.AvailableRoles && user.AvailableRoles.includes('MeAddressAdmin');
  // }, [user]);

  const shippingEqualsBilling = useMemo(() => {
    if (!(order && order.BillingAddress && order.BillingAddress.Street1)) return false;
    return isEqual(currentShippingAddress, order.BillingAddress);
  }, [currentShippingAddress, order]);

  const handleSetBillingAddress = (address: Partial<BuyerAddress>) => {
    dispatch(saveBillingAddress(address));
  };

  const handleSameAsShippingChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        dispatch(saveBillingAddress(currentShippingAddress));
      } else {
        dispatch(removeBillingAddress());
      }
    },
    [dispatch, currentShippingAddress]
  );

  return initialized && order ? (
    <VStack w="100%" width="full">
      <Heading as="h2">Billing Information</Heading>
      <FormControl>
        <HStack>
          <Input
            type="checkbox"
            id="SameAsShipping"
            name="SameAsShipping"
            onChange={handleSameAsShippingChange}
            checked={shippingEqualsBilling}
            width="20px"
            height="30px"
          />
          <FormLabel pl="10px" mt="8" fontSize="16px">
            Same as Shipping
          </FormLabel>
        </HStack>
        {/* {!shippingEqualsBilling &&
          (showAddressBook ? (
            <OcAddressBook
              id="billing"
              listOptions={{ pageSize: 100 }}
              selected={order.BillingAddressID}
              onChange={handleSetBillingAddress}
            />
          ) : ( */}
        <OcAddressForm
          id="billing"
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          address={currentBillingAddress!}
          onSubmit={handleSetBillingAddress}
        />
        {/* ))} */}
      </FormControl>
      <Divider />
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
          Edit Shipping
        </Button>
        <Button
          type="button"
          onClick={onNext}
          bgColor="brand.500"
          color="white"
          rightIcon={<HiChevronDoubleRight />}
        >
          Payment
        </Button>
      </HStack>
    </VStack>
  ) : null;
};

export default OcCheckoutBilling;

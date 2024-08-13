/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button, Divider, HStack, Heading, VStack } from '@chakra-ui/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { useOcDispatch, useOcSelector } from '../../../redux/ocStore';

import { BuyerAddress } from 'ordercloud-javascript-sdk';
import { HiChevronDoubleRight } from 'react-icons/hi';
// import OcAddressBook from './OcAddressBook';
import OcAddressFormNotMapped from './OcAddressFormNotMapped';
import { OcCheckoutStepProps } from './steppedcheckout';
import React from 'react';
import { saveShippingAddress } from '../../../redux/ocCurrentOrder';

const OcCheckoutShipping: FunctionComponent<OcCheckoutStepProps> = ({ onNext }) => {
  const dispatch = useOcDispatch();
  const [currentShippingAddress, setcurrentShippingAddress] = useState([] as BuyerAddress);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { initialized, order, lineItems } = useOcSelector((s: any) => ({
    initialized: s.ocCurrentOrder.initialized,
    order: s.ocCurrentOrder.order,
    lineItems: s.ocCurrentOrder.lineItems,
    user: s.ocUser.user,
  }));

  const handleSetShippingAddress = (address: Partial<BuyerAddress>) => {
    dispatch(saveShippingAddress(address));
  };

  useEffect(() => {
    if (initialized && lineItems && lineItems.length) {
      setcurrentShippingAddress(lineItems[0].ShippingAddress);
    }
  }, [initialized, lineItems]);

  // console.log('OCScheckoutshipping:');
  // console.log(currentShippingAddress);

  // const showAddressBook = useMemo(() => {
  //   return user && user.AvailableRoles && user.AvailableRoles.includes('MeAddressAdmin');
  // }, [user]);

  return initialized && order ? (
    <VStack w="100%" width="full">
      <Heading as="h2">Shipping Information</Heading>
      {/* {showAddressBook ? (
        <VStack>
          <OcAddressBook
            id="shipping"
            listOptions={{ pageSize: 100 }}
            selected={order.ShippingAddressID}
            onChange={handleSetShippingAddress}
          />
        </VStack>
      ) : ( */}
      <OcAddressFormNotMapped
        id="shipping"
        address={currentShippingAddress}
        onSubmit={handleSetShippingAddress}
      />
      {/* )} */}
      {/* <OcShipEstimates /> */}
      <Divider />
      <HStack w="100%" width="full" justifyContent="flex-end">
        <Button
          type="button"
          onClick={onNext}
          float="right"
          bgColor="brand.500"
          color="white"
          rightIcon={<HiChevronDoubleRight />}
        >
          Billing
        </Button>
      </HStack>
    </VStack>
  ) : null;
};

export default OcCheckoutShipping;

import { BuyerAddress } from 'ordercloud-javascript-sdk';
import { ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import useOcAddressBook, { OcAddressListOptions } from '../../../hooks/useOcAddressBook';
import OcAddressFormNotMapped from './OcAddressFormNotMapped';
import { VStack, Text } from '@chakra-ui/react';
import React from 'react';

interface OcAddressBookProps {
  id: string;
  selected?: string; // id of the selected address
  onChange?: (address: BuyerAddress) => void;
  listOptions?: OcAddressListOptions;
}

const OcAddressBook: FunctionComponent<OcAddressBookProps> = ({ id, selected, onChange }) => {
  const { addresses, saveAddress } = useOcAddressBook({});
  const [selectedId, setSelectedId] = useState(selected || '');

  useEffect(() => {
    setSelectedId((sid) => (sid || addresses.length ? addresses[addresses.length - 1].ID : ''));
  }, [addresses]);

  const handleSelectionChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(addresses.find((a) => a.ID === e.target.value) as BuyerAddress);
      } else {
        setSelectedId(e.target.value);
      }
    },
    [onChange, addresses]
  );

  // const handleDeleteAddress = useCallback(
  //   async (addressId: string) => {
  //     await deleteAddress(addressId)
  //     if (onChange) {
  //       onChange(undefined as unknown as BuyerAddress)
  //     } else {
  //       setSelectedId("")
  //     }
  //   },
  //   [deleteAddress, onChange]
  // )

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.ID === selectedId);
  }, [addresses, selectedId]);

  return addresses.length ? (
    <VStack w="100%" width="full">
      <label htmlFor="select_address">
        <Text>Select an address</Text>
        <select
          id="select_address"
          name="select_address"
          value={selectedId || ''}
          onChange={handleSelectionChange}
        >
          <option value="">None Selected</option>
          {addresses.map((a) => (
            <option key={a.ID} value={a.ID}>
              {a.Street1}
            </option>
          ))}
        </select>
      </label>
      <OcAddressFormNotMapped
        id={`${id}_address_book`}
        address={selectedAddress}
        onSubmit={saveAddress}
      />
    </VStack>
  ) : (
    <OcAddressFormNotMapped id={`${id}_address_book`} onSubmit={saveAddress} />
  );
};

export default OcAddressBook;

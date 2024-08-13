import { ChangeEvent, FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { FormControl, FormLabel, HStack, Input, VStack } from '@chakra-ui/react';

import { BuyerAddress } from 'ordercloud-javascript-sdk';
import { EMPTY_ADDRESS } from '../../../redux/ocAddressBook';
import React from 'react';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

interface OcAddressFormProps {
  id: string;
  onSubmit: (address: BuyerAddress) => void;
  address?: BuyerAddress;
  formfields?: Fields;
}

interface Fields {
  //Address Information
  FirstName: Field<string>;
  FirstNameWaterMark: Field<string>;
  LastName: Field<string>;
  LastNameWaterMark: Field<string>;
  Address: Field<string>;
  AddressWaterMark: Field<string>;
  AddressTwo: Field<string>;
  AddressTwoWaterMark: Field<string>;
  City: Field<string>;
  CityWaterMark: Field<string>;
  State: Field<string>;
  StateWaterMark: Field<string>;
  PostalCode: Field<string>;
  PostalCodeWaterMark: Field<string>;
  Country: Field<string>;
  CountryWaterMark: Field<string>;

  //Phone Information
  Phone: Field<string>;
  PhoneWaterMark: Field<string>;
}

const OcAddressForm: FunctionComponent<OcAddressFormProps> = ({
  id,
  onSubmit,
  address,
  formfields,
}) => {
  const [formValues, setFormValues] = useState(address || EMPTY_ADDRESS);

  useEffect(() => {
    setFormValues(address || EMPTY_ADDRESS);
  }, [address]);

  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit(formValues);
    },
    [onSubmit, formValues]
  );

  // const handleDeleteAddress = useCallback(() => {
  //   if (onDelete) {
  //     onDelete(address.ID as string)
  //   }
  // }, [onDelete, address])

  const handleInputChange = (field: keyof BuyerAddress) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((s) => ({ ...s, [field]: e.target.value }));
  };

  // const handleDiscardChanges = useCallback(() => {
  //   setFormValues(address || EMPTY_ADDRESS)
  // }, [address])

  // const hasChanges = useMemo(() => {
  //   return !isEqual(address, formValues)
  // }, [address, formValues])

  return (
    <FormControl>
      <form onSubmit={handleFormSubmit}>
        <VStack w="100%" width="full">
          <HStack w="100%" width="full">
            <VStack w="100%" width="full">
              <FormLabel w="100%" width="full" pl="10px" pt="10px">
                {formfields.FirstName.value}
              </FormLabel>
              <Input
                w="100%"
                width="full"
                type="text"
                id={`${id}_address_firstName`}
                name="address_firstName"
                placeholder={formfields.FirstNameWaterMark.value}
                value={formValues.FirstName}
                onChange={handleInputChange('FirstName')}
                required
              />
            </VStack>
            <VStack w="100%" width="full">
              <FormLabel w="100%" width="full" pl="10px" pt="10px">
                {formfields.LastName.value}
              </FormLabel>
              <Input
                w="100%"
                width="full"
                type="text"
                id={`${id}_address_lastName`}
                name="address_lastName"
                placeholder={formfields.LastNameWaterMark.value}
                value={formValues.LastName}
                onChange={handleInputChange('LastName')}
                required
              />
            </VStack>
          </HStack>
          <FormLabel w="100%" width="full" pl="10px" pt="10px">
            {formfields.Address.value}
          </FormLabel>
          <Input
            w="100%"
            width="full"
            type="text"
            id={`${id}_address_street1`}
            name="address_street1"
            placeholder={formfields.AddressWaterMark.value}
            value={formValues.Street1}
            onChange={handleInputChange('Street1')}
            required
          />
          <FormLabel w="100%" width="full" pl="10px" pt="10px">
            {formfields.AddressTwo.value}
          </FormLabel>
          <Input
            w="100%"
            width="full"
            type="text"
            id={`${id}_address_street2`}
            name="address_street2"
            placeholder={formfields.AddressTwoWaterMark.value}
            value={formValues.Street2}
            onChange={handleInputChange('Street2')}
          />
          <FormLabel w="100%" width="full" pl="10px" pt="10px">
            {formfields.City.value}
          </FormLabel>
          <Input
            w="100%"
            width="full"
            type="text"
            id={`${id}_address_city`}
            name="address_city"
            placeholder={formfields.CityWaterMark.value}
            value={formValues.City}
            onChange={handleInputChange('City')}
            required
          />
          <HStack w="100%" width="full">
            <VStack w="100%" width="full">
              <FormLabel w="100%" width="full" pl="10px" pt="10px">
                {formfields.State.value}
              </FormLabel>
              <Input
                w="100%"
                width="full"
                type="text"
                id={`${id}_address_state`}
                name="address_state"
                placeholder={formfields.State.value}
                value={formValues.State}
                onChange={handleInputChange('State')}
                required
              />
            </VStack>
            <VStack w="100%" width="full">
              <FormLabel w="100%" width="full" pl="10px" pt="10px">
                {formfields.PostalCode.value}
              </FormLabel>
              <Input
                w="100%"
                width="full"
                type="text"
                id={`${id}_address_zip`}
                name="address_zip"
                placeholder={formfields.PostalCodeWaterMark.value}
                value={formValues.Zip}
                onChange={handleInputChange('Zip')}
                required
              />
            </VStack>
            <VStack w="100%" width="full">
              <FormLabel w="100%" width="full" pl="10px" pt="10px">
                {formfields.Country.value}
              </FormLabel>
              <Input
                w="100%"
                width="full"
                type="text"
                id={`${id}_address_country`}
                name="address_country"
                placeholder={formfields.PostalCodeWaterMark.value}
                value={formValues.Country}
                onChange={handleInputChange('Country')}
                required
              />
            </VStack>
          </HStack>
          <FormLabel w="100%" width="full" pl="10px" pt="10px">
            {formfields.Phone.value}
          </FormLabel>
          <Input
            w="100%"
            width="full"
            type="text"
            id={`${id}_address_phone`}
            name="address_phone"
            placeholder={formfields.PhoneWaterMark.value}
            value={formValues.Phone}
            onChange={handleInputChange('Phone')}
          />
        </VStack>
      </form>
    </FormControl>
  );
};

export default OcAddressForm;

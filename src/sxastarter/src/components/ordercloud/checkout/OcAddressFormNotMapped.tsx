import { FormControl, FormLabel, Input, Stack, VStack } from '@chakra-ui/react'
import { ChangeEvent, FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react'

import { BuyerAddress } from 'ordercloud-javascript-sdk'
import { EMPTY_ADDRESS } from '../../../redux/ocAddressBook'

interface OcAddressFormNotMappedProps {
  id: string
  onSubmit: (address: BuyerAddress) => void
  address?: BuyerAddress
}

const OcAddressFormNotMapped: FunctionComponent<OcAddressFormNotMappedProps> = ({
  id,
  onSubmit,
  address,
}) => {
  const [formValues, setFormValues] = useState(address || EMPTY_ADDRESS)

  useEffect(() => {
    setFormValues(address || EMPTY_ADDRESS)
  }, [address])

  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      onSubmit(formValues)
    },
    [onSubmit, formValues]
  )

  // const handleDeleteAddress = useCallback(() => {
  //   if (onDelete) {
  //     onDelete(address.ID as string)
  //   }
  // }, [onDelete, address])

  const handleInputChange = (field: keyof BuyerAddress) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((s) => ({ ...s, [field]: e.target.value }))
  }

  // const handleDiscardChanges = useCallback(() => {
  //   setFormValues(address || EMPTY_ADDRESS)
  // }, [address])

  //  const hasChanges = useMemo(() => {
  //    return !isEqual(address, formValues)
  //  }, [address, formValues])

  return (
    <VStack
      gap={3}
      maxW="2xl"
      w="full"
      as="form"
      onSubmit={handleFormSubmit}
    >
      <FormControl isRequired>
        <FormLabel>Address Name</FormLabel>
        <Input
          type="text"
          id={`${id}_address_addressname`}
          name="address_addressname"
          placeholder="Enter address name"
          value={formValues.AddressName}
          onChange={handleInputChange('AddressName')}
          required
        />
      </FormControl>
      <Stack
        w="full"
        gap={3}
        direction={{ md: 'row' }}
      >
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            id={`${id}_address_firstName`}
            name="address_firstName"
            placeholder="John"
            value={formValues.FirstName}
            onChange={handleInputChange('FirstName')}
            required
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            w="full"
            type="text"
            id={`${id}_address_lastName`}
            name="address_lastName"
            placeholder="Smith"
            value={formValues.LastName}
            onChange={handleInputChange('LastName')}
            required
          />
        </FormControl>
      </Stack>
      <FormControl isRequired>
        <FormLabel>Street</FormLabel>
        <Input
          type="text"
          id={`${id}_address_street1`}
          name="address_street1"
          placeholder="Street Address"
          value={formValues.Street1}
          onChange={handleInputChange('Street1')}
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel>Street 2</FormLabel>
        <Input
          type="text"
          id={`${id}_address_street2`}
          name="address_street2"
          placeholder="Street Address 2"
          value={formValues.Street2}
          onChange={handleInputChange('Street2')}
        />
      </FormControl>
      <Stack
        w="full"
        gap={3}
        direction={{ md: 'row' }}
      >
        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Input
            type="text"
            id={`${id}_address_city`}
            name="address_city"
            placeholder="City"
            value={formValues.City}
            onChange={handleInputChange('City')}
            required
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>State</FormLabel>
          <Input
            type="text"
            id={`${id}_address_state`}
            name="address_state"
            placeholder="State"
            value={formValues.State}
            onChange={handleInputChange('State')}
            required
          />
        </FormControl>
      </Stack>
      <Stack
        w="full"
        gap={3}
        direction={{ md: 'row' }}
      >
        <FormControl isRequired>
          <FormLabel>Postal Code</FormLabel>
          <Input
            type="text"
            id={`${id}_address_zip`}
            name="address_zip"
            placeholder="90210"
            value={formValues.Zip}
            onChange={handleInputChange('Zip')}
            required
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Input
            type="text"
            id={`${id}_address_country`}
            name="address_country"
            placeholder="USA"
            value={formValues.Country}
            onChange={handleInputChange('Country')}
            required
          />
        </FormControl>
      </Stack>
      <FormControl>
        <FormLabel>Phone</FormLabel>
        <Input
          type="text"
          id={`${id}_address_phone`}
          name="address_phone"
          placeholder="555-555-5555"
          value={formValues.Phone}
          onChange={handleInputChange('Phone')}
        />
      </FormControl>
    </VStack>
  )
}

export default OcAddressFormNotMapped

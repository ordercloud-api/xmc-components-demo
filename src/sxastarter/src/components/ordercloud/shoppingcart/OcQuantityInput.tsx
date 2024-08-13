/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChangeEvent, FunctionComponent } from 'react'

import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from '@chakra-ui/react'
import { PriceSchedule } from 'ordercloud-javascript-sdk'

interface OcQuantityInputProps {
  controlId: string
  priceSchedule: PriceSchedule
  label?: string
  disabled?: boolean
  quantity: number
  onChange: (quantity: number) => void
}

const OcQuantityInput: FunctionComponent<OcQuantityInputProps> = ({
  controlId,
  priceSchedule,
  disabled,
  quantity,
  onChange,
}) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value))
  }

  const handleNumberInputChange = (_valAsString: string, valAsNumber: number) => {
    if (typeof valAsNumber !== 'number') {
      return
    }
    onChange(valAsNumber)
  }

  return (
    <VStack
      alignItems="flex-start"
      gap={0}
    >
      {/* <FormLabel>{label}</FormLabel> */}
      {priceSchedule?.RestrictedQuantity ? (
        <Select
          maxW="100"
          size="sm"
          id={controlId}
          isDisabled={disabled}
          value={quantity}
          onChange={handleSelectChange}
        >
          {priceSchedule.PriceBreaks.map((pb) => (
            <option
              key={pb.Quantity}
              value={pb.Quantity}
            >
              {pb.Quantity}
            </option>
          ))}
        </Select>
      ) : (
        <NumberInput
          maxW="100"
          size="sm"
          value={quantity || ''}
          defaultValue={quantity}
          onChange={handleNumberInputChange}
          isDisabled={disabled}
          step={1}
          min={priceSchedule?.MinQuantity || 1}
          max={priceSchedule?.MaxQuantity || undefined}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
    </VStack>
  )
}

export default OcQuantityInput

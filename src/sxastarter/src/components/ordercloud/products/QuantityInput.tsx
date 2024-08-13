import { PriceSchedule, RequiredDeep } from 'ordercloud-javascript-sdk'
import { ChangeEvent, FunctionComponent } from 'react'

import {
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from '@chakra-ui/react'

interface QuantityInputProps {
  controlId: string
  priceSchedule: RequiredDeep<PriceSchedule>
  label?: string
  disabled?: boolean
  quantity: number
  onChange: (quantity: number) => void
}

const QuantityInput: FunctionComponent<QuantityInputProps> = ({
  controlId,
  priceSchedule,
  label = 'Quantity',
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
      <FormLabel>{label}</FormLabel>
      {priceSchedule?.RestrictedQuantity ? (
        <Select
          maxW="100"
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

export default QuantityInput

{
  /* {priceSchedule?.RestrictedQuantity ? (
        <Input
          maxW="200"
          size="sm"
          id={controlId}
          disabled={disabled}
          type="number"
          min={priceSchedule?.MinQuantity}
          max={priceSchedule?.MaxQuantity}
          step={1}
          value={quantity}
          onChange={handleInputChange}
        />
      ) : (
        <NumberInput
          id={controlId}
          isDisabled={disabled}
          min={1}
          step={1}
          // onChange={handleInputChange}
          value={quantity}
          size="sm"
          maxW="100"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )} */
}

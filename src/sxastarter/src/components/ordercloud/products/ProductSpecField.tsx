import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import { RequiredDeep, Spec } from 'ordercloud-javascript-sdk'
import { ChangeEvent, FunctionComponent } from 'react'
import formatPrice from 'src/utils/formatPrice'

interface ProductSpecFieldProps {
  spec: RequiredDeep<Spec>
  optionId?: string
  value?: string
  onChange: (values: { SpecID: string; OptionID?: string; Value?: string }) => void
}

const ProductSpecField: FunctionComponent<ProductSpecFieldProps> = ({
  spec,
  optionId,
  value,
  onChange,
}) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      SpecID: spec.ID,
      OptionID: e.target.value ? e.target.value : undefined,
      Value: optionId,
    })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      SpecID: spec.ID,
      OptionID: 'OpenText',
      Value: e.target.value.length ? e.target.value : undefined,
    })
  }

  return (
    <>
      {spec.OptionCount ? (
        <FormControl>
          <FormLabel>{spec.Name}</FormLabel>
          <Select
            rounded="md"
            id={spec.ID}
            name={spec.ID}
            onChange={handleSelectChange}
            value={optionId}
          >
            <option
              selected
              disabled
            >
              {spec.Name}
            </option>
            {spec.AllowOpenText && <option value="OpenText">Write in option</option>}
            {spec.Options.map((o) => (
              <option
                key={o.ID}
                value={o.ID}
              >
                {`${o.Value} ${
                  o.PriceMarkupType !== 'NoMarkup'
                    ? o.PriceMarkupType === 'AmountPerQuantity'
                      ? `(${o.PriceMarkup > 0 ? '+' : '-'}${formatPrice(o.PriceMarkup)})`
                      : `(${o.PriceMarkup}%)`
                    : ''
                }`}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <FormControl>
          <FormLabel>{spec.Name}</FormLabel>
          <Input
            placeholder={spec.Name}
            id={spec.ID}
            onChange={handleInputChange}
            value={value || ''}
          />
        </FormControl>
      )}
    </>
  )
}

export default ProductSpecField

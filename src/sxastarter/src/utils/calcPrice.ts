import { PriceBreak, SpecOption } from 'ordercloud-javascript-sdk';
import { minBy as _minBy } from 'lodash';

export default function calcPrice(
  priceBreaks: PriceBreak[],
  selectedSpecOptions: SpecOption[],
  quantity: number
): number | undefined {
  if (!priceBreaks?.length) return undefined;
  const startingBreak = _minBy(priceBreaks, 'Quantity');
  const selectedBreak = priceBreaks.reduce((current, candidate) => {
    return candidate.Quantity > current.Quantity && candidate.Quantity <= quantity
      ? candidate
      : current;
  }, startingBreak);

  return selectedSpecOptions
    ? getSpecMarkup(selectedSpecOptions, selectedBreak, quantity || startingBreak.Quantity)
    : selectedBreak.Price * (quantity || startingBreak.Quantity);
}

function getSpecMarkup(
  selectedSpecOptions: SpecOption[],
  selectedBreak: PriceBreak,
  qty: number
): number {
  const markups: Array<number> = new Array<number>();

  selectedSpecOptions.forEach((specOption) =>
    markups.push(singleSpecMarkup(selectedBreak.Price, qty, specOption))
  );
  return (selectedBreak.Price + markups.reduce((x, acc) => x + acc, 0)) * qty;
}

function singleSpecMarkup(
  unitPrice: number,
  quantity: number,
  option: SpecOption
): number | undefined {
  if (option) {
    switch (option.PriceMarkupType) {
      case 'NoMarkup':
        return 0;
      case 'AmountPerQuantity':
        return option.PriceMarkup;
      case 'AmountTotal':
        return option.PriceMarkup / quantity;
      case 'Percentage':
        return option.PriceMarkup * unitPrice * 0.01;
      default:
        return undefined;
    }
  }
  return undefined;
}

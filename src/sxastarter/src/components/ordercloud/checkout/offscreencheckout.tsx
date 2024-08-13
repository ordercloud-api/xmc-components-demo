/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FunctionComponent, useState } from 'react';
import OcCheckoutBilling from './OcCheckoutBilling';
import OcCheckoutPayment from './OcCheckoutPayment';
import OcCheckoutReview from './OcCheckoutReview';
import OcCheckoutShipping from './OcCheckoutShipping';
import { VStack } from '@chakra-ui/react';

export interface OcOffScreenCheckoutProps {
  onNext: () => void;
  onPrev: () => void;
}

const OcOffScreenCheckout: FunctionComponent<{ onSubmitted: any }> = ({ onSubmitted }) => {
  const [step, setStep] = useState(0);

  const handlePrevClick = () => {
    setStep((s) => s - 1);
  };

  const handleNextClick = () => {
    setStep((s) => s + 1);
  };

  const handleOrderSubmitted = (orderId: string) => {
    onSubmitted(orderId);
    setStep(0);
  };

  return (
    <VStack w="100%" width="full">
      {step === 0 && <OcCheckoutShipping onPrev={handlePrevClick} onNext={handleNextClick} />}
      {step === 1 && <OcCheckoutBilling onPrev={handlePrevClick} onNext={handleNextClick} />}
      {step === 2 && <OcCheckoutPayment onPrev={handlePrevClick} onNext={handleNextClick} />}
      {step === 3 && (
        <OcCheckoutReview
          onPrev={handlePrevClick}
          onNext={handleNextClick}
          onOrderSubmitted={handleOrderSubmitted}
        />
      )}
    </VStack>
  );
};

export default OcOffScreenCheckout;

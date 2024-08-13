/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FunctionComponent, useState } from 'react'
import OcCheckoutBilling from './OcCheckoutBilling'
import OcCheckoutPayment from './OcCheckoutPayment'
import OcCheckoutReview from './OcCheckoutReview'
import OcCheckoutShipping from './OcCheckoutShipping'
import {
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'

export interface OcAccordionCheckoutProps {
  onNext: () => void
  onPrev: () => void
}

const OcAccordionCheckout: FunctionComponent<{ onSubmitted: any }> = ({ onSubmitted }) => {
  const [step, setStep] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  console.log(step)

  const handlePrevClick = () => {
    //setStep((s) => s - 1);
    setCurrentIndex((s) => s - 1)
  }

  const handleNextClick = () => {
    //setStep((s) => s + 1);
    setCurrentIndex((s) => s + 1)
  }

  const handleOrderSubmitted = (orderId: string) => {
    onSubmitted(orderId)
    setStep(0)
  }

  return (
    <VStack
      w="100%"
      width="full"
    >
      <Accordion
        w="100%"
        width="full"
        defaultIndex={currentIndex}
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize="18px"
              >
                Shipping Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <OcCheckoutShipping
              onPrev={handlePrevClick}
              onNext={handleNextClick}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize="18px"
              >
                Billing Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <OcCheckoutBilling
              onPrev={handlePrevClick}
              onNext={handleNextClick}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize="18px"
              >
                Payment Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <OcCheckoutPayment
              onPrev={handlePrevClick}
              onNext={handleNextClick}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize="18px"
              >
                Review & Checkout
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <OcCheckoutReview
              onPrev={handlePrevClick}
              onNext={handleNextClick}
              onOrderSubmitted={handleOrderSubmitted}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  )
}

export default OcAccordionCheckout

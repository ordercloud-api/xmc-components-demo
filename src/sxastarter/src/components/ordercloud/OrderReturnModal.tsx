import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UseDisclosureProps,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  LineItem,
  Order,
  OrderReturn,
  OrderReturnItem,
  OrderReturns,
} from 'ordercloud-javascript-sdk'
import React, { useCallback, useEffect, useMemo } from 'react'
import formatPrice from 'src/utils/formatPrice'

interface OrderReturnModalProps {
  order: Order
  lineItems: LineItem[]
  disclosure: UseDisclosureProps
}

export const OrderReturnModal = (props: OrderReturnModalProps): JSX.Element => {
  const router = useRouter()
  const [checkedItems, setCheckedItems] = React.useState<boolean[]>([])
  const [quantity, setQuantity] = React.useState<number[]>([])

  const hasItemsSelected = useMemo(
    () => (checkedItems ? !!checkedItems.filter((i: boolean) => !!i).length : false),
    [checkedItems]
  )

  const initializeForm = useCallback(() => {
    setCheckedItems(props.lineItems.map(() => false))
    setQuantity(props.lineItems.map((li: LineItem) => li.Quantity))
  }, [props.lineItems])

  useEffect(() => {
    initializeForm()
  }, [initializeForm])

  const toast = useToast()

  const handleSubmitReturn = useCallback(async () => {
    const itemsToReturn: OrderReturnItem[] = []
    props.lineItems.forEach((li: LineItem, idx: number) => {
      if (!checkedItems[idx]) {
        return
      }
      if (checkedItems[idx]) {
        const returnQuantity = quantity[idx]
        itemsToReturn.push({
          LineItemID: li.ID,
          Quantity: returnQuantity,
          RefundAmount: Number(returnQuantity * li.UnitPrice),
          Comments: '',
        })
      }
    })
    try {
      const returnBody = {
        OrderID: props.order.ID,
        ItemsToReturn: itemsToReturn,
      } as OrderReturn
      const orderReturn = await OrderReturns.Create(returnBody)
      await OrderReturns.Submit(orderReturn.ID)
      router.push(`/my-profile/my-returns/return-details?orderreturnid=${orderReturn.ID}`)
    } catch (ex) {
      toast({
        title: 'Return Error',
        description: ex.message,
        status: 'error',
        duration: 5000,
        position: 'top',
      })
    }
  }, [props.lineItems, props.order?.ID, checkedItems, quantity, router, toast])

  const handleClose = useCallback(() => {
    initializeForm()
    props.disclosure.onClose()
  }, [initializeForm, props.disclosure])

  const handleItemChange = useCallback(
    (e: boolean, idx: number) => {
      const newChecked = [...checkedItems]
      newChecked[idx] = e
      setCheckedItems(newChecked)
    },
    [checkedItems]
  )

  const handleQuantityChange = useCallback(
    (e: string, idx: number) => {
      const newQuantity = [...quantity]
      newQuantity[idx] = Number(e)
      setQuantity(newQuantity)
    },
    [quantity]
  )

  return (
    <Modal
      isOpen={props.disclosure.isOpen}
      onClose={props.disclosure.onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Items to Return</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>
                    <Text fontSize="12px">Product</Text>
                  </Th>
                  <Th>
                    <Text fontSize="12px">Quantity To Return</Text>
                  </Th>
                  <Th>
                    <Text fontSize="12px">Refund Amount</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.lineItems.map((lineItem: LineItem, idx: number) => (
                  <Tr key={lineItem.ID}>
                    <Td>
                      <FormControl>
                        <HStack>
                          <Checkbox
                            size="lg"
                            isChecked={checkedItems && checkedItems[idx]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleItemChange(e.target.checked, idx)
                            }
                          />
                          <VStack
                            textAlign="left"
                            alignContent="flex-start"
                          >
                            <Text
                              width="full"
                              w="100%"
                              minWidth="500px"
                              fontSize="14px"
                            >
                              {lineItem.Product.Name}
                            </Text>
                          </VStack>
                        </HStack>
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl>
                        <NumberInput
                          name={`${lineItem.ID}.QuantityShipped`}
                          min={1}
                          size="sm"
                          maxW="100"
                          max={lineItem.Quantity}
                          isDisabled={!checkedItems || (checkedItems && !checkedItems[idx])}
                          value={quantity && quantity[idx]}
                          onChange={(valueAsString: string) =>
                            handleQuantityChange(valueAsString, idx)
                          }
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </Td>
                    <Td>
                      {checkedItems[idx]
                        ? formatPrice(lineItem.UnitPrice * quantity[idx])
                        : formatPrice(0)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            size="sm"
            onClick={handleSubmitReturn}
            isDisabled={!hasItemsSelected}
          >
            Submit Return
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

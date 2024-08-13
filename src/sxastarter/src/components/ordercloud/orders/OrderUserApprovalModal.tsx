import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UseDisclosureProps,
  useToast,
  Heading,
  FormLabel,
} from '@chakra-ui/react'
import {
  ApprovalRule,
  ApprovalRules,
  Me,
  Product,
  User,
  Users,
} from 'ordercloud-javascript-sdk'
import React, { useCallback, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import Select from 'react-select'

interface OrderUserApprovalModalProps {
  users: User[]
  approvalRule: ApprovalRule
  buyerID: string
  disclosure: UseDisclosureProps
  onUpdateUsers?: () => void
  onUpdateApprovalRule?: () => void
}

export const OrderUserApprovalModal = (props: OrderUserApprovalModalProps): JSX.Element => {
  const [checkedItems, setCheckedItems] = React.useState<boolean[]>([])
  const [expression, setExpression] = React.useState<string>('')
  const [selectedProducts, setselectedProducts] = React.useState<string[]>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resourceOptions, setResourceOptions] = React.useState<any>()
  const [resourceInputValue, setResourceInputValue] = React.useState('')

  const getSubstring = useCallback((startStr: string, endStr: string, str: string) => {
    const pos = str.indexOf(startStr) + startStr.length
    return str.substring(pos, str.indexOf(endStr, pos))
  }, [])

  const initializeForm = useCallback(() => {
    setCheckedItems(props.users.map((u) => !!u?.xp?.needsapproval))
    setExpression(props.approvalRule?.RuleExpression)
    const str = props.approvalRule?.RuleExpression
    if (str) {
      // isolate items in existing promo expression
      const products =
        getSubstring('(', ')', str)
          .split('or')
          .map((t) => getSubstring("'", "'", t)) || ([] as string[])
      setselectedProducts(products)
    }
  }, [getSubstring, props.approvalRule?.RuleExpression, props.users])

  useEffect(() => {
    initializeForm()
  }, [initializeForm])

  useEffect(() => {
    if (selectedProducts?.length) {
      // update items.any() portion of promo expression
      const newProducts = selectedProducts.map((p) => `ProductID = '${p}'`).join(' or ')
      const valueToReplace = getSubstring('(', ')', expression)
      const test = expression.replace(valueToReplace, newProducts)
      setExpression(test)
    }
  }, [expression, getSubstring, selectedProducts])

  const formatProductOptions = useCallback(
    (product: Product) => ({
      value: product.ID,
      label: `${product.Name} | ${product.ID}`,
    }),
    []
  )

  const loadResources = useMemo(
    () =>
      debounce(async (search: string) => {
        const products = await Me.ListProducts({ search })
        setResourceOptions(products.Items.map(formatProductOptions))
      }, 500),
    [formatProductOptions]
  )

  useEffect(() => {
    loadResources(resourceInputValue)
  }, [loadResources, resourceInputValue])

  const toast = useToast()

  const handleClose = useCallback(() => {
    initializeForm()
    props.disclosure.onClose()
  }, [initializeForm, props.disclosure])

  const handlePatchUsers = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userUpdateQueue: Promise<any>[] = []
    props.users.forEach((u: User, idx: number) => {
      if (u?.xp?.needsapproval !== checkedItems[idx]) {
        userUpdateQueue.push(
          Users.Patch(props.buyerID, u.ID, {
            xp: { needsapproval: checkedItems[idx] },
          } as Partial<User>)
        )
      }
    })
    if (userUpdateQueue.length) {
      try {
        // patch users
        await Promise.all(userUpdateQueue)
        props.onUpdateUsers()
      } catch (ex) {
        toast({
          title: 'User Edit Error',
          description: ex.message,
          status: 'error',
          duration: 5000,
          position: 'top',
        })
      }
    }
  }, [checkedItems, props, toast])

  const handlePatchApprovalRule = useCallback(async () => {
    if (expression !== props.approvalRule?.RuleExpression) {
      try {
        await ApprovalRules.Patch(props.buyerID, props.approvalRule.ID, {
          RuleExpression: expression,
        } as Partial<ApprovalRule>)
        props.onUpdateApprovalRule()
      } catch (ex) {
        toast({
          title: 'Approval Rule Error',
          description: ex.message,
          status: 'error',
          duration: 5000,
          position: 'top',
        })
      }
    }
  }, [expression, props, toast])

  const handleItemChange = useCallback(
    (e: boolean, idx: number) => {
      const newChecked = [...checkedItems]
      newChecked[idx] = e
      setCheckedItems(newChecked)
    },
    [checkedItems]
  )

  const handleUpdateSettings = useCallback(async () => {
    await handlePatchUsers()
    await handlePatchApprovalRule()
    handleClose()
  }, [handleClose, handlePatchApprovalRule, handlePatchUsers])

  return (
    <Modal
      isOpen={props.disclosure.isOpen}
      onClose={props.disclosure.onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Approval Rule Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size="sm">Edit User Settings</Heading>
          <TableContainer mb={5}>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>
                    <Text fontSize="14px">Needs Approval</Text>
                  </Th>
                  <Th>
                    <Text fontSize="14px">Username</Text>
                  </Th>
                  <Th>
                    <Text fontSize="14px">Full Name</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.users.map((user: User, idx: number) => (
                  <Tr key={user.ID}>
                    <Td>
                      <FormControl>
                        <Checkbox
                          size="lg"
                          isChecked={checkedItems && checkedItems[idx]}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleItemChange(e.target.checked, idx)
                          }
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <Text
                        width="full"
                        w="100%"
                        fontSize="14px"
                        minWidth="300px"
                      >
                        {user.Username}
                      </Text>
                    </Td>
                    <Td>
                      <Text
                        width="full"
                        w="100%"
                        fontSize="14px"
                        minWidth="300px"
                      >
                        {user.FirstName} {user.LastName}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box>
            <Heading
              size="sm"
              mb={3}
            >
              Add Products to Approval Rule Expression
            </Heading>
            <FormControl mb={3}>
              <Input
                isDisabled={true}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />
            </FormControl>
            <FormLabel>Select Products</FormLabel>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Select
              isMulti
              options={resourceOptions as { value: string; label: string }[]}
              onChange={(e) =>
                setselectedProducts(e.map((i: { value: string; label: string }) => i.value))
              }
              onInputChange={setResourceInputValue}
              isClearable={false}
              value={selectedProducts?.map((p) => {
                return { value: p, label: p }
              })}
              placeholder={`Search products ...`}
            />
          </Box>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUpdateSettings}
          >
            Update Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

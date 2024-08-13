/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Collapse,
  HStack,
  Heading,
  Hide,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'

import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { MdEditNote } from 'react-icons/md'
import formatPrice from 'src/utils/formatPrice'
import Cookies from 'universal-cookie'
import useOcCurrentOrder from '../../../hooks/useOcCurrentOrder'
import { deleteCurrentOrder } from '../../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../../redux/ocStore'
import OcCurrentOrderLineItemList from './OcCurrentOrderLineItemList'

export const Default = (): JSX.Element => {
  const dispatch = useOcDispatch()
  const { isOpen, onClose, onToggle } = useDisclosure()
  const { order, lineItems } = useOcCurrentOrder()
  const [currentCheckoutPath, setCurrentCheckoutPath] = useState('/check-out')

  useEffect(() => {
    const cookies = new Cookies()
    if (cookies.get('currentcheckoutflow') !== null) {
      setCurrentCheckoutPath(cookies.get('currentcheckoutflow'))
    }
  }, [])

  const handleOrderComments = () => {
    onClose()
  }

  function setSubmitting(_value: string) {
    console.log('work-in-progress. it will save to order.Comments')
  }

  return (
    <SimpleGrid
      gridTemplateColumns={lineItems && { lg: '3fr 1fr', xl: '4fr 1fr' }}
      width="full"
      gap={6}
    >
      <VStack alignItems="flex-start">
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="chakra-border-color"
          mb={3}
          pb={3}
        >
          <Heading
            as="h1"
            size="xl"
            color="chakra-placeholder-color"
            textTransform="uppercase"
            fontWeight="300"
          >
            Cart
          </Heading>
          {lineItems?.length !== 0 && (
            <Button
              type="button"
              onClick={() => dispatch(deleteCurrentOrder())}
              variant="outline"
              alignSelf="flex-end"
              size="xs"
            >
              Clear cart
            </Button>
          )}
        </HStack>
        {lineItems?.length !== 0 ? (
          <VStack
            gap={6}
            w="100%"
            width="full"
            alignItems="flex-end"
          >
            <OcCurrentOrderLineItemList
              emptyMessage="Your cart is empty"
              editable
            />
          </VStack>
        ) : (
          <Text alignSelf="flex-start">Your cart is empty</Text>
        )}
      </VStack>
      {lineItems && (
        <Card
          order={{ base: -1, lg: 1 }}
          variant="unstyled"
          borderLeftWidth={{ lg: '1px' }}
          borderLeftColor="chakra-border-color"
          pl={{ lg: 6 }}
        >
          <CardBody
            as={Stack}
            direction={{ base: 'row', lg: 'column' }}
            gap={6}
            w="full"
            alignItems={{ base: 'center', lg: 'flex-start' }}
          >
            <Hide below="md">
              <Heading
                as="h2"
                size="xl"
                color="chakra-placeholder-color"
                textTransform="uppercase"
                fontWeight="300"
              >
                Summary
              </Heading>
            </Hide>
            <Heading
              as="h3"
              size="md"
              fontWeight="normal"
            >
              Subtotal (
              {lineItems
                ?.map((li) => li?.Quantity)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}{' '}
              items):
              <Text
                fontWeight={700}
                display="inline"
              >
                {formatPrice(order?.Subtotal)}
              </Text>
            </Heading>
            <Hide above="md">
              <IconButton
                variant="outline"
                size="sm"
                fontSize="1.15em"
                onClick={onToggle}
                aria-label="add order comments"
                icon={<MdEditNote />}
              />
              <Card
                mt="-3"
                as={Collapse}
                in={isOpen}
                animateOpacity
              >
                <Formik
                  initialValues={{ search: '' }}
                  onSubmit={async (values) => {
                    setSubmitting(values.search)
                  }}
                >
                  <Form>
                    <InputGroup>
                      <Input
                        as={Textarea}
                        variant="outline"
                        placeholder="e.g. Delivery instructions"
                      />
                      <InputRightElement mr="2">
                        <Button
                          size="xs"
                          fontSize=".8em"
                          onClick={handleOrderComments}
                          type="submit"
                        >
                          Save
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Form>
                </Formik>
              </Card>
            </Hide>
            <ButtonGroup
              w="full"
              as={VStack}
              alignItems="flex-start"
            >
              <Hide below="md">
                <Button
                  variant="ghost"
                  colorScheme="neutral"
                  size="xs"
                  onClick={onToggle}
                >
                  Add order comments
                </Button>
                <Card
                  variant="unstyled"
                  as={Collapse}
                  in={isOpen}
                  animateOpacity
                >
                  {/* TODO: finish adding order comments */}
                  <Formik
                    initialValues={{ search: '' }}
                    onSubmit={async (values) => {
                      setSubmitting(values.search)
                    }}
                  >
                    <Form>
                      <InputGroup>
                        <Input
                          as={Textarea}
                          variant="outline"
                          placeholder="e.g. Delivery instructions"
                        />
                        <InputRightElement mr="2">
                          <Button
                            size="xs"
                            fontSize=".8em"
                            onClick={handleOrderComments}
                            type="submit"
                          >
                            Save
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Form>
                  </Formik>
                </Card>
              </Hide>
              <NextLink
                style={{ width: '100%', marginTop: 'auto' }}
                href={currentCheckoutPath}
                passHref
              >
                <Button
                  as={Link}
                  size={{ base: 'sm', lg: 'lg' }}
                  fontSize="lg"
                  colorScheme="green"
                  w={{ lg: 'full' }}
                  _hover={{ textDecoration: 'none' }}
                >
                  Proceed to checkout
                </Button>
              </NextLink>
            </ButtonGroup>
          </CardBody>
        </Card>
      )}
    </SimpleGrid>
  )
}

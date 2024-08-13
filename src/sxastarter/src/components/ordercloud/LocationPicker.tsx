import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
//import AddressCard from './cards/AddressCard';
import { Address } from 'ordercloud-javascript-sdk'
import Cookies from 'universal-cookie'
import { InputControl } from 'formik-chakra-ui'
import { Form, Formik } from 'formik'

export const Default = (): JSX.Element => {
  const [selectedAddress] = useState([] as Address[])
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  useEffect(() => {
    const cookies = new Cookies()
    selectedAddress == cookies.get('currentcheckoutflow')
    //console.log(selectedAddress)
  }, [selectedAddress])

  function setSubmitting(term: string) {
    console.log(term)
  }
  //type Stores = 'Lakeville' | 'Chicago';

  return (
    <VStack
      w="100%"
      width="full"
      textAlign="center"
      alignItems="center"
      p={4}
    >
      <HStack
        w="100%"
        width="full"
        textAlign="left"
        alignItems="center"
        maxW="1500px"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
          aria-hidden="true"
          fontSize="30px"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
        </svg>
        <div>
          <span>
            <strong>
              Lakeville<span> - 0 minutes wait time</span>
            </strong>
            <br />
            <p>
              17189 Kenyon Ave.,&nbsp;Lakeville,&nbsp;
              <span>
                MN -&nbsp;13.87&nbsp;mi&nbsp;
                <a
                  href="#"
                  id="locationlabel-Lakeville"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  (Change)
                </a>
              </span>
            </p>
          </span>
        </div>
      </HStack>
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          w="100%"
          width="full"
          maxWidth="700px"
        >
          <ModalHeader>Search for location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <HStack
                justifyContent="space-between"
                w="100%"
                width="full"
              >
                <Formik
                  initialValues={{ search: '' }}
                  onSubmit={async (values) => {
                    setSubmitting(values.search)
                  }}
                >
                  <Form>
                    <HStack
                      w="100%"
                      width="full"
                    >
                      <InputControl
                        name="search"
                        inputProps={{
                          placeholder: 'search',
                          border: '1px',
                          borderColor: 'gray.300',
                          height: '41px',
                          color: 'gray.500',
                          background: 'none',
                        }}
                        label=""
                      />

                      <Button
                        mt="0px"
                        pt="10px"
                        pb="10px"
                        pl="20px"
                        pr="20px"
                        bg="brand.500"
                        type="submit"
                        color="white"
                        fontSize="x-small"
                        right="-7px"
                      >
                        Search
                      </Button>
                    </HStack>
                  </Form>
                </Formik>
                <HStack
                  width="50px"
                  textAlign="center"
                  pr="30px"
                  pl="30px"
                >
                  <Text>Or</Text>
                </HStack>
                <HStack
                  width="150px"
                  textAlign="center"
                  justifyContent="space-between"
                >
                  <a href="#">
                    <HStack
                      w="100%"
                      width="150px"
                      pr="30px"
                      pl="30px"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                        role="presentation"
                        aria-hidden="true"
                        fontSize="30px"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                      </svg>
                      <Text
                        as="div"
                        width="100px"
                      >
                        Use My Location
                      </Text>
                    </HStack>
                  </a>
                </HStack>
              </HStack>
              <HStack
                mt={30}
                justifyContent="space-between"
                w="100%"
                width="full"
              >
                <Text>
                  Lakeville <br />
                  17189 Kenyon Ave., <br />
                  Lakeville, MN <br />- 13.87 mi{' '}
                  <a
                    href="#"
                    onClick={() => setIsAddressModalOpen(false)}
                  >
                    (Confirm)
                  </a>
                </Text>
                <Text>
                  <a href="#">MAP VIEW</a>
                </Text>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

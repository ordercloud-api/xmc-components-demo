import {
  HStack,
  VStack,
  Text,
  Button,
  Box,
  Heading,
  Image,
  Flex,
  GridItem,
  Grid,
  Link,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'

export const Default = (): JSX.Element => {
  const [chatBotProgress, setChatBotProgress] = useState(0)
  //console.log('Chat Bot Progress' + chatBotProgress);
  const [isConciergeModalOpen, setIsConciergeModalOpen] = useState(false)

  return (
    <VStack>
      <div className="component image col-12 ">
        <div className="component-content">
          <a href="">
            <img
              alt=""
              width="1810"
              height="354"
              src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/PetsGalore_StaticHeader.jpg?h=354&amp;iar=0&amp;w=1810"
            />
          </a>
        </div>
      </div>
      <div className="component image col-12 pointer ">
        <div
          className="component-content"
          onClick={() => setIsConciergeModalOpen(true)}
        >
          <img
            alt=""
            width="1810"
            height="661"
            src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/PromoChat.jpg?h=661&amp;iar=0&amp;w=1810"
          />
        </div>
      </div>
      <div className="component image col-12 ">
        <div className="component-content">
          <a href="">
            <img
              alt=""
              width="1777"
              height="1168"
              src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/homepage_full.jpg?h=1168&amp;iar=0&amp;w=1777"
            />
          </a>
        </div>
      </div>
      <Modal
        isOpen={isConciergeModalOpen}
        onClose={() => setIsConciergeModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          width="100%"
          w="full"
          maxW="700px"
          background="boxBgColor.300"
          borderRadius="25px"
          shadow="xl"
        >
          <ModalCloseButton
            fontSize="24px"
            color="brand.500"
            mt="15px"
            mr="15px"
            fontWeight="bold"
          />
          <ModalBody>
            <VStack
              w="100%"
              width="full"
              textAlign="center"
              alignItems="center"
              p={4}
            >
              <VStack
                w="100%"
                width="full"
                textAlign="left"
                alignItems="center"
                maxW="700px"
              >
                <Box
                  width="full"
                  textAlign="left"
                  p="40px"
                  position="relative"
                  pt="60px"
                  pb="100px"
                >
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 0 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <Box
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      color="white"
                      maxW="50%"
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(2)}
                        fontWeight="bold"
                      >
                        I hope <b>Gizmo</b> likes his new food that you picked up, can I help you
                        with that or something else?
                      </Text>
                    </Box>
                  </HStack>
                  <HStack
                    width="100%"
                    display={chatBotProgress > 1 ? 'flex' : 'none'}
                    justifyContent="flex-end"
                    justifyItems="flex-end"
                  >
                    <Flex
                      textAlign="left"
                      p="30px"
                      background="brand.300"
                      borderRadius="md"
                      fontSize="18px"
                      float="right"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(3)}
                        fontWeight="bold"
                      >
                        When I was there, I forgot to ask how often do I feed him the new food?
                      </Text>
                    </Flex>
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_chat_sent.png?width=78px"
                      width="78px"
                      mb="20px"
                    ></Image>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 2 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <Flex
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 2 ? 'flex' : 'none'}
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(4)}
                        fontWeight="bold"
                      >
                        The plan for <b>Gizmo</b> will be once a day and ideally around when you eat
                        dinner. The food you purchased is a high protein blend that will help with
                        weight control and keep him from being hungry throughout the day.
                      </Text>
                    </Flex>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 3 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <Flex
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 3 ? 'flex' : 'none'}
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(5)}
                        fontWeight="bold"
                      >
                        The bag should last you 4-5 weeks. Would you like me to send a reminder
                        email in 30 days? I can also help you with a subscription plan when you are
                        ready to order online and have it delivered to you.
                      </Text>
                    </Flex>
                  </HStack>
                  <HStack
                    width="100%"
                    display={chatBotProgress > 4 ? 'flex' : 'none'}
                    justifyContent="flex-end"
                    justifyItems="flex-end"
                  >
                    <Flex
                      textAlign="left"
                      alignContent="flex-end"
                      p="30px"
                      background="brand.300"
                      borderRadius="md"
                      fontSize="18px"
                      float="right"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 4 ? 'flex' : 'none'}
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(6)}
                        fontWeight="bold"
                      >
                        Sign me up for the email alerts. I will think about signing up for a
                        recurring order at a later date. Are there toys that will help with keeping
                        him active that you could suggest?
                      </Text>
                    </Flex>
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_chat_sent.png?width=78px"
                      width="78px"
                      mb="20px"
                    ></Image>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 5 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <Flex
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 5 ? 'flex' : 'none'}
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(7)}
                        fontWeight="bold"
                      >
                        <b>gizmomom@gmail.com</b> has been added to our email notifications for
                        reminders of when to order food next.
                      </Text>
                    </Flex>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 6 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <VStack
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="100%"
                      color="white"
                      display={chatBotProgress > 6 ? 'flex' : 'none'}
                      fontWeight="bold"
                    >
                      <Text
                        width="100%"
                        mb="10px"
                        display="block"
                      >
                        Here are our top selling toys that will keep him active.
                      </Text>
                      <HStack
                        width="100%"
                        alignContent="space-around"
                      >
                        <VStack width="100%">
                          <Image src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/5296840.png?h=100"></Image>
                          <Text mb="0px">Exercise balls</Text>
                          <Text>$9</Text>
                          <Button bgColor="brand.300">Add to cart</Button>
                        </VStack>
                        <VStack width="100%">
                          <Image src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/5319643.png?h=100"></Image>
                          <Text mb="0px">JW Pet® Hol-ee Giggler</Text>
                          <Text>$10</Text>
                          <Button
                            bgColor="brand.300"
                            onClick={() => setChatBotProgress(8)}
                          >
                            Add to cart
                          </Button>
                        </VStack>
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack
                    width="100%"
                    display={chatBotProgress > 7 ? 'flex' : 'none'}
                    justifyContent="flex-end"
                    justifyItems="flex-end"
                  >
                    <Flex
                      textAlign="left"
                      alignContent="flex-end"
                      p="30px"
                      background="brand.300"
                      borderRadius="md"
                      fontSize="18px"
                      float="right"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 7 ? 'flex' : 'none'}
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(9)}
                        fontWeight="bold"
                      >
                        Can you show me tech gadgets?
                      </Text>
                    </Flex>
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_chat_sent.png?width=78px"
                      width="78px"
                      mb="20px"
                    ></Image>
                  </HStack>

                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 8 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <VStack
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="100%"
                      color="white"
                      display={chatBotProgress > 8 ? 'flex' : 'none'}
                      fontWeight="bold"
                    >
                      <Text
                        width="100%"
                        mb="10px"
                      >
                        These are the trending tech gadgets for dog owners with similar age and
                        breed dogs!
                      </Text>
                      <HStack width="100%">
                        <VStack width="100%">
                          <Image src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/whistlecollar.png?h=100"></Image>
                          <Text>Smart Tracker</Text>
                          <Text>$199</Text>
                          <Button
                            onClick={() => setChatBotProgress(10)}
                            bgColor="brand.300"
                          >
                            Add to cart
                          </Button>
                        </VStack>
                        <VStack width="100%">
                          <Image src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/BallChaser.png?h=100"></Image>
                          <Text>Racing Rabbit</Text>
                          <Text>$299</Text>
                          <Button bgColor="brand.300">Add to cart</Button>
                        </VStack>
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack
                    width="100%"
                    display={chatBotProgress > 9 ? 'flex' : 'none'}
                    justifyContent="flex-end"
                    justifyItems="flex-end"
                  >
                    <Flex
                      textAlign="left"
                      alignContent="flex-end"
                      p="30px"
                      background="brand.300"
                      borderRadius="md"
                      fontSize="18px"
                      float="right"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 9 ? 'flex' : 'none'}
                    >
                      <Text
                        mb="0px"
                        onClick={() => setChatBotProgress(11)}
                        fontWeight="bold"
                      >
                        Ok, I&#39;m ready to check-out.
                      </Text>
                    </Flex>
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_chat_sent.png?width=78px"
                      width="78px"
                      mb="20px"
                    ></Image>
                  </HStack>

                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 10 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <VStack
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="100%"
                      color="white"
                      display={chatBotProgress > 10 ? 'flex' : 'none'}
                      fontWeight="bold"
                    >
                      <Text
                        width="100%"
                        mb="10px"
                      >
                        Shopping Cart
                      </Text>
                      <Grid
                        width="100%"
                        column={4}
                        columnGap={10}
                      >
                        <GridItem width="100%">
                          <HStack
                            background="brand.300"
                            pl="20px"
                            pr="20px"
                            pt="10px"
                            pb="10px"
                            mb="15px"
                          >
                            <Text
                              fontSize="14px"
                              textTransform="uppercase"
                              mb="0px"
                            >
                              Product Information
                            </Text>
                          </HStack>
                        </GridItem>
                        <GridItem
                          width="100%"
                          borderBottom="1px"
                          borderColor="brand.300"
                        >
                          <HStack width="100%">
                            <Image
                              src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/whistlecollar.png?h=100"
                              width="100%"
                            ></Image>
                            <VStack
                              width="100%"
                              textAlign="left"
                            >
                              <Text mb="0px">Smart Tracker</Text>
                              <Text fontSize="14px">Item #: sc-track-001</Text>
                              <Button
                                variant="link"
                                textDecoration="underline"
                                width="100%"
                                color="white"
                                textAlign="left"
                              >
                                Remove
                              </Button>
                            </VStack>
                            <Text
                              width="100%"
                              textAlign="center"
                            >
                              $199
                            </Text>
                          </HStack>
                          <HStack width="100%">
                            <Image
                              src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/5319643.png?h=100"
                              width="100%"
                            ></Image>
                            <VStack
                              width="100%"
                              textAlign="left"
                            >
                              <Text mb="0px">JW Pet® Hol-ee Giggler®</Text>
                              <Text fontSize="14px">Item #: dty-jwpet-001</Text>
                              <Button
                                variant="link"
                                textDecoration="underline"
                                width="100%"
                                color="white"
                                textAlign="left"
                              >
                                Remove
                              </Button>
                            </VStack>
                            <Text
                              width="100%"
                              textAlign="center"
                            >
                              $10
                            </Text>
                          </HStack>
                        </GridItem>
                      </Grid>
                      <Button
                        onClick={() => setChatBotProgress(12)}
                        backgroundColor="brand.300"
                      >
                        Check out
                      </Button>
                    </VStack>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 11 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <VStack
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="auto"
                      maxW="50%"
                      color="white"
                      display={chatBotProgress > 11 ? 'flex' : 'none'}
                      fontWeight="bold"
                    >
                      <Text
                        width="100%"
                        mb="10px"
                      >
                        Would you like to add a subscription to have <b>Gizmo&#39;s</b> activity
                        sent to your phone? &nbsp;&nbsp;<a href="#">Learn more</a>
                      </Text>
                      <HStack width="100%">
                        <Button
                          onClick={() => setChatBotProgress(13)}
                          backgroundColor="brand.300"
                        >
                          Yes
                        </Button>
                        <Button variant="secondaryButton">No</Button>
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 12 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <VStack
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="100%"
                      color="white"
                      display={chatBotProgress > 12 ? 'flex' : 'none'}
                      fontWeight="bold"
                    >
                      <Text
                        width="100%"
                        mb="10px"
                      ></Text>

                      <HStack width="100%">
                        <Image
                          src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/Payment.png?h=167"
                          width="228px"
                          onClick={() => setChatBotProgress(14)}
                        ></Image>
                        <VStack
                          width="100%"
                          textAlign="left"
                          ml="30px"
                        >
                          <Heading
                            fontSize="18px"
                            width="100%"
                            textAlign="left"
                          >
                            My Current Order
                          </Heading>
                          <Divider></Divider>
                          <Text
                            width="100%"
                            textAlign="left"
                          >
                            Order Total: $450.00
                          </Text>
                          <Text
                            width="100%"
                            textAlign="left"
                          >
                            Order Status: Ready for pick up
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack
                    textAlign="left"
                    mb="20px"
                    width="auto"
                    display={chatBotProgress > 13 ? 'flex' : 'none'}
                  >
                    <Image
                      src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                      width="78px"
                    ></Image>
                    <VStack
                      textAlign="left"
                      p="30px"
                      background="brand.500"
                      borderRadius="md"
                      fontSize="18px"
                      mb="20px"
                      width="100%"
                      color="white"
                      display={chatBotProgress > 13 ? 'flex' : 'none'}
                      fontWeight="bold"
                    >
                      <Text
                        width="100%"
                        mb="10px"
                      ></Text>
                      <HStack
                        width="100%"
                        textAlign="left"
                      >
                        <VStack
                          width="100%"
                          textAlign="left"
                          alignItems="flex-start"
                          alignContent="flex-start"
                        >
                          <Text
                            width="100%"
                            textAlign="left"
                          >
                            Invoice Id: 13674847
                          </Text>
                          <Text
                            width="100%"
                            textAlign="left"
                            mb="0px"
                            fontSize="15px"
                          >
                            Sara Customer
                          </Text>
                          <Text
                            width="100%"
                            textAlign="left"
                            mb="0px"
                            fontSize="15px"
                          >
                            123 First Street
                          </Text>
                          <Text
                            width="100%"
                            textAlign="left"
                            mb="0px"
                            fontSize="15px"
                          >
                            Minneapolis, MN 55437
                          </Text>
                          <VStack
                            width="100%"
                            mt="15px"
                          >
                            <Link
                              href="#"
                              width="100%"
                              textAlign="left"
                              textDecor="underline"
                            >
                              <Text fontSize="15px">View order details</Text>
                            </Link>
                          </VStack>
                          <Image src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/qrcode67335566.png?h=100"></Image>
                        </VStack>
                        <Image
                          src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/shoppingbag.png"
                          width="100%"
                        ></Image>
                      </HStack>
                    </VStack>
                  </HStack>

                  <Box
                    width="100%"
                    position="relative"
                    height="63px"
                    bgColor="white"
                    maxW="560px"
                    borderRadius="70px"
                  >
                    <Input
                      padding="20px"
                      pl="40px"
                      width="100%"
                      value="Say something..."
                      fontWeight="bold"
                      fontSize="20px"
                      height="63px"
                      border="0px"
                      backgroundColor="transparent"
                    ></Input>
                    <Button
                      onClick={() => setChatBotProgress(1)}
                      variant="unstyled"
                      position="absolute"
                      right="20px"
                      top="20%"
                    >
                      <Image
                        src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_char_send.jpg?width=27px"
                        maxWidth="27px"
                        width="27px"
                        height="33px"
                      ></Image>
                    </Button>
                  </Box>
                  <HStack
                    position="absolute"
                    width="100%"
                    bottom="-37px"
                  >
                    <Box
                      position="absolute"
                      right="-50px"
                      bottom="-70px"
                      border="15px"
                      borderColor="brand.300"
                      borderStyle="solid"
                      borderRadius="50%"
                    >
                      <Image
                        src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_concierge.png?width=78px"
                        border="15px"
                        maxW="160px"
                        borderColor="brand.500"
                        borderStyle="solid"
                        borderRadius="50%"
                      ></Image>
                    </Box>
                    <Box
                      width="100%"
                      maxW="300px"
                      backgroundColor="brand.500"
                      borderTopLeftRadius="20px"
                      borderBottomLeftRadius="20px"
                      position="absolute"
                      right="109px"
                      bottom="-16px"
                    >
                      <VStack
                        alignContent="flex-start"
                        p="20px"
                        gap="0px"
                        pl="30px"
                      >
                        <HStack
                          width="100%"
                          alignContent="flex-start"
                        >
                          <VStack width="100%">
                            <Text
                              color="white"
                              fontSize="20px"
                              mb="0px"
                              fontWeight="bold"
                              width="100%"
                              textAlign="left"
                              lineHeight="18px"
                              pb="8px"
                            >
                              Got a question?
                            </Text>
                            <Text
                              color="brand.300"
                              fontSize="20px"
                              mb="0px"
                              width="100%"
                              textAlign="left"
                              lineHeight="18px"
                            >
                              We&#39;re here to help!
                            </Text>
                          </VStack>
                          <Image
                            src="https://edge.sitecorecloud.io/sitecoresaa198b-ordercloudba502-development-db0b/media/Project/Order-Cloud-Buyer-Consumer/Pets-Galore/icon_green_send.jpg?width=31px"
                            maxWidth="31px"
                            width="31px"
                            height="34px"
                          ></Image>
                        </HStack>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

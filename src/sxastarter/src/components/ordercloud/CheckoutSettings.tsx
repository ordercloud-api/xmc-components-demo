import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
  Select,
  List,
  ListItem,
  ListIcon,
  DrawerFooter,
  VStack,
  Box,
  Button,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { HiCheckCircle, HiOutlineCog } from 'react-icons/hi';
import Cookies from 'universal-cookie';
import { useEffect } from 'react';
export const Default = (): JSX.Element => {
  const cookies = new Cookies();
  let currentcheckoutflow = '/check-out-points';
  if (cookies.get('currentcheckoutflow') !== null) {
    currentcheckoutflow = cookies.get('currentcheckoutflow');
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const cookies = new Cookies();

    const checkout_cookie = cookies.get('currentcheckoutflow');
    if (!checkout_cookie) {
      //console.log("Added new cookie")
      cookies.set('currentcheckoutflow', '/check-out-points', {
        path: '/',
      });
    }
  });

  // This function is triggered when the select changes
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    //setSelectedOption(value);
    const cookies = new Cookies();
    cookies.set('currentcheckoutflow', value, {
      path: '/',
    });
    //Reload page so the theme takes affect
    window.location.reload();
  };

  return (
    <VStack width="full">
      <Box position="absolute" right="3px" top="4px" zIndex="9999999999">
        <Button onClick={onOpen} variant="unstyled">
          <Icon as={HiOutlineCog} fontSize="24px" color="#fff" />
        </Button>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="xl" /*finalFocusRef={btnRef}*/
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Application Settings</DrawerHeader>

          <DrawerBody>
            <Text mt="10">Configure checkout flow:</Text>
            <Select
              id="FlowDropdown"
              onChange={selectChange}
              placeholder="Select a flow"
              value={currentcheckoutflow}
            >
              <option value="/check-out">Single page flow</option>
              <option value="/check-out-points">Single page points flow</option>
              <option value="/check-out-bopis">Bopis Item flow</option>
              <option value="/check-out-stepped">Stepped flow</option>
              <option value="/check-out-accordion">Accordion flow</option>
              <option value="/check-out-off-canvas">Off Canvas flow</option>
              <option value="/check-out-quote">Quote flow</option>
            </Select>
            <List ml="0px">
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Single Page Flow:</b> is based of an Amazon checkout where everything is done on
                one page.
              </ListItem>
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Points Flow:</b> is a flow designed to allow a user to shop with a spending
                account and redeem products via points.
              </ListItem>
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Bopis item Flow:</b> is a flow designed to allow a user to shop for buy online
                pickup in-store items or shippable products and pay with a credit card or with a
                spending account and redeem with points.
              </ListItem>
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Stepped Flow:</b> is the traditional flow that takes the user through a few steps
                to complete the checkout.
              </ListItem>
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Accordion Flow:</b> is similar to the stepped flow but everything is on one page
                and the user goes through each stepped presented in a accordion.
              </ListItem>
              {/* You can also use custom icons from react-icons */}
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Off Canvas Flow:</b> is a check out flow that slides in from the side and the
                checkout is completed in the side window.
              </ListItem>
              <ListItem mb="20px" fontSize="14px">
                <ListIcon as={HiCheckCircle} color="green.500" />
                <b>Quote Flow:</b> this flow is designed to be used to allow the user to request a
                price quote for a specific product. This will have a workflow where the admin will
                be able to send back a price for the customer to approve and buy or continue to
                negotiate the price.
              </ListItem>
            </List>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

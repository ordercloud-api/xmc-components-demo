/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  List,
  ListIcon,
  ListItem,
  Select,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
} from 'react-icons/hi';

import CategoryNavigationList from '../categories/CategoryNavigationList';
import Cookies from 'universal-cookie';
import { HiCheckCircle } from 'react-icons/hi';
import NextLink from 'next/link';
import React from 'react';
import useOcCurrentOrder from 'src/hooks/useOcCurrentOrder';
import { useOcSelector } from 'src/redux/ocStore';

// import FEAASProductCard from "./cards/ProductCard_feaas"
const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ComponentProps): JSX.Element => {
  let backgroundImage = props.params.BackgroundImage as string;

  if (backgroundImage) {
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
  }

  const { isOpen, onClose } = useDisclosure();
  const { isOpen: isCategoryOpen, onClose: onCategoryClose } = useDisclosure();

  const { lineItems } = useOcCurrentOrder();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }));

  const btnRef = React.useRef();
  const btnCategoryRef = React.useRef();
  const color = useColorModeValue('textColor.900', 'textColor.100');
  // This function is triggered when the select changes
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const cookies = new Cookies();
    cookies.set('currentcheckoutflow', value, {
      path: '/',
    });
    //Reload page so the theme takes affect
    window.location.reload();
  };
  const cookies = new Cookies();
  let currentcheckoutflow = '/check-out';
  if (cookies.get('currentcheckoutflow') !== null) {
    currentcheckoutflow = cookies.get('currentcheckoutflow');
  }
  return (
    <HStack justifyContent="flex-end">
      <HStack>
        {!isAnonymous ? (
          <NextLink href="/logout" passHref>
            <Link color="gray.800">
              <HStack>
                <HiOutlineLockOpen fontSize="36px" color="gray.800" /> Logout
              </HStack>
            </Link>
          </NextLink>
        ) : (
          <Spacer></Spacer>
        )}
      </HStack>
      <HStack>
        {!isAnonymous ? (
          <NextLink href="/my-profile" passHref>
            <Link color="gray.800">
              <HStack>
                <HiOutlineUserCircle fontSize="36px" color="gray.800" /> My Profile
              </HStack>
            </Link>
          </NextLink>
        ) : (
          <NextLink href="/login" passHref>
            <Link color="gray.800">
              <HStack>
                <HiOutlineLockClosed fontSize="36px" color="gray.800" /> Member Sign-In
              </HStack>
            </Link>
          </NextLink>
        )}
      </HStack>
      <NextLink href="/my-profile/my-favorites" passHref>
        <Link color="gray.800">
          <HStack position="relative">
            <HiOutlineHeart fontSize="36px" color="gray.800" />
            <Box height="8px" width="8px" position="absolute" top="24px" left="10px">
              <IconButton
                aria-label="Favorite Products"
                color="brand.500"
                size="xs"
                p="2px"
                pr="4px"
                pl="4px"
              >
                <Text fontSize="16px" color="white">
                  0
                </Text>
              </IconButton>
            </Box>
          </HStack>
        </Link>
      </NextLink>
      <NextLink href="/shopping-cart" passHref>
        <Link>
          <HStack position="relative">
            <IconButton
              icon={<HiOutlineShoppingBag color="gray.800" />}
              aria-label="Shopping Cart"
              variant="link"
              fontSize="36px"
              size="lg"
              color="gray.800"
            />
            <Box height="14px" width="14px" position="absolute" top="24px" left="14px">
              <IconButton
                aria-label="Items in cart"
                bgColor="brand.500"
                color="white"
                size="xs"
                p="2px"
                pr="4px"
                pl="4px"
              >
                <Text fontSize="16px">{lineItems && lineItems.length ? lineItems.length : 0}</Text>
              </IconButton>
            </Box>
            <Box position="absolute" top="3px" left="30px" color="gray.800">
              {/* <Text>{formatPrice(order.Total)}</Text> */}
            </Box>
          </HStack>
        </Link>
      </NextLink>
      <Drawer
        isOpen={isCategoryOpen}
        placement="left"
        onClose={onCategoryClose}
        finalFocusRef={btnCategoryRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={color}>Categories</DrawerHeader>

          <DrawerBody color={color}>
            <CategoryNavigationList></CategoryNavigationList>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={color}>Application Settings</DrawerHeader>

          <DrawerBody color={color}>
            <Text mt="10">Configure checkout flow:</Text>
            <Select
              id="ThemeDropdown"
              onChange={selectChange}
              placeholder="Select a flow"
              value={currentcheckoutflow}
            >
              <option value="/check-out">Single page flow</option>
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
                price quote for a specific product. This will have a workflow where the amin will be
                able to send back a price for the customer to approve and buy or continue to
                negotiate the price.
              </ListItem>
            </List>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
};

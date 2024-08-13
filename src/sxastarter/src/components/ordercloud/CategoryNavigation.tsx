/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import CategoryNavigationList from './categories/CategoryNavigationList';
import { HiChevronDown, HiMenu } from 'react-icons/hi';
import { buildStylesObj } from 'src/utils/formatStyles';

interface Fields {
  Title: Field<string>;
  DrawerTitle: Field<string>;
  CategoryID: Field<string>;
}

type ComponentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const stylesObj = buildStylesObj(containerStyles);

  const {
    isOpen: isCategoryOpen,
    onOpen: onCategoryOpen,
    onClose: onCategoryClose,
  } = useDisclosure();
  const color = useColorModeValue('textColor.900', 'textColor.100');

  return (
    <Button
      onClick={onCategoryOpen}
      variant="unstyled"
      rightIcon={<HiChevronDown />}
      leftIcon={<HiMenu />}
      bg="brand.500"
      color="white"
      fontSize="18px"
      mr="4"
      p="10px"
      rounded="md"
      className={`category-navigation`}
      height="46px"
      minW="auto"
      ml="188px"
      {...stylesObj}
    >
      {props.fields.Title.value}

      <Drawer
        isOpen={isCategoryOpen}
        placement="left"
        onClose={onCategoryClose}
        size="lg"
        // finalFocusRef={btnCategoryRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={color} fontSize="18px">
            {props.fields.DrawerTitle.value}
          </DrawerHeader>

          <DrawerBody color={color}>
            <CategoryNavigationList></CategoryNavigationList>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Button>
  );
};

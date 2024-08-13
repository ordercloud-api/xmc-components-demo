/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { Box, HStack, IconButton, Text, Link } from '@chakra-ui/react';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import NextLink from 'next/link';
import useOcCurrentOrder from 'src/hooks/useOcCurrentOrder';

interface Fields {
  Title: Field<string>;
  Icon: Field<string>;
  CallToAction: LinkField;
}

type ComponentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const { lineItems } = useOcCurrentOrder();

  return (
    <NextLink href={props.fields.CallToAction.value.href} passHref>
      <Link className={`shopping-cart-icon ${styles}`}>
        <HStack position="relative">
          <IconButton
            icon={<HiOutlineShoppingBag color="gray.800" />}
            aria-label={props.fields.Title.value}
            variant="link"
            fontSize="36px"
            size="lg"
            color="gray.800"
          />
          <Box height="20px" width="20px" position="absolute" top="12px" left="18px">
            <IconButton
              aria-label={props.fields.Title.value}
              bgColor="brand.500"
              color="white"
              size="sm"
              p="2px"
              pr="4px"
              pl="4px"
            >
              <Text fontSize="16px" fontWeight="bold" mb="0px">
                {lineItems && lineItems.length ? lineItems.length : 0}
              </Text>
            </IconButton>
          </Box>
          <Box position="absolute" top="3px" left="30px" color="gray.800">
            {/* <Text>{formatPrice(order.Total)}</Text> */}
          </Box>
        </HStack>
      </Link>
    </NextLink>
  );
};

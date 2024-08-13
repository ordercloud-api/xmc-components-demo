/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Field,
  LinkField,
  useSitecoreContext,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Box, Container, HStack, VStack } from '@chakra-ui/react';

import ProductPromoCard from './products/ProductPromoCard';
import React from 'react';
import { useRouter } from 'next/router';

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface Fields {
  ProductID: Field<string>;
  CallToAction: LinkField;
  BackgroundImage: ImageField;
}

type ProductPromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ProductPromoProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  let backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};

  const { push } = useRouter();

  const handleLineItemUpdated = () => {
    push('/cart');
  };

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    };
  }

  return (
    <VStack className={`component ${styles}`} as="section" w="100%" width="full" pb="40px">
      <Box
        as="section"
        w="100%"
        width="full"
        style={backgroundStyle}
        alignSelf="stretch"
        justifyContent="stretch"
      >
        <HStack w="100%" width="full">
          <ProductPromoCard
            onLineItemUpdated={handleLineItemUpdated}
            productId={props.fields.ProductID.value}
            submitButton={props.fields.CallToAction}
            backgroundImage={props.fields.BackgroundImage}
            styles={styles}
          />
        </HStack>
      </Box>
    </VStack>
  );
};
export const ProductPromo = (props: ProductPromoProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  let backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};

  const { push } = useRouter();

  const handleLineItemUpdated = () => {
    push('/cart');
  };

  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    };
  }

  return (
    <VStack
      className={`component container ${styles}`}
      as="section"
      w="100%"
      width="full"
      pt="40px"
      mt="30px"
      pb="0px!important"
    >
      <HStack
        as="section"
        w="100%"
        width="full"
        className="component-content"
        style={backgroundStyle}
      >
        <Container w="100%" width="full">
          <ProductPromoCard
            onLineItemUpdated={handleLineItemUpdated}
            productId={props.fields.ProductID.value}
            submitButton={props.fields.CallToAction}
            backgroundImage={props.fields.BackgroundImage}
            styles={styles}
          />
        </Container>
      </HStack>
    </VStack>
  );
};

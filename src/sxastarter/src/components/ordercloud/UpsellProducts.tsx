/* eslint-disable @typescript-eslint/no-unused-vars */

import { BuyerProduct, Me } from 'ordercloud-javascript-sdk';
import { GridItem, HStack, SimpleGrid, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import ProductCard from './cards/ProductCard';
import { useRouter } from 'next/router';

export const Default = (): JSX.Element => {
  const [products, setProducts] = useState([] as BuyerProduct[]);

  const currentProductId = useRouter().query.productid as string;

  useEffect(() => {
    async function initialize() {
      console.log('Upsell products loaded');
      console.log(currentProductId);
      const currentProduct = await Me.GetProduct(currentProductId);
      // console.log(currentProduct);
      if (currentProduct.xp?.UpsellProduct.length > 0) {
        const response = await Me.ListProducts({
          filters: { ID: currentProduct.xp?.UpsellProduct.join('|') },
        });
        setProducts(response.Items);
      }
    }
    if (currentProductId) initialize();
  }, [currentProductId]);

  return (
    <VStack>
      {products.length > 0 && (
        <VStack
          className={`component upsell-products container`}
          as="section"
          w="100%"
          width="full"
          pt="40px"
          pb="40px"
          mt="30px"
          bg="gray.200"
          maxW="1280px"
        >
          <HStack as="section" w="100%" width="full">
            <SimpleGrid
              columns={3}
              spacing={5}
              pl="30"
              pr="30"
              rounded="xl"
              alignSelf="stretch"
              justifyContent="stretch"
            >
              {products &&
                products.map((p) => (
                  <GridItem
                    key={p.ID}
                    colSpan={1}
                    rowSpan={1}
                    w="full"
                    width="100%"
                    rounded="lg"
                    h="full"
                    alignSelf="stretch"
                    justifyContent="stretch"
                    display="flex"
                  >
                    {<ProductCard product={p} />}
                  </GridItem>
                ))}
            </SimpleGrid>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

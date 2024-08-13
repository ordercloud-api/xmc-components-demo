/* eslint-disable @typescript-eslint/no-unused-vars */

import { Category, Me } from 'ordercloud-javascript-sdk';
import {
  Field,
  RichText as JssRichText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GridItem, HStack, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import CategoryCard from './cards/CategoryCard';
import { OcCategoryListOptions } from 'src/redux/ocCategoryList';

// import FEAASProductCard from "./cards/ProductCard_feaas"
const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface Fields {
  Title: Field<string>;
}

type CategoryListsProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export interface CategoryListProps {
  options?: OcCategoryListOptions;
  renderItem?: (category: Category) => JSX.Element;
}

const SearchListsDefaultComponent = (props: CategoryListsProps): JSX.Element => (
  <div className={`component featured-products ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">{props.fields.Title.value}</span>
    </div>
  </div>
);

export const Default = (props: CategoryListsProps): JSX.Element => {
  const { query } = useRouter();
  const [categories, setCategories] = useState([] as Category[]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesList = await Me.ListCategories({
        depth: 'all',
        filters: { ParentID: query.term },
      });
      setCategories(categoriesList.Items);
    };
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.term]);

  const { sitecoreContext } = useSitecoreContext();
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  let backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};
  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    };
  }

  if (props.fields) {
    return (
      <VStack
        className={`component categories-list container ${styles}`}
        as="section"
        w="100%"
        width="full"
        pt="40px"
        pb="40px"
        mt="30px"
        style={backgroundStyle}
        maxW="1280px"
        textAlign="left"
        alignItems="flex-start"
      >
        {props.fields.Title.value && (
          <div className="featured-product-title">
            <Heading as="h3" fontSize="lg">
              <JssRichText field={props.fields.Title} /> &nbsp;{query.term}
            </Heading>
          </div>
        )}
        <HStack as="section" w="100%" width="full">
          <SimpleGrid
            columns={4}
            spacing={5}
            pl="30"
            pr="30"
            rounded="xl"
            alignSelf="stretch"
            justifyContent="stretch"
          >
            {categories &&
              categories.map((c) => (
                <GridItem
                  key={c.ID}
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
                  {/* {<FEAASProductCard initialData={p} />} */}
                  {<CategoryCard category={c} />}
                </GridItem>
              ))}
          </SimpleGrid>
        </HStack>
      </VStack>
    );
  }

  return <SearchListsDefaultComponent {...props} />;
};

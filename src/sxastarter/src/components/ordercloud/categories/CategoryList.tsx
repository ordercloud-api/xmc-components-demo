import { SimpleGrid, GridItem } from '@chakra-ui/react';

import { Category } from 'ordercloud-javascript-sdk';
import CategoryCard from '../cards/CategoryCard';
import { FunctionComponent } from 'react';
import { OcCategoryListOptions } from 'src/redux/ocCategoryList';
import React from 'react';
import useOcCategoryList from '../../../hooks/useOcCategoryList';

//import FEAASCategoryCard from "../cards/CategoryCard_feaas"

export interface CategoryListProps {
  options?: OcCategoryListOptions;
  renderItem?: (category: Category) => JSX.Element;
}

const CategoryList: FunctionComponent<CategoryListProps> = ({ options, renderItem }) => {
  const category = useOcCategoryList(options);

  return (
    <SimpleGrid
      columns={4}
      spacing={5}
      pl="30"
      pr="30"
      width="100%"
      alignSelf="stretch"
      justifyContent="stretch"
    >
      {category &&
        category.map((p) => (
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
            {/* {renderItem ? renderItem(p) :  <FEAASCategoryCard initialData={p} />} */}
            {renderItem ? renderItem(p) : <CategoryCard category={p} />}
          </GridItem>
        ))}
    </SimpleGrid>
  );
};

export default CategoryList;

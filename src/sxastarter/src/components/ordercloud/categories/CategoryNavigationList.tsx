import { Category } from 'ordercloud-javascript-sdk'
import React, { FunctionComponent } from 'react'
import useOcCategoryList from '../../../hooks/useOcCategoryList'

import { SimpleGrid } from '@chakra-ui/react'
//import FEAASCategoryCard from "../cards/CategoryCard_feaas"
import { OcCategoryListOptions } from 'src/redux/ocCategoryList'
import CategoryNavigationCard from '../cards/CategoryNavigationCard'

export interface CategoryListProps {
  options?: OcCategoryListOptions
  renderItem?: (category: Category) => JSX.Element
}

const CategoryNavigationList: FunctionComponent<CategoryListProps> = ({ options, renderItem }) => {
  const category = useOcCategoryList(options)

  return (
    <SimpleGrid
      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      gap={6}
      w="full"
      width="100%"
      alignItems="flex-start"
    >
      {category &&
        category.map((p) => (
          <React.Fragment key={p.ID}>
            {/* {renderItem ? renderItem(p) :  <FEAASCategoryCard initialData={p} />} */}
            {renderItem ? renderItem(p) : <CategoryNavigationCard category={p} />}
            {/* <CategoryNavigationCard category={p} /> */}
          </React.Fragment>
        ))}
    </SimpleGrid>
  )
}

export default CategoryNavigationList

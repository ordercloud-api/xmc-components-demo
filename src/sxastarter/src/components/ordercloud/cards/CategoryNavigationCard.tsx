/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardHeader, Link } from '@chakra-ui/react'

import NextLink from 'next/link'
import { Category } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'

interface CategoryCardProps {
  category: Category
}

const CategoryCard: FunctionComponent<CategoryCardProps> = ({ category }) => {
  return (
    <NextLink
      href={`product-lists?categoryid=${category?.ID}`}
      passHref
    >
      <Link _hover={{ textDecoration: 'none' }}>
        <Card
          mt="3"
          aspectRatio="2 / 1"
          variant="elevated"
          layerStyle="interactive.raise"
          // bgGradient="linear(120deg, primary.800, teal.800)"
          bgColor="primary.500"
          justifyContent="flex-end"
        >
          <CardHeader
            alignSelf="flex-end"
            fontSize="xl"
            fontWeight="600"
            color="whiteAlpha.900"
          >
            {category?.Name.replace(/([A-Z])/g, ' $1')}
          </CardHeader>
        </Card>
      </Link>
    </NextLink>
  )
}

export default CategoryCard

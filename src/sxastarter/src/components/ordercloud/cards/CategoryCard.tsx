/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button, Link, Text, VStack, Image, Heading } from '@chakra-ui/react'

import { Category } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import NextLink from 'next/link'
import Card from 'components/card/Card'

interface CategoryCardProps {
  category: Category
}

const CategoryCard: FunctionComponent<CategoryCardProps> = ({ category }) => {
  return (
    <Card variant="">
      <VStack
        h="full"
        justifyContent="space-between"
        p={2}
        alignSelf="stretch"
      >
        <Image
          src={category.xp?.Images[0]?.ThumbnailUrl}
          aria-label={category.Name}
        ></Image>
        <VStack
          flex="1"
          justifyContent="space-between"
          alignItems="flex-start"
          p={[4, 2, 20, 6]}
        >
          <VStack
            w="100%"
            width="full"
          >
            <Heading
              as="h3"
              fontSize="lg"
            >
              {category.Name}
            </Heading>
            <Text>{category.Description}</Text>
          </VStack>
          <NextLink
            href={`product-lists?categoryid=${category?.ID}`}
            passHref
          >
            <Link color="gray.800">
              <Button
                mt="10px"
                variant={'primaryButton'}
              >
                View details
              </Button>
            </Link>
          </NextLink>
        </VStack>
      </VStack>
    </Card>
  )
}

export default CategoryCard

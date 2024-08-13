/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, GridItem, HStack, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import {
  Field,
  RichText as JssRichText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { BuyerProduct, Me, Product } from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { OcProductListOptions } from 'src/redux/ocProductList'
import ProductCard from './cards/ProductCard'

// import FEAASProductCard from "./cards/ProductCard_feaas"
const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface Fields {
  Title: Field<string>
}

type SearchListsProps = {
  params: { [key: string]: string }
  fields: Fields
}

export interface SearchListProps {
  options?: OcProductListOptions
  renderItem?: (product: Product) => JSX.Element
}

const SearchListsDefaultComponent = (props: SearchListsProps): JSX.Element => (
  <div className={`component featured-products ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">{props.fields.Title.value}</span>
    </div>
  </div>
)

export const Default = (props: SearchListsProps): JSX.Element => {
  const options = {} as OcProductListOptions
  const { query } = useRouter()
  const [products, setProducts] = useState([] as BuyerProduct[])

  useEffect(() => {
    const searchPageSize = 60
    // const searchColumns = 4
    options.search = query.term as string
    options.page = 1
    options.pageSize = searchPageSize
    options.searchOn = ['Name', 'Description']
    options.sortBy = ['Name']
    //console.log('Search Term: ' + query.term);

    // setSearchRecords(Number(searchColumns))

    const getProducts = async () => {
      const productsList = await Me.ListProducts(options)
      setProducts(productsList.Items)
    }
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.term])

  const { sitecoreContext } = useSitecoreContext()
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}
  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    }
  }

  if (props.fields) {
    return (
      <VStack
        className={`component search-results container ${styles}`}
        as="section"
        width="full"
        style={backgroundStyle}
        textAlign="left"
        alignItems="flex-start"
      >
        {props.fields.Title && (
          <Box
            className="search-results-title"
            borderBottom="1px solid"
            w="full"
            borderColor="chakra-border-color"
            pb={3}
            mb={3}
          >
            <Heading
              as="h1"
              size="lg"
              display="inline-flex"
              gap={2}
            >
              <JssRichText field={props.fields.Title} />
              <Text color="chakra-subtle-text">{query.term}</Text>
            </Heading>
          </Box>
        )}
        <HStack
          as="section"
          w="100%"
          width="full"
        >
          <SimpleGrid
            gridTemplateColumns={'repeat(auto-fit, minmax(300px, 1fr))'}
            spacing={3}
            alignSelf="stretch"
            justifyContent="stretch"
          >
            {products &&
              products.map((p) => (
                <GridItem
                  key={p.ID}
                  colSpan={1}
                  rowSpan={1}
                  width="100%"
                  rounded="lg"
                  h="full"
                  alignSelf="stretch"
                  justifyContent="stretch"
                  display="flex"
                >
                  {/* {<FEAASProductCard initialData={p} />} */}
                  {<ProductCard product={p} />}
                </GridItem>
              ))}
          </SimpleGrid>
        </HStack>
      </VStack>
    )
  }

  return <SearchListsDefaultComponent {...props} />
}

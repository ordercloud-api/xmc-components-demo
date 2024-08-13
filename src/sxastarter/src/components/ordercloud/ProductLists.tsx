import { Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import {
  Field,
  RichText as JssRichText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { BuyerProduct, Me } from 'ordercloud-javascript-sdk'
import React, { useEffect, useState } from 'react'

import { appConfig } from 'components/appConfig/config'
import { useRouter } from 'next/router'
import { OcProductListOptions } from 'src/redux/ocProductList'
import ProductCard from './cards/ProductCard'

// import FEAASProductCard from "../cards/ProductCard_feaas"
const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface Fields {
  Title: Field<string>
  SearchTerm: Field<string>
  CategoryID: Field<string>
}

type ProductListsProps = {
  params: { [key: string]: string }
  fields: Fields
}

const ProductListsDefaultComponent = (props: ProductListsProps): JSX.Element => (
  <div className={`component featured-products ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">{props.fields.Title.value}</span>
    </div>
  </div>
)

export const Default = (props: ProductListsProps): JSX.Element => {
  const options = {} as OcProductListOptions
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
  const { query } = useRouter()
  const [products, setProducts] = useState([] as BuyerProduct[])

  useEffect(() => {
    //Search Term Authored in Sitecore
    if (props.fields && props.fields.SearchTerm.value !== '') {
      options.search = props.fields.SearchTerm.value
      options.searchOn = ['Name', 'Description']
      console.log('Authored Search Term')
    }
    //Category Id Authored in Sitecore
    if (props.fields && props.fields.CategoryID.value !== '') {
      options.categoryID = props.fields.CategoryID.value
      console.log('Authored Catalog ID')
    }
    if ((query.term as string) !== undefined) {
      options.search = query.term as string
      options.searchOn = ['Name', 'Description']
      console.log('Query Search Term')
    }
    if ((query.categoryid as string) !== undefined) {
      // use the correct categoryID parameter for query.categoryid
      options.categoryID = query.categoryid as string
      // options.search = query.categoryid as string
      // options.searchOn = ['Name', 'Description', 'CategoryID']
      console.log('Query Category ID')
    }
    const searchPageSize = 60
    options.page = 1
    options.pageSize = searchPageSize
    options.sortBy = ['Name']

    options.sellerID = appConfig.MarketplaceOwnerID
    //setSearchRecords(Number(searchColumns));

    const getProducts = async () => {
      const productsList = await Me.ListProducts(options)
      setProducts(productsList.Items)
    }
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.term, query.categoryid])

  return (
    <>
      <VStack
        className={`component categories-list container ${styles}`}
        style={backgroundStyle}
        alignItems="flex-start"
      >
        {props.fields.Title.value && (
          <div className="featured-product-title">
            <Heading
              as="h3"
              fontSize="lg"
            >
              <JssRichText field={props.fields.Title} /> &nbsp;{query.term}
            </Heading>
          </div>
        )}
        <SimpleGrid
          gridTemplateColumns={'repeat(auto-fit, minmax(300px, 1fr))'}
          spacing={3}
          width="100%"
          alignSelf="stretch"
          justifyContent="stretch"
        >
          {products &&
            products.map((p) => (
              <React.Fragment key={p.ID}>
                {/* {renderItem ? renderItem(p) :  <FEAASProductCard initialData={p} />} */}
                {<ProductCard product={p} />}
              </React.Fragment>
            ))}
        </SimpleGrid>
      </VStack>
    </>
  )

  return <ProductListsDefaultComponent {...props} />
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Center, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { ListPage, Me, ProductCollection } from 'ordercloud-javascript-sdk'
import { useEffect, useState } from 'react'

import React from 'react'
import { useOcSelector } from 'src/redux/ocStore'
import ProductCard from '../cards/ProductCard'
import Pagination from '../pagination/Pagination'

export default function ProductCollectionsList() {
  const [isLoading, setIsLoading] = useState(true)
  const [productCollections, setProductCollection] = useState<ListPage<ProductCollection>>()
  const [page, setPage] = useState(1)

  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))

  useEffect(() => {
    const initialize = async () => {
      if (isAnonymous) return
      const productcollectionList = await Me.ListProductCollections({
        sortBy: ['Name'],
        page
      })
      setProductCollection(productcollectionList)
      setIsLoading(false)
    }
    initialize()
  }, [isAnonymous, page])

  function renderItem(_p: ProductCollection<any>): import('react').ReactNode {
    throw new Error('Function not implemented.')
  }

  return (
    <>
      {isLoading ? (
        <VStack
          position="fixed"
          justifyContent="center"
          inset="20% 50% 50%"
        >
          <Spinner
            size="xl"
            colorScheme="primary"
            color="primary"
            label="gathering favorites..."
            thickness="15px"
            speed=".8s"
          />
          <Text whiteSpace="nowrap">Gathering Favorites...</Text>
        </VStack>
      ) : (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(235px, 1fr))"
          gap={3}
          w="full"
        >
          {productCollections?.Items?.length !== 0 ? (
            <>
              {productCollections &&
                productCollections.Items.map((p) => (
                  <React.Fragment key={p.ID}>
                    {/* {renderItem ? renderItem(p) :  <FEAASProductCard initialData={p} />} */}
                    {renderItem ? renderItem(p) : <ProductCard product={p} />}
                  </React.Fragment>
                ))}
            </>
          ) : (
            <Text mt="3">No products are saved to favorites.</Text>
          )}
          {productCollections && productCollections.Meta && productCollections.Meta.TotalPages > 1 && (
            <Center>
              <Pagination page={page} totalPages={productCollections.Meta.TotalPages} onChange={setPage} />
            </Center>
          )}
        </SimpleGrid>
      )}
    </>
  )
}

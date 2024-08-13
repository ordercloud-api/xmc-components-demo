/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs'
import { Box, HStack, IconButton, Text, Link } from '@chakra-ui/react'
import { HiOutlineHeart } from 'react-icons/hi'
import NextLink from 'next/link'
import { Me, ProductCollection } from 'ordercloud-javascript-sdk'
import { useOcSelector } from 'src/redux/ocStore'

interface Fields {
  Title: Field<string>
  Icon: Field<string>
  CallToAction: LinkField
}

type ComponentProps = {
  params: { [key: string]: string }
  fields: Fields
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  const [productCollections, setProductCollection] = useState([] as ProductCollection[])

  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))

  useEffect(() => {
    const initialize = async () => {
      if (isAnonymous) return
      const productcollectionList = await Me.ListProductCollections({
        sortBy: ['Name'],
      })
      setProductCollection(productcollectionList.Items)
    }
    initialize()
  }, [isAnonymous])

  return (
    <NextLink
      href={props.fields.CallToAction.value.href}
      passHref
    >
      <Link
        color="gray.800"
        className={`favorites-icon ${styles}`}
      >
        <HStack position="relative">
          <HiOutlineHeart
            fontSize="36px"
            color="gray.800"
          />
          <Box
            height="20px"
            width="20px"
            position="absolute"
            top="12px"
            left="18px"
          >
            <IconButton
              aria-label={props.fields.Title.value}
              bgColor="brand.500"
              color="white"
              size="sm"
              p="2px"
              pr="4px"
              pl="4px"
              fontWeight="bold"
            >
              <Text
                fontSize="16px"
                color="white"
                fontWeight="bold"
                mb="0px"
              >
                {productCollections.length}
              </Text>
            </IconButton>
          </Box>
        </HStack>
      </Link>
    </NextLink>
  )
}

import { Box, Button, HStack, Text, Link, Image, VStack, Heading } from '@chakra-ui/react'
import { FunctionComponent } from 'react'
import { ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs'
// import { Parser } from 'html-to-react';
// import formatFeatureCopy from 'src/utils/formatFeatureCopy';
import useOcProductDetail from '../../../hooks/useOcProductDetail'
// import formatPoints from 'src/utils/formatPoints';
import NextLink from 'next/link'
import formatPrice from 'src/utils/formatPrice'

// import FEAASProductDetails from "../products/ProductDetails_feaas"

interface ProductDetailProps {
  productId: string
  submitButton: LinkField
  backgroundImage: ImageField
  styles: string
  onLineItemAdded?: () => void
  onLineItemUpdated?: () => void
}

const ProductPromoCard: FunctionComponent<ProductDetailProps> = ({
  productId,
  submitButton,
  backgroundImage,
  styles,
}) => {
  const { product } = useOcProductDetail(productId)

  return product ? (
    <Box
      className={`component product-promo ${styles}`}
      position="relative"
      w="100%"
      width="full"
    >
      <HStack
        bgGradient="linear(to-b, #dedede, #fefefe)"
        p={10}
        w="100%"
        width="full"
        style={{
          backgroundImage: `url(${backgroundImage.value.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Box
          className="product-promo-image"
          w="35%"
          rounded="lg"
          shadow="xl"
        >
          <Image
            src={product.xp?.Images[0]?.Url}
            aria-label={product.Name}
            style={{ width: '100%' }}
            rounded="xl"
          ></Image>
        </Box>
        <Box
          className="component-content"
          alignSelf="stretch"
          justifyContent="stretch"
          width="full"
          p={20}
          w="60%"
        >
          <VStack
            w="100%"
            width="full"
            textAlign="left"
            alignItems="flex-start"
          >
            <Heading as="h2">{product.Name}</Heading>
            <Text
              w="100%"
              width="full"
            >
              <div dangerouslySetInnerHTML={{ __html: product.Description }} />
            </Text>
            <Text
              w="100%"
              width="full"
            >
              {product.xp?.Features}
            </Text>
            <Box
              w="100%"
              width="full"
              textAlign="left"
            >
              <Text>Your Price:</Text>
              <Text
                fontWeight="bold"
                fontSize={'18px'}
              >
                {formatPrice(product?.PriceSchedule?.PriceBreaks[0].Price)}
              </Text>
            </Box>
          </VStack>
          {submitButton.value?.href && (
            <NextLink
              href={`product-details?productid=${product.ID}`}
              passHref
            >
              <Link title={submitButton.value?.title}>
                <Button
                  mt="20px"
                  variant={submitButton.value?.class || 'primaryButton'}
                >
                  {submitButton.value?.text}
                </Button>
              </Link>
            </NextLink>
          )}
        </Box>
      </HStack>
    </Box>
  ) : null
}

export default ProductPromoCard

import { Box, Button, HStack, Heading, Link, Stack, Text, VStack } from '@chakra-ui/react'
import {
  Field,
  ImageField,
  Image as JssImage,
  LinkField,
  RichText,
} from '@sitecore-jss/sitecore-jss-nextjs'

import React from 'react'

interface Fields {
  PromoIcon: ImageField
  PromoText: Field<string>
  PromoLink: LinkField
  PromoText2: Field<string>
  PromoText3: Field<string>
  PromoIcon2: ImageField
}

type PromoProps = {
  params: { [key: string]: string }
  fields: Fields
}

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
)

export const Default = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <div className={`component promo ${props.params.styles}`}>
        <HStack
          bg="gray.200"
          mt={20}
          mb={20}
          p={10}
        >
          <Box
            className="field-promoicon"
            w="60%"
          >
            <JssImage field={props.fields.PromoIcon} />
          </Box>
          <Box
            className="component-content"
            bg="white"
            border="1px"
            borderColor="chakra-border-color"
            alignSelf="stretch"
            justifyContent="stretch"
            p={20}
            w="35%"
          >
            <div className="promo-text">
              <div>
                <div className="field-promotext">
                  <h2>
                    <RichText
                      className="promo-text"
                      mb={10}
                      field={props.fields.PromoText}
                    />
                  </h2>
                </div>
              </div>
              <div className="field-promotext">
                <RichText
                  className="promo-text"
                  mb={10}
                  field={props.fields.PromoText2}
                />
              </div>
            </div>
            {props?.fields?.PromoLink?.value?.href && (
              <Link
                href={props?.fields?.PromoLink?.value?.href}
                title={props?.fields?.PromoLink?.value?.title}
              >
                <Button
                  mt="20px"
                  variant={props?.fields?.PromoLink?.value?.class || 'primaryButton'}
                >
                  {props?.fields?.PromoLink?.value?.text}
                </Button>
              </Link>
            )}
          </Box>
        </HStack>
      </div>
    )
  }

  return <PromoDefaultComponent {...props} />
}

export const Banner = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <VStack
        className={`component promo ${props.params.styles}`}
        backgroundColor="brand.500"
        textAlign="center"
        mb="40px"
      >
        <div className="banner-content">
          <div className="promo-text">
            <div>
              <HStack className="field-promotext">
                <Heading
                  as="h2"
                  color="white!important"
                >
                  <RichText
                    mb={5}
                    field={props.fields.PromoText}
                  />
                </Heading>
              </HStack>
            </div>
          </div>
        </div>
      </VStack>
    )
  }

  return <PromoDefaultComponent {...props} />
}

export const SmallPromo = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <div className={`component promo ${props.params.styles}`}>
        <HStack
          mt={20}
          mb={20}
          p={10}
        >
          <Box
            className="field-promoicon"
            w="60%"
          >
            <JssImage field={props.fields.PromoIcon} />
          </Box>
          <Box
            className="component-content"
            alignSelf="stretch"
            justifyContent="stretch"
            p={20}
            w="40%"
          >
            <div className="promo-text">
              <HStack
                className="field-promotext"
                color="#a9283b"
                textTransform="uppercase"
                fontWeight="bold"
              >
                <h2>
                  <RichText
                    className="promo-text"
                    mb={10}
                    field={props.fields.PromoText}
                  />
                </h2>
              </HStack>
              <HStack
                textTransform="uppercase"
                fontWeight="bold"
                fontSize="40px"
              >
                <RichText
                  className="promo-text"
                  mb={10}
                  field={props.fields.PromoText2}
                />
              </HStack>
            </div>
            {props?.fields?.PromoLink?.value?.href && (
              <Link
                href={props?.fields?.PromoLink?.value?.href}
                title={props?.fields?.PromoLink?.value?.title}
              >
                <Button
                  mt="20px"
                  variant={props?.fields?.PromoLink?.value?.class || 'primaryButton'}
                >
                  {props?.fields?.PromoLink?.value?.text}
                </Button>
              </Link>
            )}
          </Box>
        </HStack>
      </div>
    )
  }

  return <PromoDefaultComponent {...props} />
}
export const SmallPromoFlipped = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <div className={`component promo ${props.params.styles}`}>
        <HStack
          mt={20}
          mb={20}
          p={10}
        >
          <Box
            className="component-content"
            alignSelf="stretch"
            justifyContent="stretch"
            p={20}
            w="40%"
          >
            <div className="promo-text">
              <HStack
                color="#a9283b"
                textTransform="uppercase"
                fontWeight="bold"
              >
                <h2>
                  <RichText
                    className="promo-text"
                    mb={10}
                    field={props.fields.PromoText}
                  />
                </h2>
              </HStack>
              <HStack
                textTransform="uppercase"
                fontWeight="bold"
                fontSize="40px"
              >
                <RichText
                  className="promo-text"
                  mb={10}
                  field={props.fields.PromoText2}
                />
              </HStack>
            </div>
            {props?.fields?.PromoLink?.value?.href && (
              <Link
                href={props?.fields?.PromoLink?.value?.href}
                title={props?.fields?.PromoLink?.value?.title}
              >
                <Button
                  mt="20px"
                  variant={props?.fields?.PromoLink?.value?.class || 'primaryButton'}
                >
                  {props?.fields?.PromoLink?.value?.text}
                </Button>
              </Link>
            )}
          </Box>
          <Box
            className="field-promoicon"
            w="60%"
          >
            <JssImage field={props.fields.PromoIcon} />
          </Box>
        </HStack>
      </div>
    )
  }

  return <PromoDefaultComponent {...props} />
}

export const BillboardPromo = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <Stack
        direction={{ base: 'column', md: 'row' }}
        className={`component promo ${props.params.styles}`}
        backgroundImage={`url(${props.fields.PromoIcon2.value.src})`}
        backgroundRepeat="no-repeat"
        alignItems="center"
        backgroundSize="cover"
        w="full"
        gap={6}
        py={{ base: 4, md: 16 }}
        px={{ base: 4, md: 20 }}
      >
        <VStack
          alignItems={{ base: 'center', md: 'flex-start' }}
          textAlign={{ base: 'center', md: 'left' }}
          zIndex={1}
        >
          <Heading as="h1">
            <RichText
              w="full"
              m="0px"
              field={props.fields.PromoText}
            />
          </Heading>
          <Heading
            as="h2"
            size="3xl"
            fontWeight="300"
            py="3"
            color="chakra-subtle-text"
          >
            <RichText
              w="full"
              field={props.fields.PromoText2}
            />
          </Heading>
          <Text
            maxW="80%"
            mb={5}
            fontSize="lg"
          >
            <RichText field={props.fields.PromoText3} />
          </Text>
          {props?.fields?.PromoLink?.value?.href && (
            <Button
              as="a"
              href={props?.fields?.PromoLink?.value?.href}
              title={props?.fields?.PromoLink?.value?.title}
              fontSize="lg"
              variant="ghost"
              colorScheme="primary"
            >
              {props?.fields?.PromoLink?.value?.text}
            </Button>
          )}
        </VStack>
        <Box
          className="field-promoicon"
          objectFit="cover"
          flexBasis="100%"
          minW="200"
          borderRadius="md"
          position={{ base: 'absolute', lg: 'relative' }}
          opacity={{ base: 0.15, lg: 1 }}
        >
          <JssImage field={props.fields.PromoIcon} />
        </Box>
      </Stack>
    )
  }

  return <PromoDefaultComponent {...props} />
}
export const BillboardPromoFlipped = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <Stack
        direction={{ base: 'column', md: 'row' }}
        className={`component promo ${props.params.styles}`}
        backgroundImage={`url(${props.fields.PromoIcon2.value.src})`}
        backgroundRepeat="no-repeat"
        alignItems="center"
        backgroundSize="cover"
        w="full"
        gap={6}
        py={{ base: 4, md: 16 }}
        px={{ base: 4, md: 20 }}
      >
        <Box
          className="field-promoicon"
          objectFit="cover"
          flexBasis="100%"
          minW="200"
          borderRadius="md"
          position={{ base: 'absolute', lg: 'relative' }}
          opacity={{ base: 0.15, lg: 1 }}
        >
          <JssImage field={props.fields.PromoIcon} />
        </Box>
        <VStack
          alignItems="flex-end"
          textAlign="right"
          zIndex={1}
        >
          <Heading as="h1">
            <RichText
              w="full"
              m="0px"
              field={props.fields.PromoText}
            />
          </Heading>
          <Heading
            as="h2"
            size="3xl"
            fontWeight="300"
            py="3"
            color="chakra-subtle-text"
          >
            <RichText
              w="full"
              field={props.fields.PromoText2}
            />
          </Heading>
          <Text
            maxW="80%"
            mb={5}
            fontSize="lg"
          >
            <RichText field={props.fields.PromoText3} />
          </Text>
          {props?.fields?.PromoLink?.value?.href && (
            <Button
              as="a"
              href={props?.fields?.PromoLink?.value?.href}
              title={props?.fields?.PromoLink?.value?.title}
              fontSize="lg"
              variant="ghost"
              colorScheme="primary"
            >
              {props?.fields?.PromoLink?.value?.text}
            </Button>
          )}
        </VStack>
      </Stack>
    )
  }

  return <PromoDefaultComponent {...props} />
}

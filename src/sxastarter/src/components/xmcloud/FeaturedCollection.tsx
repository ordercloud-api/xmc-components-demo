/* eslint-disable no-lone-blocks */

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  GridItem,
  HStack,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  Field,
  ImageField,
  Link as JssLink,
  RichText as JssRichText,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs'

// Component: Featured Collection
// Version:   Name
// URL:       https://components.sitecorecloud.io/components/UFUFr-Hr2Z

interface Fields {
  Title: Field<string>
  Subhead: Field<string>
  CallToAction: LinkField
  CollectionItems: Array<FeaturedCollectionItems>
  Disclaimer: Field<string>
  Columns: Field<string>
  ColumnsGap: Field<string>
  AlignSelf: Field<string>
  JustifyContent: Field<string>
}

interface FeaturedCollectionItems {
  id: Field<string>
  name: Field<string>
  displayName: Field<string>
  url: Field<string>
  fields: FeaturedCollectionItem
}

interface FeaturedCollectionItem {
  Title: Field<string>
  Subhead: Field<string>
  Description: Field<string>
  Image: ImageField
  CallToAction: LinkField
  CssClass: Field<string>
  Disclaimer: Field<string>
}

type FeaturedCollectionProps = {
  params: { [key: string]: string }
  fields: Fields
}

const FeaturedCollectionDefaultComponent = (props: FeaturedCollectionProps): JSX.Element => (
  <div className={`component featured-collection ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Featured Collection</span>
    </div>
  </div>
)

export const Default = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 3
      ? (columnDesktopCount = 4)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }

  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Card
          borderRadius="xl"
          height="250px"
          w="full"
          my={{ base: 2, lg: 0 }}
          style={{
            backgroundImage: `url(${element?.fields?.Image?.value?.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <CardBody
            as={VStack}
            key={key}
            w="50%"
            alignItems="flex-start"
            justifyContent="flex-start"
            textAlign="left"
          >
            {element?.fields?.Subhead?.value && (
              <Badge
                colorScheme="green"
                fontSize="2xl"
                fontWeight={300}
                textTransform="uppercase"
              >
                {element?.fields?.Subhead?.value}
              </Badge>
            )}
            {element?.fields?.Title?.value && (
              <Heading
                as="h3"
                fontWeight="semibold"
                size="3xl"
              >
                {element?.fields?.Title?.value}
              </Heading>
            )}

            {element?.fields?.CallToAction?.value?.href && (
              <Button
                as={Link}
                variant="solid"
                colorScheme="neutral"
                _hover={{ textDecoration: 'none' }}
                size="sm"
                mt={4}
                href={element?.fields?.CallToAction?.value?.href}
                title={element?.fields?.CallToAction?.value?.title}
              >
                {element?.fields?.CallToAction?.value?.text}
              </Button>
            )}
          </CardBody>
        </Card>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mb="40px"
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <div className="featured-collection-title">
                  <JssRichText field={props.fields.Title} />
                </div>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, sm: 0, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, sm: 0, base: 0 }}
                mb={0}
                w="100%"
                width="full"
                alignSelf="stretch"
                justifyContent="stretch"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <div className="featured-collection-call-to-action">
                <JssLink field={props.fields.CallToAction} />
              </div>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionDefaultComponent {...props} />
}
const FeaturedCollectionFeaturedIconsComponent = (props: FeaturedCollectionProps): JSX.Element => (
  <div className={`component featured-collection ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Featured Collection</span>
    </div>
  </div>
)
export const FeaturedIcons = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 3
      ? (columnDesktopCount = 4)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }
  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Box
          w="full"
          width="100%"
        >
          <HStack
            width="full"
            w="100%"
            alignItems="flex-start"
            p={2}
            alignContent="flex-start"
          >
            {element.fields.Image && (
              <Image
                src={element?.fields?.Image?.value?.src}
                width="100%"
                maxW="59px"
              />
            )}
            <VStack
              w="full"
              p={4}
              textAlign="left"
              alignItems="left"
            >
              {element?.fields?.Title?.value && (
                <Heading
                  as="h3"
                  fontWeight="semibold"
                  fontSize="18px"
                  textTransform="uppercase"
                  mb="0px!important"
                >
                  {element?.fields?.Title?.value}
                </Heading>
              )}
              {element?.fields?.Subhead?.value && (
                <Text fontSize="16px">{element?.fields?.Subhead?.value}</Text>
              )}

              {element?.fields?.CallToAction?.value?.href && (
                <Link
                  href={element?.fields?.CallToAction?.value?.href}
                  title={element?.fields?.CallToAction?.value?.title}
                >
                  <Button
                    mt="10px"
                    variant={element?.fields?.CallToAction?.value?.class || 'primaryButton'}
                  >
                    {element?.fields?.CallToAction?.value?.text}
                  </Button>
                </Link>
              )}
            </VStack>
          </HStack>
        </Box>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mt={30}
        mb={30}
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <div className="featured-collection-title">
                  <JssRichText field={props.fields.Title} />
                </div>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, sm: 0, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, sm: 0, base: 0 }}
                mb={0}
                w="100%"
                width="full"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <div className="featured-collection-call-to-action">
                <JssLink field={props.fields.CallToAction} />
              </div>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionFeaturedIconsComponent {...props} />
}
export const FeaturedIconsFlipped = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 3
      ? (columnDesktopCount = 4)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }
  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Box
          w="full"
          width="100%"
        >
          <HStack
            width="full"
            w="100%"
            alignItems="flex-start"
            p={2}
            alignContent="flex-start"
          >
            <VStack
              w="full"
              p={4}
              textAlign="left"
              alignItems="left"
            >
              {element?.fields?.Title?.value && (
                <Heading
                  as="h3"
                  fontWeight="semibold"
                  fontSize="18px"
                  textTransform="uppercase"
                  mb="0px!important"
                >
                  {element?.fields?.Title?.value}
                </Heading>
              )}
              {element?.fields?.Subhead?.value && (
                <Text fontSize="16px">{element?.fields?.Subhead?.value}</Text>
              )}

              {element?.fields?.CallToAction?.value?.href && (
                <Link
                  href={element?.fields?.CallToAction?.value?.href}
                  title={element?.fields?.CallToAction?.value?.title}
                >
                  <Button
                    mt="10px"
                    variant={element?.fields?.CallToAction?.value?.class || 'primaryButton'}
                  >
                    {element?.fields?.CallToAction?.value?.text}
                  </Button>
                </Link>
              )}
            </VStack>
            {element.fields.Image && (
              <Image
                src={element?.fields?.Image?.value?.src}
                width="100%"
                maxW="59px"
              />
            )}
          </HStack>
        </Box>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mt={30}
        mb={30}
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <div className="featured-collection-title">
                  <JssRichText field={props.fields.Title} />
                </div>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, sm: 0, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, sm: 0, base: 0 }}
                mb={0}
                w="100%"
                width="full"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <div className="featured-collection-call-to-action">
                <JssLink field={props.fields.CallToAction} />
              </div>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionFeaturedIconsComponent {...props} />
}

const FeaturedCollectionRecentBlogsComponent = (props: FeaturedCollectionProps): JSX.Element => (
  <div className={`component featured-collection ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Featured Collection</span>
    </div>
  </div>
)
export const FeaturedBlogs = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 3
      ? (columnDesktopCount = 4)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }
  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Box
          w="full"
          width="100%"
        >
          <GridItem key={key}>
            <Box
              w="full"
              width="100%"
            >
              <VStack
                h="full"
                width="full"
                w="100%"
                justifyContent="center"
                alignItems="center"
                p={2}
              >
                {element.fields.Image && <Image src={element?.fields?.Image?.value?.src} />}
                {element?.fields?.Title?.value && (
                  <Heading
                    as="h3"
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    {element?.fields?.Title?.value}
                  </Heading>
                )}
                {element?.fields?.Subhead?.value && (
                  <Text fontSize="sm">{element?.fields?.Subhead?.value}</Text>
                )}
                {element?.fields?.CallToAction?.value?.href && (
                  <Link
                    href={element?.fields?.CallToAction?.value?.href}
                    title={element?.fields?.CallToAction?.value?.title}
                  >
                    <Button
                      mt="10px"
                      variant={element?.fields?.CallToAction?.value?.class || 'primaryButton'}
                    >
                      {element?.fields?.CallToAction?.value?.text}
                    </Button>
                  </Link>
                )}
              </VStack>
            </Box>
          </GridItem>
        </Box>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mb="40px"
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <div className="featured-collection-title">
                  <JssRichText field={props.fields.Title} />
                </div>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, sm: 0, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, sm: 0, base: 0 }}
                mb={0}
                w="100%"
                width="full"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <div className="featured-collection-call-to-action">
                <JssLink field={props.fields.CallToAction} />
              </div>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionRecentBlogsComponent {...props} />
}

const FeaturedCollectionSupplierLogosComponent = (props: FeaturedCollectionProps): JSX.Element => (
  <div className={`component featured-collection ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Featured Collection</span>
    </div>
  </div>
)
export const SupplierLogos = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 3
      ? (columnDesktopCount = 4)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }
  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Box
          w="full"
          width="100%"
        >
          <GridItem key={key}>
            <Box
              w="full"
              width="100%"
            >
              <VStack
                h="full"
                width="full"
                w="100%"
                justifyContent="center"
                alignItems="center"
                p={2}
              >
                {element.fields.Image && <Image src={element?.fields?.Image?.value?.src} />}
                {element?.fields?.Title?.value && (
                  <Heading
                    as="h3"
                    fontWeight="semibold"
                    fontSize="md"
                  >
                    {element?.fields?.Title?.value}
                  </Heading>
                )}
                {element?.fields?.Subhead?.value && (
                  <Text fontSize="sm">{element?.fields?.Subhead?.value}</Text>
                )}
                {element?.fields?.CallToAction?.value?.href && (
                  <Link
                    href={element?.fields?.CallToAction?.value?.href}
                    title={element?.fields?.CallToAction?.value?.title}
                  >
                    <Button
                      mt="10px"
                      variant={element?.fields?.CallToAction?.value?.class || 'primaryButton'}
                    >
                      {element?.fields?.CallToAction?.value?.text}
                    </Button>
                  </Link>
                )}
              </VStack>
            </Box>
          </GridItem>
        </Box>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mb="40px"
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <div className="featured-collection-title">
                  <JssRichText field={props.fields.Title} />
                </div>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, base: 0 }}
                mb={0}
                w="100%"
                width="full"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <div className="featured-collection-call-to-action">
                <JssLink field={props.fields.CallToAction} />
              </div>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionSupplierLogosComponent {...props} />
}

const FeaturedCollectionTopCategoriesComponent = (props: FeaturedCollectionProps): JSX.Element => (
  <div className={`component featured-collection ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Featured Collection</span>
    </div>
  </div>
)
export const TopCategories = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 3
      ? (columnDesktopCount = 4)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }
  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Box
          w="full"
          width="100%"
        >
          <GridItem key={key}>
            <Card
              w="full"
              my={{ base: 2, lg: 0 }}
              width="100%"
              minH="250px"
              style={{
                backgroundImage: `url(${element?.fields?.Image?.value?.src})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0 bottom 0',
              }}
            >
              <CardBody
                as={VStack}
                h="full"
                width="full"
                maxW="50%"
                alignItems="flex-start"
                justifyContent="center"
                p={8}
              >
                {element?.fields?.Title?.value && (
                  <Heading
                    as="h3"
                    fontWeight="semibold"
                    fontSize="3xl"
                  >
                    {element?.fields?.Title?.value}
                  </Heading>
                )}

                {element?.fields?.Subhead?.value && (
                  <Text
                    fontSize="md"
                    color="chakra-subtle-text"
                  >
                    {element?.fields?.Subhead?.value}
                  </Text>
                )}
                {element?.fields?.CallToAction?.value?.href && (
                  <Button
                    mt="3"
                    as={Link}
                    href={element?.fields?.CallToAction?.value?.href}
                    title={element?.fields?.CallToAction?.value?.title}
                    size="xs"
                    variant="outline"
                    borderColor="green"
                    colorScheme="green"
                  >
                    {element?.fields?.CallToAction?.value?.text}
                  </Button>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Box>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mt="40px"
        mb="40px"
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <Heading
                  className="featured-collection-title"
                  fontSize="28px"
                >
                  <JssRichText field={props.fields.Title} />
                </Heading>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, sm: 0, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, sm: 0, base: 0 }}
                mb={0}
                w="100%"
                width="full"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <Button
                mt={3}
                size="sm"
                variant="link"
                className="featured-collection-call-to-action"
              >
                <JssLink field={props.fields.CallToAction} />
              </Button>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionTopCategoriesComponent {...props} />
}

const FeaturedCollectionCategoriesComponent = (props: FeaturedCollectionProps): JSX.Element => (
  <div className={`component featured-collection ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Featured Collection</span>
    </div>
  </div>
)
export const FeaturedCategories = (props: FeaturedCollectionProps): JSX.Element => {
  let columnDesktopCount = 3
  const columnMediumCount = 2
  const columnSmallCount = 1

  //Dynamically set the column count for desktop, medium and small are fixed today but could be authorable in the future
  {
    props.fields.CollectionItems.length > 5
      ? (columnDesktopCount = 6)
      : (columnDesktopCount = props.fields.CollectionItems.length)
  }
  const list = Object.values(props.fields.CollectionItems)
    .filter((element) => element)
    .map((element: FeaturedCollectionItems, key: number) => (
      <GridItem key={key}>
        <Box
          w="full"
          width="100%"
        >
          <VStack
            width="full"
            w="100%"
            p={4}
            textAlign="center"
            alignItems="center"
          >
            {element.fields.Image && (
              <Image
                src={element?.fields?.Image?.value?.src}
                maxH="350px"
              />
            )}

            {element?.fields?.Title?.value && (
              <Heading
                as="h3"
                fontWeight="semibold"
                fontSize="18px"
                textTransform="uppercase"
                mb="0px!important"
              >
                {element?.fields?.Title?.value}
              </Heading>
            )}
            {element?.fields?.Subhead?.value && (
              <Text fontSize="16px">{element?.fields?.Subhead?.value}</Text>
            )}

            {element?.fields?.CallToAction?.value?.href && (
              <Link
                href={element?.fields?.CallToAction?.value?.href}
                title={element?.fields?.CallToAction?.value?.title}
              >
                <Button
                  mt="10px"
                  variant={element?.fields?.CallToAction?.value?.class || 'primaryButton'}
                >
                  {element?.fields?.CallToAction?.value?.text}
                </Button>
              </Link>
            )}
          </VStack>
        </Box>
      </GridItem>
    ))

  if (props.fields) {
    return (
      <Box
        className={`component featured-collection ${props.params.styles}`}
        mt="50px"
        mb="50px"
        w="100%"
        width="full"
      >
        <Box
          className="component-content"
          w="100%"
          width="full"
        >
          <div className="featured-collection-text">
            <div>
              {props.fields.Title && (
                <Heading
                  className="featured-collection-title"
                  fontSize="36px"
                >
                  <JssRichText field={props.fields.Title} />
                </Heading>
              )}
            </div>
            <div className="featured-collection-items">
              <SimpleGrid
                columns={{
                  xl: columnDesktopCount,
                  lg: columnDesktopCount,
                  md: columnMediumCount,
                  sm: columnSmallCount,
                  base: columnSmallCount,
                }}
                gap={{ xl: 6, lg: 4, md: 2, sm: 0, base: 0 }}
                mt={{ xl: 4, lg: 4, md: 2, sm: 0, base: 0 }}
                mb={0}
                w="100%"
                width="full"
              >
                {list}
              </SimpleGrid>
            </div>
            {props.fields.CallToAction && (
              <div className="featured-collection-call-to-action">
                <JssLink field={props.fields.CallToAction} />
              </div>
            )}
            {props.fields.Disclaimer && (
              <div className="featured-collection-disclaimer">
                <JssRichText field={props.fields.Disclaimer} />
              </div>
            )}
          </div>
        </Box>
      </Box>
    )
  }

  return <FeaturedCollectionCategoriesComponent {...props} />
}

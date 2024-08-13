import {
  Field,
  Text,
  ImageField,
  Image,
  RichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Box, GridItem, HStack, SimpleGrid, VStack, CardBody, Flex, Icon, Stack, ButtonGroup, Button, Heading } from '@chakra-ui/react';
import React from 'react';
import Card from 'components/card/Card'
import NextLink from 'next/link'

type News = {
  name: Field<string>;
  fields: {
    Title: Field<string>;
    Excerpt: Field<string>;
    PublishDate: Field<string>;
    Image: ImageField;
  };
  url: string;
};

type NewsListingProps = {
  params: { [key: string]: string };
  fields: {
    items: News[];
  };
};

const NewsListingDefaultComponent = (props: NewsListingProps): JSX.Element => (
  <div className={`component featured-products ${props.params.styles}`}>
    <div className="component-content">
      {/* <span className="is-empty-hint">{props.fields.Title}</span> */}
    </div>
  </div>
);

export const Default = (props: NewsListingProps): JSX.Element => {
  if (props.fields) {
    return (
      <VStack
        className={`component featured-products ${props.params.styles}`}
        as="section"
        w="100%"
        width="full"
        mt="40px"
        pt="40px"
        pb="40px"
        bgGradient="linear(to-b, #dedede, #fefefe)"
      >
        {(
          <Box className="featured-product-title" width="full" w="100%" textAlign="left" pl="30px">
            <Heading as="h3" fontSize="28px">
              Latest News
            </Heading>
          </Box>
        )}
        <HStack as="section" w="100%" width="full">
          <SimpleGrid
            columns={props.fields.items.length}
            spacing={5}
            pl="30"
            pr="30"
            pt="30"
            rounded="xl"
            alignSelf="stretch"
            justifyContent="stretch"
          >
            {props.fields.items &&
              props.fields.items.map((news, index) =>(
                <GridItem
                  key={index}
                  colSpan={1}
                  rowSpan={1}
                  w="full"
                  width="100%"
                  rounded="lg"
                  h="full"
                  alignSelf="flex-start"
                  justifyContent="flex-start"
                  verticalAlign="flex-start"
                  display="flex"
                >
                  <Card key={index}>
                    <CardBody
                      alignItems="flex-start"
                      as={VStack}
                      p={0}
                    >
                      {news?.fields?.Title ? (
                        <Image
                          width="100%"
                          objectFit="cover"
                          bgColor="chakra-subtle-bg"
                          alignItems="bottom"
                          color="neutral"
                          fontSize=".5em"
                          justifyContent="center"
                          display="flex"
                          aspectRatio="1 / 1"
                          field={news.fields.Image}
                          alt={news.fields.Title}
                        />
                      ) : (
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          w="100%"
                          aspectRatio="1 / 1"
                          bgColor="chakra-subtle-bg"
                        >
                          <Icon
                            fontSize="5em"
                            opacity=".25"
                            color="chakra-placeholder-color"
                            sx={{ '& path:first-of-type': { display: 'none' } }}
                          />
                        </Flex>
                      )}
                      <VStack
                        flex="1"
                        alignItems="flex-start"
                        p="3"
                      >
                        <Heading as="h3" size="md">
                        <Text
                          field={news.fields.Title}
                          as="h3"
                          size="md"
                        >
                        </Text>
                        </Heading>
                        <RichText
                          field={news.fields.Excerpt}
                          fontSize="sm"
                          color="chakra-subtle-text"
                          style={{
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            display: '-webkit-box',
                            overflow: 'hidden',
                          }}
                        >
                        </RichText>
                        <Stack
                          direction={{ base: 'row', lg: 'row' }}
                          w="full"
                          mt="auto"
                          pt="4"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <ButtonGroup>
                            <NextLink
                              href={news.url}
                              passHref
                            >
                              <Button
                                size="sm"
                                _hover={{ textDecoration: 'none' }}
                              >
                                Read article
                              </Button>
                            </NextLink>
                          </ButtonGroup>
                          <Text
                            fontWeight="700"
                            fontSize="lg"
                            color="green.500"
                          >
                          </Text>
                        </Stack>
                      </VStack>
                    </CardBody>
                  </Card>

                </GridItem>
              ))}
          </SimpleGrid>
        </HStack>
      </VStack>
    );
  }

  return <NewsListingDefaultComponent {...props} />;
};

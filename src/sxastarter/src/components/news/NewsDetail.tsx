import {
  RichText,
  Field,
  Image as JssImage,
  DateField,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Box, HStack, Heading} from '@chakra-ui/react';

interface Fields {
  Title: Field<string>
  Excerpt: Field<string>
  PublishDate: Field<string>
  Image: ImageField
  Content: Field<string>
}

type NewsDetailProps = {
  params: { [key: string]: string }
  fields: Fields
}

const NewsDetailDefaultComponent = (props: NewsDetailProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">News Detail</span>
    </div>
  </div>
)

export const Default = (props: NewsDetailProps): JSX.Element => {
  if (props.fields) {
    return (
      <div className={`component promo`}>
        <HStack
          bg="gray.200"
          mt={5}
          mb={5}
          p={10}
        >
          <Box
            className="field-promoicon"
            w="28%"
          >
            <JssImage field={props.fields?.Image} alt={props.fields?.Title?.value} />
          </Box>
          <Box
            className="component-content"
            bg="white"
            border="1px"
            borderColor="gray.300"
            alignSelf="stretch"
            justifyContent="stretch"
            width="full"
            p={10}
            w="72%"
          >
            <div className="promo-text">
              <div>
                <div className="field-promotext">
                  <Heading as="h1" size="2xl">
                      <RichText
                        className="promo-text"
                        mb={10}
                        as="h1"
                        field={props.fields.Title}
                      />
                  </Heading>
                </div>
              </div>
            </div>

            <Box mt={5} className="field-promoicon" >
              <Heading as="i" size="lg">
                <RichText
                  className="promo-text"
                  mb={10}
                  as="i"
                  field={props.fields.Excerpt}
                />
              </Heading>
            </Box>

            <Box mt={5} className="field-promoicon" >
              <Heading size="sm">
                <DateField
                  className="news-date"
                  field={props.fields?.PublishDate}
                  render={(date) => date.toDateString()}
                />
              </Heading>
            </Box>

            <Box mt={5} className="field-promoicon" >
              <RichText
                  className="promo-text"
                  mb={10}
                  field={props.fields.Content}
                />
            </Box>

          </Box>
        </HStack>
      </div>
    )
  }

  return <NewsDetailDefaultComponent {...props} />

};

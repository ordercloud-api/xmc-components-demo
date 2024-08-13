import { Container, HStack, Heading, Text } from '@chakra-ui/react'
import { Field, ImageField, RichText } from '@sitecore-jss/sitecore-jss-nextjs'

interface Fields {
  PromoText: Field<string>
  PromoCode: Field<string>
  PromoDescription: Field<string>
  BackgroundImage: ImageField
}

type PromoCodeBannerProps = {
  params: { [key: string]: string }
  fields: Fields
}

const PromoCodeBannerDefaultComponent = (props: PromoCodeBannerProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}></div>
)

export const Default = (props: PromoCodeBannerProps): JSX.Element => {
  if (props.fields) {
    return (
      <HStack
        w="100vw"
        bgColor="primary"
        // backgroundImage={`url(${props.fields.BackgroundImage.value.src})`}
        // backgroundRepeat="no-repeat"
        // backgroundSize="cover"
        mb={3}
      >
        <Container
          as={HStack}
          maxW="container.2xl"
          alignItems="center"
          p={3}
          gap={6}
          justifyContent="center"
          className={`component promo ${props.params.styles}`}
        >
          <Text
            fontSize="lg"
            color="primary.100"
          >
            <RichText
              className="promo-text"
              field={props.fields.PromoText}
            />
          </Text>
          <Heading
            as="h1"
            size="lg"
            color="white"
            fontWeight="black"
            border="1px dashed"
            px="4"
            py="2"
            borderRadius="sm"
          >
            <RichText
              className="promo-text"
              field={props.fields.PromoCode}
            />
          </Heading>
          <Text
            fontSize="lg"
            color="primary.100"
          >
            <RichText field={props.fields.PromoDescription} />
          </Text>
        </Container>
      </HStack>
    )
  }

  return <PromoCodeBannerDefaultComponent {...props} />
}

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Container, Flex, GridItem, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs'

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  //const { sitecoreContext } = useSitecoreContext();
  //const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  // const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  // const phKey = `hstack-${props.params.DynamicPlaceholderId}`;
  let backgroundImage = props.params.BackgroundImage as string
  // let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage) {
    //const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    // backgroundStyle = {
    //   backgroundImage: `url('${prefix}${backgroundImage}')`,
    // };
  }

  return (
    <Container
      maxW="container.2xl"
      fontWeight="normal"
      sx={{
        h3: {
          color: 'neutral',
          fontWeight: '700',
          mb: 3,
        },
      }}
    >
      <SimpleGrid
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        py={8}
        gap={8}
        alignItems="flex-start"
      >
        <VStack
          alignItems="flex-start"
          key="4"
          h="full"
          justifyContent="space-between"
        >
          <Box maxW="75%">
            <Placeholder
              name="footer-logo"
              rendering={props.rendering}
            />
          </Box>
          <Placeholder
            name="footer-policies-navigation"
            rendering={props.rendering}
          />
        </VStack>
        <GridItem key="1">
          <Placeholder
            name="footer-about-us-navigation"
            rendering={props.rendering}
          />
        </GridItem>
        <GridItem key="2">
          <Placeholder
            name="footer-top-categories-navigation"
            rendering={props.rendering}
          />
        </GridItem>
        <GridItem key="3">
          <Placeholder
            name="footer-my-account-navigation"
            rendering={props.rendering}
          />
        </GridItem>
      </SimpleGrid>

      <Flex
        width="full"
        align="center"
      >
        <Text>
          <Placeholder
            name="footer-copyright"
            rendering={props.rendering}
          />
        </Text>
      </Flex>
    </Container>
  )
}

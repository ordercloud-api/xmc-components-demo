/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  HStack,
  Hide,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Show,
  Slide,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  useOutsideClick,
} from '@chakra-ui/react'

import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs'
import { Form, Formik } from 'formik'
import { GoBook, GoListUnordered, GoNumber } from 'react-icons/go'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLogout,
  MdOutlineAccountCircle,
  MdOutlineFavorite,
  MdOutlinePerson,
  MdOutlineSearch,
  MdMenu,
  MdOutlineShoppingCart,
  MdOutlineSettings,
} from 'react-icons/md'
import { PiArrowSquareRight, PiListChecks, PiSteps } from 'react-icons/pi'
import { TfiLayoutAccordionSeparated } from 'react-icons/tfi'

import CategoryNavigationList from 'components/ordercloud/categories/CategoryNavigationList'
import { InputControl } from 'formik-chakra-ui'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useOcCurrentOrder from 'src/hooks/useOcCurrentOrder'
import { useOcSelector } from 'src/redux/ocStore'
import Cookies from 'universal-cookie'

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
)

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const router = useRouter()
  const { sitecoreContext } = useSitecoreContext()
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  let backgroundImage = props.params.BackgroundImage as string
  let backgroundStyle: { [key: string]: string } = {}
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLargerThan800] = useMediaQuery('(min-width: 768px)')

  // TODO: Finish this for the responsive menu
  // const superHackyMenuArray = props.rendering?.placeholders?.['header-main-navigation']
  //   .at(0)
  //   .fields.data.datasource.children.results?.flatMap(
  //     (f: { field: { link: { value: { title: string } } } }) => f.field.link.value.title
  //   )

  const {
    isOpen: isCategoryOpen,
    onClose: onCategoryClose,
    onToggle: onCategoryToggle,
  } = useDisclosure()
  const color = useColorModeValue('textColor.900', 'textColor.100')

  const { order, lineItems } = useOcCurrentOrder()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))
  const { username } = useOcSelector((s: any) => ({
    username: s.ocUser?.user?.Username,
  }))

  const cookies = new Cookies()
  let currentcheckoutflow = '/check-out-quote'
  if (cookies.get('currentcheckoutflow') !== null) {
    currentcheckoutflow = cookies.get('currentcheckoutflow')
  }

  useEffect(() => {
    const cookies = new Cookies()
    const checkout_cookie = cookies.get('currentcheckoutflow')
    if (!checkout_cookie) {
      cookies.set('currentcheckoutflow', '/check-out-quote', {
        path: '/',
      })
    }
  })

  // const btnCategoryRef = React.useRef();
  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    }
  }
  //const [selectedOption, setSelectedOption] = useState<String>();
  // This function is triggered when the select changes
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    //setSelectedOption(value);
    const cookies = new Cookies()
    cookies.set('currentcheckoutflow', value, {
      path: '/',
    })
    //Reload page so the theme takes affect
    window.location.reload()
  }

  function setSubmitting(term: string) {
    router.replace('/search?term=' + term)
  }

  const ref = React.useRef()
  useOutsideClick({
    ref: ref,
    handler: (e: any) => {
      console.log(e)
      if (e?.target?.id === 'SHOP_ALL_BTN') return
      onCategoryClose()
    },
  })

  const minicartLineItemCount = lineItems
    ?.map((qty) => qty.Quantity)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  return (
    <>
      <VStack
        w="full"
        align="center"
        className={`component ${styles}`}
        style={backgroundStyle}
        bgColor="whiteAlpha.700"
        backdropFilter="blur(6px)"
        shadow="sm"
        px={4}
        pb={{ base: 4, md: 'unset' }}
      >
        <Container
          id="mainNav"
          maxW="container.2xl"
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          gap={6}
          pt={2}
        >
          <Box
            id="brandNav"
            sx={
              isLargerThan800
                ? {
                    '& img': {
                      width: '300px',
                    },
                  }
                : {
                    '& img': {
                      width: '175px',
                    },
                  }
            }
          >
            <Placeholder
              name="header-logo"
              rendering={props.rendering}
            />
          </Box>
          <HStack w="full">
            <Hide above="md">
              <IconButton
                id="SHOP_ALL_BTN"
                aria-label="shop all"
                cursor="pointer"
                fontSize="2em"
                onClick={onCategoryToggle}
                variant="ghost"
                icon={<MdMenu pointerEvents="none" />}
              />
            </Hide>
            <Formik
              initialValues={{ search: '' }}
              onSubmit={async (values) => {
                setSubmitting(values.search)
              }}
            >
              {() => (
                <Form style={{ flexGrow: 1 }}>
                  <InputGroup
                    maxW={{ md: '50%' }}
                    flex="1"
                    display="flex"
                    alignItems="center"
                  >
                    <InputControl
                      name="search"
                      inputProps={{
                        placeholder: 'Enter search term',
                        value: undefined,
                        type: 'search',
                      }}
                    />
                    <InputRightElement
                      width="fit-content"
                      mr="2"
                    >
                      <IconButton
                        variant="ghost"
                        size="sm"
                        colorScheme="neutral"
                        aria-label="Search"
                        fontSize="1.5em"
                        icon={<MdOutlineSearch />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Form>
              )}
            </Formik>
            <ButtonGroup
              ml="auto"
              alignItems="center"
            >
              {!isAnonymous ? (
                <Menu>
                  <Show below="md">
                    <MenuButton
                      variant="ghost"
                      as={IconButton}
                      aria-label="my profile"
                      fontSize="2em"
                      icon={<MdOutlinePerson />}
                    >
                      {username}
                    </MenuButton>
                  </Show>
                  <Hide below="md">
                    <MenuButton
                      variant="ghost"
                      as={Button}
                      size="sm"
                      rightIcon={<MdKeyboardArrowDown fontSize="1.5em" />}
                    >
                      {username}
                    </MenuButton>
                  </Hide>
                  <MenuList sx={{ '& a': { color: 'chakra-body-text' } }}>
                    <MenuItem
                      as={NextLink}
                      icon={<MdOutlineAccountCircle />}
                      href="/my-profile"
                      passHref
                    >
                      <Link>My Profile</Link>
                    </MenuItem>
                    <MenuItem
                      as={NextLink}
                      icon={<MdOutlineFavorite />}
                      href="/my-profile/my-favorites"
                      passHref
                      w="full"
                    >
                      <Link>My Favorites</Link>
                      {/* TODO: Get favorites count */}
                      {/* <Badge
                      colorScheme="red"
                      boxSize="1.5em"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      ml="30%"
                      borderRadius="xl"
                    >
                      0
                    </Badge> */}
                    </MenuItem>
                    <MenuDivider />
                    {!isAnonymous && (
                      <MenuItem
                        as={NextLink}
                        icon={<MdLogout />}
                        href="/logout"
                        passHref
                      >
                        <Link>Logout</Link>
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Hide below="md">
                    <Button
                      as={NextLink}
                      href="/login"
                      size="sm"
                      colorScheme="primary"
                    >
                      Member Sign-In
                    </Button>
                  </Hide>
                  <Hide above="md">
                    <NextLink
                      passHref
                      href="/login"
                    >
                      <IconButton
                        as="a"
                        size="sm"
                        variant="ghost"
                        fontSize="2em"
                        aria-label="member sign-in"
                        icon={<MdOutlinePerson />}
                      />
                    </NextLink>
                  </Hide>
                </>
              )}
              <Box position="relative">
                <NextLink href="/shopping-cart">
                  <IconButton
                    variant="ghost"
                    fontSize="2em"
                    icon={<MdOutlineShoppingCart />}
                    aria-label="cart"
                  />
                  {order?.LineItemCount > 0 && (
                    <Badge
                      zIndex={1}
                      position="absolute"
                      left={{ base: '70%', lg: '100%' }}
                      top="25%"
                      ml="-1"
                      bgColor="primary"
                      color="white"
                      boxSize="1.5em"
                      borderRadius="xl"
                      display="inline-flex"
                      justifyContent="center"
                    >
                      {minicartLineItemCount}
                    </Badge>
                  )}
                </NextLink>
              </Box>
            </ButtonGroup>
          </HStack>
        </Container>
        <Show above="md">
          <Container
            as="nav"
            overflow="auto"
            display="flex"
            alignItems="center"
            maxW="container.2xl"
            w="full"
            pb={2}
            gap={2}
          >
            <Button
              id="SHOP_ALL_BTN"
              display="flex"
              cursor="pointer"
              onClick={onCategoryToggle}
              variant="ghost"
              size="sm"
              rounded="md"
              colorScheme="primary"
              fontWeight="700"
              minW="fit-content"
            >
              Shop All Categories
            </Button>
            <Placeholder
              name="header-main-navigation"
              rendering={props.rendering}
            />
          </Container>
        </Show>
        {isCategoryOpen && (
          <Box
            ref={ref}
            bgColor="chakra-body-bg"
            shadow="md"
            overflow="auto"
            h={{ base: '50vh', sm: '65vh', md: '45vh', lg: '20vh' }}
            top={{
              base: '121px !important',
              md: '102px !important',
            }}
            zIndex={-1}
            in={isCategoryOpen}
            w="full"
            p={6}
            direction="top"
            as={Slide}
            position="relative"
          >
            <Container
              px={0}
              maxW="container.2xl"
            >
              <Hide above="md">
                <Placeholder
                  name="header-main-navigation"
                  rendering={props.rendering}
                />
              </Hide>
              <CategoryNavigationList />
              <Button
                position="absolute"
                bottom="4"
                right="8"
                onClick={onCategoryClose}
                leftIcon={<MdKeyboardArrowUp />}
                variant="outline"
                size="xs"
              >
                Collapse
              </Button>
            </Container>
          </Box>
        )}
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose} /*finalFocusRef={btnRef}*/
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader color={color}>Application Settings</DrawerHeader>
            <DrawerBody
              color={color}
              display="flex"
              flexFlow="column nowrap"
            >
              <FormLabel htmlFor="ThemeDropdown">Configure checkout flow:</FormLabel>
              <Select
                id="ThemeDropdown"
                onChange={selectChange}
                placeholder="Select a flow"
                value={currentcheckoutflow}
              >
                <option value="/check-out">Single page flow</option>
                <option value="/check-out-points">Single page points flow</option>
                <option value="/check-out-food">Food Item flow</option>
                <option value="/check-out-stepped">Stepped flow</option>
                <option value="/check-out-accordion">Accordion flow</option>
                <option value="/check-out-off-canvas">Off Canvas flow</option>
                <option value="/check-out-quote">Quote flow</option>
              </Select>
              <List
                mt="auto"
                gap={5}
                display="flex"
                flexFlow="column nowrap"
              >
                <ListItem>
                  <ListIcon
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="blue"
                    as={GoListUnordered}
                  />
                  <strong>Single Page Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Based of an Amazon checkout where everything is done on one page.
                  </Text>
                </ListItem>
                <ListItem fontSize="14px">
                  <ListIcon
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="green"
                    as={GoNumber}
                  />
                  <strong>Points Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Allow a user to shop with a spending account and redeem products via points.
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="orange"
                    as={GoBook}
                  />
                  <strong>Food item Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Allow users to shop for menu items or products and pay with a credit card or
                    with a spending account and redeem with points.
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon
                    as={PiSteps}
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="purple"
                  />
                  <strong>Stepped Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Traditional flow that takes the user through a few steps to complete the
                    checkout.
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon
                    as={TfiLayoutAccordionSeparated}
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="red"
                  />
                  <strong>Accordion Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Similar to the stepped flow but everything is on one page and the user goes
                    through each stepped presented in a accordion.
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon
                    as={PiArrowSquareRight}
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="pink"
                  />
                  <strong>Off Canvas Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Check out flow that slides in from the side and the checkout is completed in the
                    side window.
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon
                    as={PiListChecks}
                    layerStyle="icon.subtle"
                    boxSize="icon.lg"
                    color="green"
                  />
                  <strong>Quote Flow</strong>
                  <Text
                    fontSize="sm"
                    color="chakra-subtle-text"
                  >
                    Designed to be used to allow the user to request a price quote for a specific
                    product. This will have a workflow where the amin will be able to send back a
                    price for the customer to approve and buy or continue to negotiate the price.
                  </Text>
                </ListItem>
              </List>
            </DrawerBody>

            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </VStack>
      <Tooltip
        label="Application Settings"
        placement="left"
      >
        <IconButton
          size="md"
          variant="solid"
          colorScheme="neutral"
          borderRightRadius={0}
          padding="initial"
          margin="initial"
          opacity=".5"
          _hover={{ opacity: 1, '& svg': { transform: 'rotate(15deg)' } }}
          aria-label="Application Settings"
          onClick={onOpen}
          shadow="sm"
          w="50px"
          zIndex={2}
          fontSize="1.5em"
          icon={<MdOutlineSettings />}
          position="fixed"
          bottom={8}
          right={0}
          justifyContent="flex-start"
          pl={3}
        />
      </Tooltip>
    </>
  )
}

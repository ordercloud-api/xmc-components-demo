/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
  useToast,
  CardFooter,
} from '@chakra-ui/react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import OcAddressForm from './checkout/OcAddressForm';
import {
  Addresses,
  //Addresses,
  BuyerProduct,
  CreditCards,
  //CreditCards,
  LineItems,
  Me,
  Orders,
  Payments,
  SpendingAccounts,
  Tokens,
} from 'ordercloud-javascript-sdk';
import { set } from 'lodash';
//import { ocConfig } from 'src/Layout';
import { useOcDispatch } from 'src/redux/ocStore';
import login from 'src/redux/ocAuth/login';
import formatPoints from 'src/utils/formatPoints';

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface Fields {
  Title: Field<string>;
  AccountTitle: Field<string>;
  UserName: Field<string>;
  Password: Field<string>;
  UserNameWaterMark: Field<string>;
  PasswordWaterMark: Field<string>;
  ErrorMessage: Field<string>;
  SubmitButton: LinkField;

  //Additional Fields
  ShowAdditionalFields: Field<boolean>;
  AdditionalTitle: Field<string>;

  //Address Information
  FirstName: Field<string>;
  FirstNameWaterMark: Field<string>;
  LastName: Field<string>;
  LastNameWaterMark: Field<string>;
  Address: Field<string>;
  AddressWaterMark: Field<string>;
  AddressTwo: Field<string>;
  AddressTwoWaterMark: Field<string>;
  City: Field<string>;
  CityWaterMark: Field<string>;
  State: Field<string>;
  StateWaterMark: Field<string>;
  PostalCode: Field<string>;
  PostalCodeWaterMark: Field<string>;
  Country: Field<string>;
  CountryWaterMark: Field<string>;

  //Phone Information
  Phone: Field<string>;
  PhoneWaterMark: Field<string>;
}

type LandingPageProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const Default = (props: LandingPageProps): JSX.Element => {
  const dispatch = useOcDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([] as BuyerProduct[]);
  const { sitecoreContext } = useSitecoreContext();
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `landing-page-${props.params.DynamicPlaceholderId}`;
  let backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (backgroundImage) {
    const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    };
  }

  const handleSetBillingAddress = (address: unknown) => {
    console.log(address);
  };

  const [formData, setFormData] = useState({
    package: '',
    account: {
      emailaddress: '',
      password: '',
    },
    billingAddress: {
      FirstName: 'George',
      LastName: 'Haeger',
      Street1: '110 N. 5th St #300',
      Street2: '',
      City: 'Minneapolis',
      State: 'MN',
      Zip: '55403',
      Country: 'US',
      Phone: '(555) 555-5555',
    },
    creditCard: {
      nameOnCard: 'George Haeger',
      cardNumber: '4111111111111111',
      expirationMonth: '12',
      expirationYear: '2025',
    },
  });

  const updateForm = (path: string, value: string) => {
    const clone = JSON.parse(JSON.stringify(formData));
    const update = set(clone, path, value);
    setFormData(update);
  };

  useEffect(() => {
    const getPackages = async () => {
      const packages = await Me.ListProducts({
        filters: { 'xp.ProductType': 'Timeshare Trial' },
      });
      setPackages(packages.Items);
    };
    getPackages();
  }, []);

  const onFormSubmit = async () => {
    try {
      setLoading(true);
      if (!formData.package) {
        toast({
          title: 'Missing Selection',
          description: 'Please select a package',
          status: 'error',
          duration: 5000,
          position: 'top',
        });
        return;
      }
      if (!formData.account.emailaddress || !formData.account.password) {
        toast({
          title: 'Missing Information',
          description: 'Please enter your email address and password',
          status: 'error',
          duration: 5000,
          position: 'top',
        });
        return;
      }

      // Create user and set access token
      const { access_token } = await Me.Register(
        {
          FirstName: formData.billingAddress.FirstName,
          LastName: formData.billingAddress.LastName,
          Username: formData.account.emailaddress,
          Password: formData.account.password,
          Email: formData.account.emailaddress,
          Phone: formData.billingAddress.Phone,
          Active: true,
        },
        { anonUserToken: Tokens.GetAccessToken() }
      );
      Tokens.SetAccessToken(access_token);
      const me = await Me.Get();

      // Create and assign buyer address
      const address = await Addresses.Create(me.Buyer.ID, {
        CompanyName: 'Users Billing Address',
        FirstName: formData.billingAddress.FirstName,
        LastName: formData.billingAddress.LastName,
        Street1: formData.billingAddress.Street1,
        Street2: formData.billingAddress.Street2,
        City: formData.billingAddress.City,
        State: formData.billingAddress.State,
        Zip: formData.billingAddress.Zip,
        Country: formData.billingAddress.Country,
        Phone: formData.billingAddress.Phone,
        AddressName: 'Billing Address',
      });
      await Addresses.SaveAssignment(me.Buyer.ID, {
        AddressID: address.ID,
        UserID: me.ID,
        IsBilling: true,
        IsShipping: true,
      });

      // Create and assign buyer credit card
      const creditcard = await CreditCards.Create(me.Buyer.ID, {
        Token: 'mocktoken',
        CardType: 'Visa',
        PartialAccountNumber: formData.creditCard.cardNumber.substr(-4),
        CardholderName: formData.creditCard.nameOnCard,
        ExpirationDate:
          formData.creditCard.expirationMonth + '/' + formData.creditCard.expirationYear,
      });
      await CreditCards.SaveAssignment(me.Buyer.ID, {
        CreditCardID: creditcard.ID,
      });
      //
      // Create and submit time share order
      const order = await Orders.Create('All', {});
      await LineItems.Create('All', order.ID, { ProductID: formData.package });
      await Orders.Patch('All', order.ID, { BillingAddressID: address.ID });

      await Payments.Create('All', order.ID, {
        Type: 'CreditCard',
        Accepted: true,
        xp: { CreditCard: formData.creditCard, category: 'User Subscription Events' },
      });
      await Orders.Submit('All', order.ID);

      // Get next year date (used when creating spending account and subscription)
      const now = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);

      // Create prefilled Spending Account
      const pointsPackage = packages.find((p) => p.ID === formData.package);
      const spendingAccount = await SpendingAccounts.Create(me.Buyer.ID, {
        Name: pointsPackage.Name,
        Balance: pointsPackage.xp.PointsReceived,
        AllowAsPaymentMethod: true,
        EndDate: nextYear.toISOString(),
        xp: { Tier: pointsPackage.Name },
      });

      await SpendingAccounts.SaveAssignment(me.Buyer.ID, {
        SpendingAccountID: spendingAccount.ID,
        UserID: me.ID,
      });

      const subscription = await Me.CreateSubscription({
        Frequency: 12,
        Interval: 'Months',
        NextOrderDate: nextYear.toISOString(),
        Active: true,
        EndDate: nextYear.toISOString(),
        Payment: {
          Type: 'PurchaseOrder',
        },
        xp: {
          CreditCard: formData.creditCard,
          BillingAddress: formData.billingAddress,
        },
      });
      await Me.CreateSubscriptionItem(subscription.ID, {
        ProductID: formData.package,
        Quantity: 1,
      });
      dispatch(
        login({ username: formData.account.emailaddress, password: formData.account.password })
      );
      setIsModalOpen(true);
    } catch (error) {
      if (error.isOrderCloudError) {
        const firstError = error.errors[0];
        toast({
          title: 'Error',
          description: firstError?.Message,
          status: 'error',
          duration: 5000,
          position: 'top',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unknown error occurred',
          status: 'error',
          duration: 5000,
          position: 'top',
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack
      className={`component container ${styles}`}
      as="section"
      w="100%"
      width="full"
      pt="40px"
      pb="40px"
      mt="30px"
      style={backgroundStyle}
      maxW="1280px"
      textAlign="left"
      alignItems="flex-start"
    >
      <HStack
        as="section"
        w="100%"
        width="full"
        className="component-content"
        style={backgroundStyle}
      >
        <Container as="form" onSubmit={onFormSubmit} maxW="container.xl" w="100%" width="full">
          <VStack w="100%" width="full" maxW="1280px" textAlign="left" alignItems="flex-start">
            <Placeholder name={phKey} rendering={props.rendering} />
            <Heading fontSize="lg">Choose your Package:</Heading>
            <SimpleGrid columns={2} spacing="40px" width="full" mb={8}>
              {packages.map((p) => {
                return (
                  <Card
                    variant="elevated"
                    key={p.ID}
                    onClick={() => updateForm('package', p.ID)}
                    border={p.ID === formData.package ? '2px solid #3182ce' : '1px solid #CBD5E0'}
                    borderRadius="xl"
                    shadow="xl"
                    cursor="pointer"
                  >
                    <CardHeader>
                      <Heading>{p.Name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>{p.Description}</Text>
                    </CardBody>
                    <CardFooter>
                      <HStack w="full" width="100%" alignSelf="stretch" justifyContent="stretch">
                        <Text w="full" width="100%" alignSelf="stretch" justifyContent="stretch">
                          <b>Purchase price :</b> {p.xp?.PurchasePrice}
                        </Text>
                        <Text w="full" width="100%" alignSelf="stretch" justifyContent="stretch">
                          <b>Points included :</b> {formatPoints(p.xp?.PointsReceived)}
                        </Text>
                      </HStack>
                    </CardFooter>
                  </Card>
                );
              })}
            </SimpleGrid>

            {/* Account Information */}
            <Card variant="filled" width="full" padding={5} marginBottom={8}>
              <CardHeader>
                <Heading fontSize="lg">Account Information</Heading>
              </CardHeader>
              <CardBody>
                <HStack>
                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      value={formData.account.emailaddress}
                      onChange={(e) => updateForm('account.emailaddress', e.target.value)}
                      id={`email_address`}
                      name="emailaddress"
                      placeholder="Enter email address"
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      value={formData.account.password}
                      onChange={(e) => updateForm('account.password', e.target.value)}
                      type="password"
                      id={`password`}
                      name="password"
                      placeholder="Enter password"
                      required
                    />
                  </FormControl>
                </HStack>
              </CardBody>
            </Card>

            {/* Billing Information */}
            <Card variant="filled" width="full" padding={5} marginBottom={8}>
              <CardHeader>
                <Heading fontSize="lg">Billing Information</Heading>
              </CardHeader>
              <CardBody>
                <OcAddressForm
                  address={formData.billingAddress}
                  formfields={props.fields}
                  id="billing"
                  onSubmit={handleSetBillingAddress}
                />
              </CardBody>
            </Card>

            {/* Credit Card Information */}
            <Card variant="filled" width="full" padding={5} marginBottom={8}>
              <CardHeader>
                <Heading fontSize="lg">Credit Card Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack>
                  <HStack width="full">
                    <FormControl>
                      <FormLabel>Name on card</FormLabel>
                      <Input
                        value={formData.creditCard.nameOnCard}
                        onChange={(e) => updateForm('creditCard.nameOnCard', e.target.value)}
                        type="text"
                        id={`name_on_card`}
                        name="nameoncard"
                        placeholder="Enter name on card"
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Credit Card Number</FormLabel>
                      <Input
                        value={formData.creditCard.cardNumber}
                        onChange={(e) => updateForm('creditCard.cardNumber', e.target.value)}
                        type="text"
                        id={`credit_card_number`}
                        name="creditcardnumber"
                        placeholder="Enter credit card number"
                        required
                      />
                    </FormControl>
                  </HStack>
                  <HStack width="full">
                    <FormControl>
                      <FormLabel>Expiration Month</FormLabel>
                      <Input
                        value={formData.creditCard.expirationMonth}
                        onChange={(e) => updateForm('creditCard.expirationMonth', e.target.value)}
                        type="text"
                        id={`credit_card_expiration_month`}
                        name="creditcardexpirationmonth"
                        placeholder="Enter credit card expiration month"
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Expiration Year</FormLabel>
                      <Input
                        value={formData.creditCard.expirationYear}
                        onChange={(e) => updateForm('creditCard.expirationYear', e.target.value)}
                        type="text"
                        id={`credit_card_expiration_year`}
                        name="creditcardexpirationyear"
                        placeholder="Enter credit card expiration year"
                        required
                      />
                    </FormControl>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            <Button mt="10px" variant={'primaryButton'} onClick={onFormSubmit} isLoading={loading}>
              Purchase Subscription
            </Button>
          </VStack>
        </Container>
      </HStack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Congratulations, welcome to the family.</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="50">
            <Text>
              You have successfuly subscribed to a package and now can start booking your travel
              experiences.
            </Text>
            <HStack>
              <NextLink href={`/product-lists`} passHref>
                <Link color="gray.800">
                  <Button mt="10px" variant={'primaryButton'}>
                    <Text>Start Shopping</Text>
                  </Button>
                </Link>
              </NextLink>
              <NextLink href={`/my-profile`} passHref>
                <Link color="gray.800">
                  <Button mt="10px" variant={'primaryButton'}>
                    <Text>Go to my profile</Text>
                  </Button>
                </Link>
              </NextLink>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

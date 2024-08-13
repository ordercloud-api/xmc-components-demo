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
  VStack,
  useToast,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Link,
} from '@chakra-ui/react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  Placeholder,
  RichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import NextLink from 'next/link';
import React, { useState } from 'react';
import OcAddressForm from './checkout/OcAddressForm';
import { Addresses, Me, SpendingAccounts, Tokens } from 'ordercloud-javascript-sdk';
import { set } from 'lodash';
import { useOcDispatch } from 'src/redux/ocStore';
import login from 'src/redux/ocAuth/login';

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
  ShowAdditionalFields: Field<string>;
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

type RegisterProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const Default = (props: RegisterProps): JSX.Element => {
  const dispatch = useOcDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `register-page-${props.params.DynamicPlaceholderId}`;

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
      FirstName: 'Test',
      LastName: 'User',
      Street1: '110 N. 5th St #300',
      Street2: '',
      City: 'Minneapolis',
      State: 'MN',
      Zip: '55403',
      Country: 'US',
      Phone: '(555) 555-5555',
    },
  });

  const updateForm = (path: string, value: string) => {
    const clone = JSON.parse(JSON.stringify(formData));
    const update = set(clone, path, value);
    setFormData(update);
  };

  const onFormSubmit = async () => {
    try {
      setLoading(true);
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

      // Get next year date (used when creating spending account and subscription)
      const now = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);

      // Create prefilled Spending Account
      //const pointsPackage = packages.find((p) => p.ID === productID); // Map this to a product in OC
      const pointsPackage = 2500;
      const spendingAccount = await SpendingAccounts.Create(me.Buyer.ID, {
        //Name: pointsPackage.Name, //Mapped to product in OC
        Name: 'Introductory Points',
        Balance: pointsPackage,
        AllowAsPaymentMethod: true,
        EndDate: nextYear.toISOString(),
        xp: { Tier: 'Introductory Points' },
      });

      await SpendingAccounts.SaveAssignment(me.Buyer.ID, {
        SpendingAccountID: spendingAccount.ID,
        UserID: me.ID,
      });

      setIsModalOpen(true);
      dispatch(
        login({ username: formData.account.emailaddress, password: formData.account.password })
      );
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
      maxW="1280px"
      textAlign="left"
      alignItems="flex-start"
    >
      <HStack as="section" w="100%" width="full" className="component-content">
        <Container as="form" onSubmit={onFormSubmit} maxW="container.xl" w="100%" width="full">
          <VStack w="100%" width="full" maxW="1280px" textAlign="left" alignItems="flex-start">
            {props.fields.Title && (
              <Box width="full" w="100%" textAlign="left">
                <Heading>
                  <RichText field={props.fields.Title} />
                </Heading>
              </Box>
            )}
            <Placeholder name={phKey} rendering={props.rendering} />
            {/* Account Information */}
            <Card variant="filled" width="full" padding={5} marginBottom={8}>
              <CardHeader>
                {props.fields.AccountTitle && (
                  <Heading fontSize="xl">
                    <RichText field={props.fields.AccountTitle} />
                  </Heading>
                )}
              </CardHeader>
              <CardBody>
                <HStack>
                  <FormControl>
                    <FormLabel>
                      <RichText field={props.fields.UserName} />
                    </FormLabel>
                    <Input
                      value={formData.account.emailaddress}
                      onChange={(e) => updateForm('account.emailaddress', e.target.value)}
                      id={`email_address`}
                      name="emailaddress"
                      placeholder={props.fields.UserNameWaterMark.value}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>
                      <RichText field={props.fields.Password} />
                    </FormLabel>
                    <Input
                      value={formData.account.password}
                      onChange={(e) => updateForm('account.password', e.target.value)}
                      type="password"
                      id={`password`}
                      name="password"
                      placeholder={props.fields.PasswordWaterMark.value}
                      required
                    />
                  </FormControl>
                </HStack>
              </CardBody>
            </Card>
            {props.fields.ShowAdditionalFields.value.toString() == '1'}({/* Billing Information */}
            <Card variant="filled" width="full" padding={5} marginBottom={8}>
              <CardHeader>
                {props.fields.AdditionalTitle && (
                  <Heading fontSize="xl">
                    <RichText field={props.fields.AdditionalTitle} />
                  </Heading>
                )}
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
            ):()
            <Button
              disabled={loading}
              type="submit"
              bgColor="brand.500"
              color="white"
              ml="20px"
              w="100%"
              width="full"
              onClick={onFormSubmit}
              isLoading={loading}
              variant={props?.fields?.SubmitButton?.value?.class || 'primaryButton'}
            >
              {props?.fields?.SubmitButton?.value?.text}
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
            <Text>You have successfuly registered an account on our site.</Text>
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

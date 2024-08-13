/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { Button, HStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputControl } from 'formik-chakra-ui';
import router from 'next/router';

interface Fields {
  Title: Field<string>;
  InputWatermark: Field<string>;
  CallToAction: LinkField;
}

type ComponentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

function setSubmitting(term: string) {
  router.replace('/search?term=' + term);
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();

  return (
    <Formik
      initialValues={{ search: '' }}
      onSubmit={async (values) => {
        setSubmitting(values.search);
      }}
    >
      {(props) => (
        <Form>
          <HStack
            border="1px"
            borderColor="blackAlpha.300"
            borderRadius="xl"
            width="100%"
            maxWidth="700px"
            pr="5px"
            bg="#fff"
            className={`search-input ${styles}`}
          >
            <InputControl
              name="search"
              inputProps={{
                placeholder: 'Enter search term',
                border: 'none',
                height: '40px',
                color: 'gray.500',
                background: 'none',
                fontSize: '16px',
              }}
              label=""
            />

            <Button
              mt="0px"
              pt="10px"
              pb="10px"
              pl="20px"
              pr="20px"
              bg="brand.500"
              isLoading={props.isSubmitting}
              type="submit"
              color="white"
              fontSize="16px"
              right="-7px"
              height="40px"
              borderRadius="none"
            >
              Search
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
};

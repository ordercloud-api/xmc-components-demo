/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { HStack, Link, Spacer } from '@chakra-ui/react';
import { HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineUserCircle } from 'react-icons/hi';
import NextLink from 'next/link';
import { useOcSelector } from 'src/redux/ocStore';

interface Fields {
  LoginTitle: Field<string>;
  LoginIcon: Field<string>;
  LoginCallToAction: LinkField;
  LogOutTitle: Field<string>;
  LogOutIcon: Field<string>;
  LogOutCallToAction: LinkField;
  MyProfileTitle: Field<string>;
  MyProfileIcon: Field<string>;
  MyProfileCallToAction: LinkField;
}

type ComponentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();

  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }));

  return (
    <HStack className={`my-profile-icon ${styles}`}>
      <HStack>
        {!isAnonymous ? (
          <NextLink href={props.fields.MyProfileCallToAction.value.href} passHref>
            <Link color="gray.800">
              <HStack>
                <HiOutlineUserCircle fontSize="36px" color="gray.800" />
                {props.fields.MyProfileTitle.value}
              </HStack>
            </Link>
          </NextLink>
        ) : (
          <NextLink href={props.fields.LoginCallToAction.value.href} passHref>
            <Link color="gray.800">
              <HStack>
                <HiOutlineLockClosed fontSize="36px" color="gray.800" />
                {props.fields.LoginTitle.value}
              </HStack>
            </Link>
          </NextLink>
        )}
      </HStack>
      <HStack pl="3px">
        {!isAnonymous ? (
          <NextLink href={props.fields.LogOutCallToAction.value.href} passHref>
            <Link color="gray.800">
              <HStack>
                <HiOutlineLockOpen fontSize="36px" color="gray.800" />
                {props.fields.LogOutTitle.value}
              </HStack>
            </Link>
          </NextLink>
        ) : (
          <Spacer></Spacer>
        )}
      </HStack>
    </HStack>
  );
};

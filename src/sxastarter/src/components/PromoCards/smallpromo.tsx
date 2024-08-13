/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Button, HStack, Link } from '@chakra-ui/react';
import {
  ImageField,
  ImageFieldValue,
  Image as JssImage,
  Text,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

import React from 'react';

export default function SmallPromo(props: {
  params: { styles: unknown };
  fields: {
    PromoIcon: ImageField | ImageFieldValue;
    PromoText: TextField;
    PromoText2: TextField;
    PromoLink: {
      value: {
        href: string;
        title: string;
        class: string;
        text:
          | string
          | number
          | boolean
          | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
          | React.ReactFragment
          | React.ReactPortal
          | React.PromiseLikeOfReactNode;
      };
    };
  };
}) {
  console.log('component Props');
  console.log(props);
  return (
    <div className={`component promo ${props.params.styles}`}>
      <HStack>
        <div className="field-promoicon">
          <JssImage field={props.fields.PromoIcon} />
        </div>
        <div className="component-content">
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <Text className="promo-text" field={props.fields.PromoText} />
              </div>
            </div>
            <div className="field-promotext">
              <Text className="promo-text" field={props.fields.PromoText2} />
            </div>
          </div>
          {props?.fields?.PromoLink?.value?.href && (
            <Link
              href={props?.fields?.PromoLink?.value?.href}
              title={props?.fields?.PromoLink?.value?.title}
            >
              <Button mt="10px" variant={props?.fields?.PromoLink?.value?.class || 'primaryButton'}>
                {props?.fields?.PromoLink?.value?.text}
              </Button>
            </Link>
          )}
        </div>
      </HStack>
    </div>
  );
}

import React from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { Image } from '@chakra-ui/react';

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();

  return (
    <Image
      maxW="250px"
      width="100%"
      objectFit="contain"
      src="https://wwwsitecorecom.azureedge.net/-/media/sitecoresite/images/global/logo/sitecore-logo.svg?la=en&amp;hash=2134EC93C845A2DAC7C816F011AA5C52"
      alt="Sitecore"
      className={`component container ${styles}`}
    />
  );
};

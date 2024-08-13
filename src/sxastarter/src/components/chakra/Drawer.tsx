import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Flex, Drawer } from '@chakra-ui/react';
import { buildStylesObj } from 'src/utils/formatStyles';

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const phKey = `drawer-${props.params.DynamicPlaceholderId}`;
  const stylesObj = buildStylesObj(containerStyles);

  return (
    <Drawer className={`drawer component`} w="100%" width="full" {...stylesObj}>
      <Flex>
        <Placeholder name={phKey} rendering={props.rendering} />
      </Flex>
    </Drawer>
  );
};

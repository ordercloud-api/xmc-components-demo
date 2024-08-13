import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { Box } from '@chakra-ui/react';
import React from 'react';
import { useOcSelector } from 'src/redux/ocStore';

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ComponentProps): JSX.Element => {
  const phKey = `anonymous-placeholder-${props.params.DynamicPlaceholderId}`;
  const phKeyKnown = `authenticated-placeholder-${props.params.DynamicPlaceholderId}`;
  let backgroundImage = props.params.BackgroundImage as string;

  if (backgroundImage) {
    //const prefix = `${sitecoreContext.pageState !== 'normal' ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    // backgroundStyle = {
    //   backgroundImage: `url('${prefix}${backgroundImage}')`,
    // };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }));

  return (
    <Box w="100%" width="full">
      {!isAnonymous ? (
        <Box>
          <Placeholder name={phKeyKnown} rendering={props.rendering} />
        </Box>
      ) : (
        <Box>
          <Placeholder name={phKey} rendering={props.rendering} />
        </Box>
      )}
    </Box>
  );
};

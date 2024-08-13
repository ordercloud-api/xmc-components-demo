import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `menu-${props.params.DynamicPlaceholderId}`;

  return (
    <Menu>
      <MenuButton
        className={`component container ${styles}`}
        as={Button}
        // rightIcon={<ChevronDownIcon />}
        // leftIcon={<HiMenu />}
        bg="brand.500"
        color="white"
        fontSize="x-small"
        mr="4"
      >
        All Departments
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
        <Placeholder name={phKey} rendering={props.rendering} />
      </MenuList>
    </Menu>
  );
};

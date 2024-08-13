import React from 'react';
import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      {children}
    </Box>
  );
};

export default Layout;

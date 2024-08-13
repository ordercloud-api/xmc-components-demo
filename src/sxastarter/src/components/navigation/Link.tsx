import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

// combines chakra ui, with functionality needed for nextjs links
// https://jools.dev/using-nextjs-link-with-chakra-ui-link
const AppLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <NextLink href={href} passHref>
      <Link>{children}</Link>
    </NextLink>
  );
};

export default AppLink;

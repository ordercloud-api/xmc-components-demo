import { defineStyleConfig } from '@chakra-ui/react'

export const Link = defineStyleConfig({
  baseStyle: {
    textDecoration: 'none',
    _hover: {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
})

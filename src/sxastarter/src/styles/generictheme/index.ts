import { extendTheme } from '@chakra-ui/react'
import sitecoreTheme from '@sitecore/blok-theme'
import colors from '../generictheme/foundations/colors'
import { Link } from './components/link'
// import type {StyleFunctionProps} from "@chakra-ui/styled-system"

import { Card } from './components/card'
import { styles } from './styles'

export default extendTheme(
  {
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    //INFO: let's start with default blok and bring back overrides as needed
    styles,
    colors,
    components: {
      Card,
      Link,
    },
    sizes: {
      container: {
        '2xl': '1440px',
        '3xl': '1536px',
      },
    },
  },
  sitecoreTheme
)

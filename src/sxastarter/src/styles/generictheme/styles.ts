import { Styles } from '@chakra-ui/theme-tools'

export const styles: Styles = {
  global: {
    'header .chakra-slide .link-list .chakra-stack': {
      flexWrap: 'wrap',
    },
    html: {
      overflowY: 'scroll',
    },
    // I think this might be a styling bug in Blok
    '& .chakra-toast__inner > .chakra-alert': {
      '--alert-fg': 'chakra-body-text !important',
    },
  },
}

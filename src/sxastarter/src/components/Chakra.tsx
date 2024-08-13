import React from 'react'
import { ChakraProvider, localStorageManager } from '@chakra-ui/react'
import petsgalore from '../styles/petsgalore'
import generictheme from '../styles/generictheme'
import playmarketplace from '../styles/playmarketplace'

interface ChakraProps {
  children: React.ReactNode
  currentTheme: string
}

export const Chakra = ({ children, currentTheme }: ChakraProps) => {
  let selectedTheme
  switch (currentTheme) {
    case 'playmarketplace':
      selectedTheme = playmarketplace
      break
    case 'petsgalore':
      selectedTheme = petsgalore
      break
    default:
      selectedTheme = generictheme
  }

  return (
    <ChakraProvider
      colorModeManager={localStorageManager}
      theme={selectedTheme}
    >
      {children}
    </ChakraProvider>
  )
}

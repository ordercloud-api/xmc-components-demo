import React from 'react'
import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs'
import { Grid } from '@chakra-ui/react'
import { buildStylesObj } from 'src/utils/formatStyles'

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams }
  params: ComponentParams
}

export const Default = (props: ComponentProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const phKey = `grid-${props.params.DynamicPlaceholderId}`
  const stylesObj = buildStylesObj(containerStyles)

  return (
    <Grid
      className={`grid component`}
      w="100%"
      width="full"
      {...stylesObj}
    >
      <Placeholder
        name={phKey}
        rendering={props.rendering}
      />
    </Grid>
  )
}

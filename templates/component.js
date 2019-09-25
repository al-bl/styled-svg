import React from 'react'
import styled, { css } from 'styled-components'
import {createHelpers} from './helpers'

const width = '##WIDTH##'
const height = '##HEIGHT##'
const viewBox = '##VIEWBOX##'

const { getDimensions, getCss, propsToCss, sanitizeSizes } = createHelpers(
  width,
  height,
  css
)

const sizes = sanitizeSizes('##SIZES##')

const Image = styled.svg`
  ${propsToCss}
`

const children = <>##SVG##</>

const defaultProps = {
  children,
  viewBox,
  fillColor: null,
  fillColorRule: '&&& path, &&& use, &&& g',
  sizes,
  size: null
}

export default Object.assign(Image, {
  getDimensions,
  getCss,
  defaultProps,
  displayName: '##NAME##'
})

import React from 'react'
import styled, { css } from 'styled-components'

const createHelpers = '##CREATEHELPERS##'

const width = '14'
const height = '14'
const viewBox = '0 0 14 14'

const { getDimensions, getCss, propsToCss, sanitizeSizes } = createHelpers(
  width,
  height,
  css
)

const sizes = sanitizeSizes({
  small: { width: 18, height: 18 },
  medium: { width: 24, height: 24 },
  large: { width: 36, height: 36 }
})

const Image = styled.svg`
  ${propsToCss}
`

const children = (
  <>
    <defs key='key-0'>
      <circle id='s-c19cde862f-a' cx='7' cy='7' r='7' />
    </defs>
    <g fill='none' fillRule='evenodd' key='key-1'>
      <use fill='#FFF' xlinkHref='#s-c19cde862f-a' />
      <circle cx='7' cy='7' r='6.5' stroke='#FF7500' />
      <circle cx='7' cy='7' r='7.5' stroke='#FFF' />
      <circle cx='7' cy='7' r='3' fill='#FF7500' />
    </g>
  </>
)

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
  displayName: 'CheckedFocused'
})

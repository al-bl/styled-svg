import React from 'react'
import styled, { css } from 'styled-components'

const createHelpers = '##CREATEHELPERS##'

const width = '18'
const height = '18'
const viewBox = '0 0 18 18'

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
    <g fill='none' fillRule='evenodd' key='key-0'>
      <path
        fill='#FFCF29'
        d='M7.236 1.095L5.68 4.193.204 15.143A2 2 0 002.011 18h14a2 2 0 002-2c0-.306-.074-.592-.197-.851l-5.47-10.956-1.558-3.098A1.993 1.993 0 009.011 0c-.777 0-1.443.448-1.775 1.095z'
      />
      <path
        fill='#333'
        d='M9.02 12a1 1 0 01-1-1V5a1 1 0 012.001 0v6a1 1 0 01-1 1m0 4c-.261 0-.521-.11-.712-.29-.18-.19-.29-.44-.29-.71 0-.27.11-.52.29-.71.37-.37 1.042-.37 1.422 0 .18.19.29.45.29.71 0 .26-.11.52-.29.71-.19.18-.45.29-.71.29'
      />
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
  displayName: 'Warning'
})

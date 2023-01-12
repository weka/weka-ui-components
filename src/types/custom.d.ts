// import { AriaAttributes, DOMAttributes } from 'react'

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & {
    disabled?: boolean
  }>
  const src: string
  export default src
}

// declare module 'react' {
//   interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
//     disabled?: boolean
//   }
// }

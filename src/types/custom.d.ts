declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & {
    disabled?: boolean
  }>
  const src: string
  export default src
}

import React, { ReactNode } from 'react'
import clsx from 'clsx'
import SimpleBar from 'simplebar-react'

import 'simplebar-react/dist/simplebar.min.css'
import './scrollBar.scss'

function ScrollBar({
  children,
  extraClass,
  ...rest
}: {
  children: ReactNode
  extraClass?: string
}) {
  return (
    <SimpleBar className={clsx('scrollbar-wrapper', extraClass)} {...rest}>
      {children}
    </SimpleBar>
  )
}

export default ScrollBar

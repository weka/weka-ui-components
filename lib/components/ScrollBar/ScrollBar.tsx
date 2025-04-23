import React, { ReactNode, useEffect } from 'react'
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
  const scrollableNodeRef = React.useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollableNodeRef.current) {
      scrollableNodeRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <SimpleBar
      className={clsx('scrollbar-wrapper', extraClass)}
      scrollableNodeProps={{ ref: scrollableNodeRef }}
      {...rest}
    >
      {children}
    </SimpleBar>
  )
}

export default ScrollBar

import type { ReactNode } from 'react'
import React from 'react'
import clsx from 'clsx'

import { useToggle } from 'hooks'
import svgs from 'svgs'

import SpanTooltip from '../SpanTooltip/SpanTooltip'

import './summary.scss'

const { Arrow } = svgs

interface SummaryProps {
  title: string
  children: ReactNode
  expanded?: boolean
  onExpand?: (expanded: boolean) => void
}

function Summary({
  title,
  children,
  expanded: outerExpanded,
  onExpand: outerOnExpand
}: SummaryProps) {
  const [innerExpanded, toggleInnerExpanded] = useToggle(true)

  const isExpanded = outerExpanded ?? innerExpanded

  const handleClick = () => {
    toggleInnerExpanded()
    outerOnExpand?.(!isExpanded)
  }

  return (
    <div className='summary'>
      <button
        className={clsx({ title: true, 'title-expanded': isExpanded })}
        onClick={handleClick}
      >
        <Arrow
          className={clsx({
            arrow: true,
            'arrow-expanded': isExpanded
          })}
        />
        <SpanTooltip>{title}</SpanTooltip>
      </button>
      {isExpanded ? <div className='content'>{children}</div> : null}
    </div>
  )
}

export default Summary

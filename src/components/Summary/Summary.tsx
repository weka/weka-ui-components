import React, { ReactNode } from 'react'
import { useToggle } from '../../hooks'

import './summary.scss'
import { Arrow } from '../../svgs'
import clsx from 'clsx'

interface SummaryProps {
  title: ReactNode
  content: ReactNode
  expanded?: boolean
  onExpand?: (expanded: boolean) => void
}

function Summary(props: SummaryProps) {
  const {
    title,
    content,
    expanded: outerExpanded,
    onExpand: outerOnExpand
  } = props

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
        {title}
      </button>
      {isExpanded && <div className='content'>{content}</div>}
    </div>
  )
}

export default Summary

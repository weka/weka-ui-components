import React, { ReactNode } from 'react'
import { useToggle } from '../../hooks'

import './summary.scss'
import { Arrow } from '../../svgs'
import clsx from 'clsx'

interface SummaryProps {
  title: ReactNode
  content: ReactNode
}

function Summary(props: SummaryProps) {
  const { title, content } = props

  const [isExpanded, toggleIsExpanded] = useToggle(true)

  return (
    <div className='summary'>
      <button
        className={clsx({ title: true, 'title-expanded': isExpanded })}
        onClick={toggleIsExpanded}
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

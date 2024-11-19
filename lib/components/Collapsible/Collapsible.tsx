import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Info } from '../index'
import { EMPTY_STRING } from '~consts'
import { ThinArrow } from '~svgs'

import './collapsible.scss'

interface CollapsibleProps {
  children: React.ReactNode
  expanded?: boolean
  extraClass?: string
  label?: string
  info?: string
  onToggle?: () => void
  headerRightContent?: React.ReactNode
}

function Collapsible({
  expanded,
  children,
  extraClass,
  label,
  info,
  onToggle,
  headerRightContent,
  ...props
}: CollapsibleProps) {
  const [{ motion, height }, setState] = useState({
    motion: EMPTY_STRING,
    height: expanded ? 'auto' : 0
  })
  const hasNoChildren = React.Children.count(children) === 0
  const contentRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (mounted.current) {
      setState({
        motion: expanded ? 'expanding' : 'collapsing',
        height: contentRef.current?.clientHeight || 0
      })
    }
    mounted.current = true
  }, [expanded])

  useEffect(() => {
    if (motion === 'collapsing') {
      setState((state) => ({
        ...state,
        height: 0
      }))
    }
  }, [motion])

  useEffect(() => {
    if (contentRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === contentRef.current && expanded) {
            setState((state) => ({
              ...state,
              height: contentRef.current?.clientHeight || 0
            }))
          }
        }
      })
      resizeObserverRef.current.observe(contentRef.current)
    }
    return () => {
      resizeObserverRef.current?.disconnect()
    }
  }, [expanded])

  return (
    <div
      {...props}
      className={clsx(
        'collapsible',
        motion,
        { expanded: expanded && !motion },
        extraClass
      )}
    >
      <div className='collapsible-header'>
        <div className='collapsible-titles' onClick={onToggle}>
          <ThinArrow className={clsx('arrow-icon', { collapsed: !expanded })} />
          {label && (
            <label className='collapsible-label page-headline'>{label}</label>
          )}
          {info && <Info data={info} />}
        </div>
        {headerRightContent && (
          <div className='collapsible-header-right'>{headerRightContent}</div>
        )}
      </div>
      {!hasNoChildren && (
        <div className='collapsible-content-wrapper' style={{ height }}>
          <div ref={contentRef}>{children}</div>
        </div>
      )}
    </div>
  )
}

export default Collapsible

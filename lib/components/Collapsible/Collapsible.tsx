import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Info } from '../index'
import { EMPTY_STRING } from 'consts'
import svgs from 'svgs'

import './collapsible.scss'

const { ThinArrow } = svgs

interface CollapsibleProps {
  children: React.ReactNode
  onToggle: () => void
  expanded?: boolean
  extraClass?: string
  label?: string | React.ReactNode
  info?: string
  headerRightContent?: React.ReactNode
  expandOnHeaderClick?: boolean
}

function Collapsible(props: CollapsibleProps) {
  const {
    expanded,
    children,
    extraClass,
    label,
    info,
    onToggle,
    headerRightContent,
    expandOnHeaderClick,
    ...rest
  } = props
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
      {...rest}
      className={clsx(
        'collapsible',
        motion,
        { expanded: expanded && !motion },
        extraClass
      )}
    >
      <div
        className='collapsible-header'
        onClick={expandOnHeaderClick ? onToggle : undefined}
      >
        <div
          className='collapsible-titles'
          onClick={!expandOnHeaderClick ? onToggle : undefined}
        >
          <ThinArrow className={clsx('arrow-icon', { collapsed: !expanded })} />
          {label && (
            <div className='collapsible-label page-headline'>{label}</div>
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

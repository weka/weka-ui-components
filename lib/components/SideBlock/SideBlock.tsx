import type { ReactNode } from 'react'
import React, { useRef } from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import { useToggle } from 'hooks'
import svgs from 'svgs'

import Info from '../Info'
import type { menuItem } from '../MenuPopper/MenuPopper'
import MenuPopper from '../MenuPopper/MenuPopper'
import SpanTooltip from '../SpanTooltip'
import Tooltip from '../Tooltip'

import './sideBlock.scss'

const { MenuDots } = svgs

export interface SideBlockProps {
  name: string
  onSelect: () => void
  isSelected?: boolean
  actions?: (menuItem & { Icon: React.ReactNode })[]
  description?: string
  extraClass?: string
  children: ReactNode
  info?: string
}

function SideBlock({
  name,
  onSelect,
  description = EMPTY_STRING,
  isSelected = false,
  actions = [],
  extraClass = EMPTY_STRING,
  children,
  info
}: SideBlockProps) {
  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const shownActions = actions.filter((action) => !action.hideMenu)
  const hasActions = shownActions.length > 0

  const showActionsAsIcons =
    hasActions &&
    shownActions.every((action) => action.Icon) &&
    shownActions.length < 4
  return (
    <div
      onClick={onSelect}
      className={clsx({
        [extraClass]: true,
        'side-block-wrapper': true,
        'side-block-wrapper-selected': isSelected
      })}
    >
      <div className='side-block-title'>
        <SpanTooltip
          extraClasses={clsx({
            'data-3': true,
            'bold-main': isSelected
          })}
        >
          {name}
        </SpanTooltip>
        {info ? <Info data={info} /> : null}
      </div>
      {children}
      <SpanTooltip
        extraClasses='side-block-description dropdown-lines-2'
        isMultiLine
      >
        {description}
      </SpanTooltip>
      {showActionsAsIcons ? (
        <div className='side-block-actions'>
          {actions.map((action) => (
            <Tooltip
              key={action.text}
              data={action.text}
            >
              <div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick()
                  }}
                >
                  {action.Icon}
                </IconButton>
              </div>
            </Tooltip>
          ))}
        </div>
      ) : hasActions ? (
        <div
          ref={anchorRef}
          className={clsx({
            'side-block-actions': true,
            'side-block-actions-menu-open': isPopperOpen
          })}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              togglePopper()
            }}
          >
            <MenuDots />
          </IconButton>
        </div>
      ) : null}
      {hasActions && !showActionsAsIcons ? (
        <MenuPopper
          anchorEl={anchorRef.current}
          items={actions as menuItem[]}
          onClickAway={togglePopper}
          open={isPopperOpen}
        />
      ) : null}
    </div>
  )
}

export default SideBlock

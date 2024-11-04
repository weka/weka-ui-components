import React, { ReactNode, useRef } from 'react'
import MenuPopper, { menuItem } from '../MenuPopper/MenuPopper'
import useToggle from '../../hooks/useToggle'
import clsx from 'clsx'
import { EMPTY_STRING } from '../../consts'
import Info from '../Info'
import { MenuDots } from '../../svgs'
import { IconButton } from '@mui/material'
import Tooltip from '../Tooltip'
import SpanTooltip from '../SpanTooltip'

import './sideBlock.scss'

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
function SideBlock(props: SideBlockProps) {
  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const {
    name,
    onSelect,
    description,
    isSelected = false,
    actions = [],
    extraClass = EMPTY_STRING,
    children,
    info
  } = props
  const shownActions = actions.filter((action) => !action.hideMenu)
  const hasActions = shownActions.length > 0
  const showActionsAsIcons =
    hasActions &&
    shownActions.every((action) => action.Icon) &&
    shownActions.length < 4
  return (
    <div
      className={clsx({
        [extraClass]: true,
        'side-block-wrapper': true,
        'side-block-wrapper-selected': isSelected
      })}
      onClick={onSelect}
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
        {info && <Info data={info} />}
      </div>
      {children}
      <div className='dropdown-lines-2 side-block-description'>
        {description}
      </div>
      {showActionsAsIcons ? (
        <div className='side-block-actions'>
          {actions.map((action) => (
            <Tooltip data={action.text} key={action.text}>
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
        <div ref={anchorRef} className='side-block-actions'>
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
      {hasActions && !showActionsAsIcons && (
        <MenuPopper
          open={isPopperOpen}
          onClickAway={togglePopper}
          items={actions as menuItem[]}
          anchorEl={anchorRef.current}
        />
      )}
    </div>
  )
}

export default SideBlock

import React from 'react'
import {
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import Utils from 'utils'

import Tooltip from '../Tooltip'

import './menuPopper.scss'

export type menuItem = {
  hideMenu?: boolean
  key?: string
  text?: string
  disabled?: string
  tooltip?: string
  extraClass?: string
  onClick: () => void
  content?: any
}

interface MenuPopperProps {
  open: boolean
  onClickAway: () => void
  items: menuItem[]
  anchorEl: HTMLElement | null
  disablePortal?: boolean
  extraPopperClass?: string
}
function MenuPopper({
  open,
  anchorEl,
  onClickAway,
  items,
  disablePortal = false,
  extraPopperClass = EMPTY_STRING
}: MenuPopperProps) {
  const getTooltipData = (disabled = EMPTY_STRING, tooltip = EMPTY_STRING) => {
    if (Utils.isString(disabled) && !Utils.isEmpty(disabled)) {
      return disabled
    }
    if (!Utils.isEmpty(tooltip)) {
      return tooltip
    }
    return EMPTY_STRING
  }

  return (
    <Popper
      anchorEl={anchorEl}
      className='popper-wrapper'
      disablePortal={disablePortal}
      nonce={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
      open={open}
      transition
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'center top' }}
        >
          <Paper className={clsx('menu-popper', extraPopperClass)}>
            <ClickAwayListener onClickAway={onClickAway}>
              <MenuList disablePadding>
                {items.map((item) => {
                  if (item.hideMenu) {
                    return null
                  }
                  return (
                    <Tooltip
                      key={item.key || item.text}
                      data={getTooltipData(item.disabled, item.tooltip)}
                    >
                      <div
                        className={`menu-popper-item-wrapper dropdown-lines-1 ${item.extraClass}`}
                      >
                        <MenuItem
                          className='menu-popper-item'
                          disabled={!!item.disabled}
                          onClick={(e) => {
                            e.stopPropagation()
                            item.onClick()
                            onClickAway()
                          }}
                        >
                          {item.content || item.text}
                        </MenuItem>
                        <Divider className='separator' />
                      </div>
                    </Tooltip>
                  )
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

export default MenuPopper

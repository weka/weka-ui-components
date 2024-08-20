import React from 'react'
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Divider
} from '@mui/material'
import Tooltip from '../Tooltip'
import Utils from '../../utils'
import { EMPTY_STRING } from '../../consts'
import clsx from 'clsx'

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
function MenuPopper(props: MenuPopperProps) {
  const {
    open,
    anchorEl,
    onClickAway,
    items,
    disablePortal = false,
    extraPopperClass = EMPTY_STRING
  } = props

  const getTooltipData = (disabled = '', tooltip = '') => {
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
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal={disablePortal}
      className='popper-wrapper'
      nonce={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: 'center top' }}>
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
                          disabled={!!item.disabled}
                          className='menu-popper-item'
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

import React from 'react'
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Divider } from '@mui/material'
import Tooltip from '../Tooltip'
import Utils from '../../utils'
import { EMPTY_STRING } from '../../consts'

import './menuPopper.scss'

type  menuItem = {
  hideMenu?: boolean
  key?: string
  text?: string
  disabled?: string,
  tooltip?: string,
  extraClass?: string
  onClick: () => void
  content?: any
}

interface MenuPopperProps {
  open: boolean,
  onClickAway: () => void,
  items: menuItem[],
  anchorEl: HTMLElement,
  disablePortal?: boolean
}
function MenuPopper(props: MenuPopperProps) {
  const { open, anchorEl, onClickAway, items, disablePortal } = props

  const getTooltipData = (disabled: string = '', tooltip: string = '') => {
    if (Utils.isString(disabled)) {
      return disabled
    } if (!Utils.isEmpty(tooltip)) {
      return tooltip
    }
    return EMPTY_STRING
  }

  return (
    <Popper open={open} anchorEl={anchorEl} transition disablePortal={disablePortal} className='popper-wrapper'
            nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'center top' }}
        >
          <Paper className='menu-popper'>
            <ClickAwayListener onClickAway={onClickAway}>
              <MenuList disablePadding>
                {items.map((item) => {
                  if (item.hideMenu) {
                    return null
                  }
                  return (
                    <Tooltip key={item.key || item.text} data={getTooltipData(item.disabled, item.tooltip)}>
                      <div className={`menu-popper-item-wrapper dropdown-lines-1 ${item.extraClass}`}>
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

MenuPopper.defaultProps = { disablePortal: false }

MenuPopper.propTypes = {

}

export default MenuPopper

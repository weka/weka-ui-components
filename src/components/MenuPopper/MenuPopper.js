import React from 'react'
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Divider } from '@mui/material'
import propTypes from 'prop-types'
import { Tooltip } from 'weka-ui-components'
import Utils from '../../utils/utils'
import { EMPTY_STRING } from '../../utils/consts'

import './menuPopper.scss'

function MenuPopper(props) {
  const { open, anchorEl, onClickAway, items, disablePortal } = props

  const getTooltipData = (disabled, tooltip) => {
    if (Utils.isString(disabled)) {
      return disabled
    } if (!Utils.isEmpty(tooltip)) {
      return tooltip
    }
    return EMPTY_STRING
  }

  return (
    <Popper open={open} anchorEl={anchorEl} transition disablePortal={disablePortal} className='popper-wrapper'>
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
  open: propTypes.bool.isRequired,
  onClickAway: propTypes.func.isRequired,
  items: propTypes.array.isRequired,
  anchorEl: propTypes.object.isRequired,
  disablePortal: propTypes.bool
}

export default MenuPopper

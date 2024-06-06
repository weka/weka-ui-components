import React, { ReactElement, useRef } from 'react'
import Tooltip from '../../../Tooltip'
import Button from '../../../Button'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import { Filter } from '../../../../svgs'
import useKeyEvent from '../../../../hooks/useKeyEvent'
import useToggle from '../../../../hooks/useToggle'
import Utils from '../../../../utils'
import { EMPTY_STRING } from '../../../../consts'
import { ExtendedColumn } from '../../types'
import clsx from 'clsx'

import './filterWrapper.scss'
import { tableUtils } from '../../tableUtils'

interface FilterWrapperProps<Data, Value> {
  column: ExtendedColumn<Data, Value>
  value?: Value
  children: ReactElement
  hideWrapper?: boolean
  isPopperOpen?: boolean
  onTogglePopper?: () => void
  shouldDisableBtn?: (val: any) => boolean
  disabledBtnTooltip?: string
}

function FilterWrapper<Data, Value>({
  column,
  value,
  children,
  disabledBtnTooltip = EMPTY_STRING,
  hideWrapper = false,
  shouldDisableBtn,
  isPopperOpen: isPopperOpenOuter,
  onTogglePopper: onTogglePopperOuter
}: FilterWrapperProps<Data, Value>) {
  const columnTitle = tableUtils.getColumnTitle(column)

  const [isPopperOpenInner, togglePopperInner] = useToggle(false)
  const isPopperOpen = isPopperOpenOuter ?? isPopperOpenInner

  const togglePopper = () => {
    if (onTogglePopperOuter) {
      onTogglePopperOuter()
    } else {
      togglePopperInner()
    }
  }

  const anchor = useRef(null)
  const ref = useRef(null)
  useKeyEvent(ref, 'Enter', onClick)
  const isDisable =
    Utils.isEmpty(value) ||
    (Utils.isString(value) && value?.trim().length === 0) ||
    shouldDisableBtn?.(value)

  function onClick() {
    if (!isDisable) {
      column.setFilterValue(value)
      togglePopper()
    }
  }

  return (
    <div className='filter-table-wrapper'>
      <Tooltip
        data={`Filter by ${columnTitle
          .charAt(0)
          .toUpperCase()}${columnTitle.slice(1)}`}
      >
        <span
          onClick={togglePopper}
          ref={anchor}
          className='filter-table-wrapper-icon'
        >
          <Filter />
        </span>
      </Tooltip>

      {isPopperOpen && (
        <Popper
          open={isPopperOpen}
          anchorEl={anchor.current}
          transition
          className='popper-wrapper'
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'center top' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={togglePopper}>
                  {hideWrapper ? (
                    children
                  ) : (
                    <div className='filter-table-wrapper-data'>
                      <div
                        className={clsx('filter-table-wrapper-inside-filter')}
                        ref={ref}
                      >
                        {children}
                      </div>
                      <Tooltip
                        data={
                          value && shouldDisableBtn?.(value)
                            ? disabledBtnTooltip
                            : EMPTY_STRING
                        }
                      >
                        <div className='filter-table-wrapper-btn'>
                          <Button disable={isDisable} onClick={onClick}>
                            Filter
                          </Button>
                        </div>
                      </Tooltip>
                    </div>
                  )}
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </div>
  )
}

export default FilterWrapper

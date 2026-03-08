import type { ReactElement } from 'react'
import React, { useRef } from 'react'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING, EVENT_KEYS } from 'consts'
import { useKeyEvent, useToggle } from 'hooks'
import svgs from 'svgs'
import Utils from 'utils'

import Button from '../../../Button'
import Tooltip from '../../../Tooltip'
import { tableUtils } from '../../tableUtils'
import type { ExtendedColumn } from '../../types'

import './filterWrapper.scss'

const { Filter } = svgs

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
  useKeyEvent(ref, EVENT_KEYS.ENTER, onClick)
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
          ref={anchor}
          className='filter-table-wrapper-icon'
          onClick={togglePopper}
        >
          <Filter />
        </span>
      </Tooltip>
      {isPopperOpen ? (
        <Popper
          anchorEl={anchor.current}
          className='popper-wrapper'
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          open={isPopperOpen}
          transition
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
                        ref={ref}
                        className={clsx('filter-table-wrapper-inside-filter')}
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
                          <Button
                            disable={isDisable}
                            onClick={onClick}
                          >
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
      ) : null}
    </div>
  )
}

export default FilterWrapper

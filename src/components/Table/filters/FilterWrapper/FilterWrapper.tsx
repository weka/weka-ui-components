import React, { ReactElement, useRef } from 'react'
import Tooltip from '../../../Tooltip'
import Button from '../../../Button'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import { Filter } from '../../../../svgs'
import useKeyEvent from '../../../../hooks/useKeyEvent'
import useToggle from '../../../../hooks/useToggle'
import Utils from '../../../../utils'
import { EMPTY_STRING } from '../../../../consts'
import classNames from 'classnames'

import './filterWrapper.scss'

interface FilterWrapperProps {
  setFilter: (value: any) => void
  children: ReactElement
  value?: any
  columnTitle: string
  hideWrapper?: boolean
  isPopperOpen?: boolean
  onTogglePopper?: () => void
}

function FilterWrapper({
  setFilter,
  value,
  children,
  columnTitle = EMPTY_STRING,
  hideWrapper = false,
  isPopperOpen: isPopperOpenOuter,
  onTogglePopper: onTogglePopperOuter
}: FilterWrapperProps) {
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
    (Utils.isString(value) && value?.trim().length === 0)

  function onClick() {
    if (!isDisable) {
      setFilter(value)
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
          open={isPopperOpen as boolean}
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
                        className={classNames(
                          'filter-table-wrapper-inside-filter'
                        )}
                        ref={ref}
                      >
                        {children}
                      </div>

                      <div className='filter-table-wrapper-btn'>
                        <Button disable={isDisable} onClick={onClick}>
                          Filter
                        </Button>
                      </div>
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

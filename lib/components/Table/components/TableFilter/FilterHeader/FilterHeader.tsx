import React, { useRef } from 'react'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import { useToggle } from 'hooks'
import svgs from 'svgs'

import Tooltip from '../../../../Tooltip'

import './filterHeader.scss'

const { Filter: FilterIcon } = svgs

interface FilterHeaderProps {
  title?: string
  setFilter: (val: any) => void
  Filter: typeof React.Component
  dataForFilter?: { [key: string]: any }
  filterKey?: string
}

function FilterHeader({
  title,
  setFilter,
  Filter,
  dataForFilter,
  filterKey = EMPTY_STRING
}: FilterHeaderProps) {
  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchor = useRef(null)
  const classes = clsx({
    'filter-table-header': true,
    'no-title': !title
  })
  return (
    <div className={classes}>
      <span>{title}</span>
      <Tooltip data='Filter by'>
        <span
          ref={anchor}
          onClick={togglePopper}
        >
          <FilterIcon />
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
                  <div>
                    <Filter
                      setFilter={(filter: any) => {
                        if (filterKey) {
                          setFilter({ [filterKey]: filter })
                        } else {
                          setFilter(filter)
                        }
                        togglePopper()
                      }}
                      {...dataForFilter}
                    />
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      ) : null}
    </div>
  )
}

export default FilterHeader

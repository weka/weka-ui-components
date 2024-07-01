import React, { useRef } from 'react'
import clsx from 'clsx'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import Tooltip from '../../../../Tooltip'
import { Filter as FilterIcon } from '../../../../../svgs'
import useToggle from '../../../../../hooks/useToggle'
import { EMPTY_STRING } from '../../../../../consts'

import './filterHeader.scss'

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
        <span onClick={togglePopper} ref={anchor}>
          <FilterIcon />
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
      )}
    </div>
  )
}

export default FilterHeader

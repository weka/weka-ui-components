import React, { useRef } from 'react'
import classNames from 'classnames'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import Tooltip from '../../../Tooltip'
import { Filter as FilterIcon } from '../../../../svgs'
import useToggle from '../../../../hooks/useToggle'
import { EMPTY_STRING } from '../../../../consts'

import './filterHeader.scss'

interface FilterHeaderProps {
  title?: string
  filterKey?: string | null
  Filter: React.FC<
    Record<string, unknown> & { setFilter: (filter: any) => void }
  >
  dataForFilter?: Record<string, unknown>
  setFilter: (filter: any) => void
}

function FilterHeader({
  title = EMPTY_STRING,
  setFilter,
  Filter,
  dataForFilter,
  filterKey = null
}: FilterHeaderProps) {
  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchor = useRef(null)
  const classes = classNames({
    'filter-table-header': true,
    'no-title': !title
  })
  return (
    <div className={classes}>
      <span>{title}</span>
      <Tooltip data={title ? `Filter by ${title}` : 'Filter by Severity'}>
        <span onClick={togglePopper} ref={anchor}>
          <FilterIcon />
        </span>
      </Tooltip>
      {isPopperOpen && (
        <Popper
          open={isPopperOpen}
          anchorEl={anchor.current}
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          transition
          className='popper-wrapper'
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: () => {
                  if (title === 'Timestamp') {
                    return [20, 0]
                  }
                  if (filterKey === 'severity') {
                    return [35, 0]
                  }
                  return []
                }
              }
            }
          ]}
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
                      setFilter={(filter) => {
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

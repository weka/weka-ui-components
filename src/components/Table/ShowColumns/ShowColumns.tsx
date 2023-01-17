import React, { useState, useRef } from 'react'
import { ColumnInstance } from 'react-table'
import Tooltip from '../../Tooltip'
import { Checkbox } from '../../inputs'
import { ClickAwayListener, Grow, IconButton, Paper, Popper  } from '@mui/material'
import { Show } from '../../../svgs'

import './showColumns.scss'

interface ExtendedColumn extends ColumnInstance {[key: string]: any}

interface ShowColumnsProps {
  columns: Array<ExtendedColumn>
  colProperty: string
}

function ShowColumns({ columns, colProperty }: ShowColumnsProps) {
  const ref = useRef(null)

  const [isOpen, setOpen] = useState(false)

  const countCheckedColumns = columns.filter((column) => column.getToggleHiddenProps().checked).length

  return (
    <span className='show-columns-wrapper' ref={ref}>
      <Tooltip data='Show/Hide columns'>
        <IconButton onClick={() => setOpen((state) => !state)}>
          <Show />
        </IconButton>
      </Tooltip>
      <Popper open={isOpen} anchorEl={ref.current} transition disablePortal className='popper-wrapper' nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'center top' }}
          >
            <Paper className='menu-popper'>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div className='show-columns'>
                  {columns.map((column) => {
                    const columnHideProps = column.getToggleHiddenProps()
                    return (
                      <div key={column.id}>
                        <div className='show-columns-line'>
                          <Checkbox {...columnHideProps} disabled={columnHideProps.checked && countCheckedColumns <= 2} />
                          <span className='capitalize-first-letter'>
                            {(column as ExtendedColumn)[colProperty]}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </span>
  )
}

export default ShowColumns

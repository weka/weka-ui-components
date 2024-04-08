import React, { useState, useRef } from 'react'
import Tooltip from '../../../../Tooltip'
import { Checkbox } from '../../../../inputs'
import {
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper
} from '@mui/material'
import { Show } from '../../../../../svgs'
import { ExtendedTable, TData } from '../../../types'
import { tableUtils } from '../../../tableUtils'

import './showColumns.scss'

interface ShowColumnsProps<Data> {
  table: ExtendedTable<Data>
}

function ShowColumns<Data>(props: ShowColumnsProps<Data>) {
  const { table } = props

  const ref = useRef(null)
  const [isOpen, setOpen] = useState(false)

  const allColumns = table.getAllColumns()

  const accessorColumns = allColumns.filter(tableUtils.isAccessorColumn)
  const visibleColumns = accessorColumns.filter((column) =>
    column.getIsVisible()
  ).length

  return (
    <span className='show-columns-wrapper' ref={ref}>
      <Tooltip data='Show/Hide columns'>
        <IconButton onClick={() => setOpen((state) => !state)}>
          <Show />
        </IconButton>
      </Tooltip>
      <Popper
        open={isOpen}
        anchorEl={ref.current}
        transition
        disablePortal
        className='popper-wrapper'
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center top' }}>
            <Paper className='menu-popper'>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div className='show-columns'>
                  {allColumns.map(
                    (column) =>
                      tableUtils.isAccessorColumn(column) && (
                        <div key={column.id}>
                          <div className='show-columns-line'>
                            <Checkbox
                              checked={column.getIsVisible()}
                              onChange={column.getToggleVisibilityHandler()}
                              disabled={
                                column.getIsVisible() && visibleColumns <= 2
                              }
                            />
                            <span className='capitalize-first-letter'>
                              {tableUtils.getColumnTitle(column)}
                            </span>
                          </div>
                        </div>
                      )
                  )}
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

import React, { useRef, useState } from 'react'
import {
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper
} from '@mui/material'

import svgs from 'svgs'

import { Checkbox } from '../../../../inputs'
import Tooltip from '../../../../Tooltip'
import { tableUtils } from '../../../tableUtils'
import type { ExtendedTable } from '../../../types'

import './showColumns.scss'

const { View: Show } = svgs

interface ShowColumnsProps<Data> {
  table: ExtendedTable<Data>
}

function ShowColumns<Data>({ table }: ShowColumnsProps<Data>) {
  const ref = useRef(null)
  const [isOpen, setOpen] = useState(false)

  const allColumns = table.getAllColumns()

  const accessorColumns = allColumns.filter(tableUtils.isAccessorColumn)
  const visibleColumns = accessorColumns.filter((column) =>
    column.getIsVisible()
  ).length

  return (
    <span
      ref={ref}
      className='show-columns-wrapper'
    >
      <Tooltip data='Show/Hide columns'>
        <IconButton onClick={() => setOpen((state) => !state)}>
          <Show />
        </IconButton>
      </Tooltip>
      <Popper
        anchorEl={ref.current}
        className='popper-wrapper'
        disablePortal
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        open={isOpen}
        transition
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'center top' }}
          >
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

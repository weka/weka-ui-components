import React, { useState, useRef } from 'react'
import { ColumnInstance } from 'react-table'
import Tooltip from '../../Tooltip'
import { Checkbox } from '../../inputs'
import {
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper
} from '@mui/material'
import { Show } from '../../../svgs'

import './showColumns.scss'
import { Table } from '@tanstack/react-table'

interface ExtendedColumn extends ColumnInstance {
  [key: string]: any
}

interface ShowColumnsProps<Values extends Record<string, unknown>> {
  tableInstance: Table<Values>
  colProperty: string
}

function ShowColumns<Values extends Record<string, unknown>>(
  props: ShowColumnsProps<Values>
) {
  const { tableInstance, colProperty } = props
  const ref = useRef(null)

  const [isOpen, setOpen] = useState(false)

  const columns = tableInstance.getAllColumns()
  const visibleColumnsLength = tableInstance.getVisibleFlatColumns().length

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
                  {columns.map((column) => (
                    <div key={column.id}>
                      <div className='show-columns-line'>
                        <Checkbox
                          checked={column.getIsVisible()}
                          onClick={() => column.toggleVisibility()}
                          disabled={
                            column.getIsVisible() && visibleColumnsLength <= 2
                          }
                        />
                        <span className='capitalize-first-letter'>
                          {column.id}
                        </span>
                      </div>
                    </div>
                  ))}
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

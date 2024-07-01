import React, { useRef } from 'react'
import { IconButton } from '@mui/material'
import MenuPopper from '../../../MenuPopper'
import { MenuDots } from '../../../../svgs'
import useToggle from '../../../../hooks/useToggle'
import { menuItem } from '../../../MenuPopper/MenuPopper'
import { ExtendedRow, RowAction } from '../../types'

import './actionsCell.scss'

interface ActionsCellProps<Data> {
  actions: RowAction<Data>[]
  row: ExtendedRow<Data>
  disablePortal?: boolean
}

function ActionsCell<Data>(props: ActionsCellProps<Data>) {
  const { actions, row, disablePortal = false } = props

  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const formatActions = actions
    .filter(({ hideAction }) => {
      if (hideAction instanceof Function) {
        return !hideAction?.(row.original)
      }
      return !hideAction
    })
    .map(({ action, content, disabled, ...rest }) => ({
      ...rest,
      content: content instanceof Function ? content(row.original) : content,
      disabled:
        disabled instanceof Function ? disabled(row.original) : disabled,
      ...(action && {
        onClick: () => {
          action(row.original)
        }
      })
    }))

  function getPopper() {
    return (
      <MenuPopper
        disablePortal={disablePortal}
        anchorEl={anchorRef.current}
        open={isPopperOpen as boolean}
        onClickAway={togglePopper}
        items={formatActions as menuItem[]}
      />
    )
  }

  return formatActions.length ? (
    <div className='table-row-actions' ref={anchorRef}>
      <IconButton className='actions-btn' onClick={togglePopper}>
        <MenuDots />
      </IconButton>
      {isPopperOpen && getPopper()}
    </div>
  ) : (
    <div className='table-row-actions-empty' />
  )
}

export default ActionsCell

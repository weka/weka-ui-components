import React, { useRef } from 'react'
import { IconButton } from '@mui/material'

import { useToggle } from 'hooks'
import svgs from 'svgs'

import MenuPopper from '../../../MenuPopper'
import type { menuItem } from '../../../MenuPopper/MenuPopper'
import type { ExtendedRow, RowAction } from '../../types'

import './actionsCell.scss'

const { MenuDots } = svgs

interface ActionsCellProps<Data> {
  actions: RowAction<Data>[]
  row: ExtendedRow<Data>
  disablePortal?: boolean
}

function ActionsCell<Data>({
  actions,
  row,
  disablePortal = false
}: ActionsCellProps<Data>) {
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
        anchorEl={anchorRef.current}
        disablePortal={disablePortal}
        items={formatActions as menuItem[]}
        onClickAway={togglePopper}
        open={isPopperOpen}
      />
    )
  }

  return formatActions.length ? (
    <div
      ref={anchorRef}
      className='table-row-actions'
    >
      <IconButton
        className='actions-btn'
        onClick={togglePopper}
      >
        <MenuDots />
      </IconButton>
      {isPopperOpen ? getPopper() : null}
    </div>
  ) : (
    <div className='table-row-actions-empty' />
  )
}

export default ActionsCell

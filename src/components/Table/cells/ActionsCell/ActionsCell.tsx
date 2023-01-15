import React, { useRef, forwardRef } from 'react'
import {IconButton, IconButtonProps} from '@mui/material'
import MenuPopper from '../../../MenuPopper'
import { MenuDots } from '../../../../svgs'
import useToggle from '../../../../hooks/useToggle'
import { ExtendedRow, RowAction } from '../../Table'
import { menuItem } from '../../../MenuPopper/MenuPopper'

import './actionsCell.scss'

interface ActionsCellProps {
  actions: Array<RowAction>
  row: ExtendedRow<object>
  disablePortal?: boolean
}

type CastedForwardRefButtonType = <C extends React.ElementType>(
  props: IconButtonProps<C, { component?: C }>,
  ref?: React.Ref<HTMLButtonElement>
) => React.ReactElement | null

function ActionsCell({ actions, row, disablePortal }: ActionsCellProps) {
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
      disabled: disabled instanceof Function ? disabled(row.original) : disabled,
      ...(action && {
        onClick: () => {
          action({ ...row.original, ...row.state })
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

  const CastedForwardRefButtonFnc: CastedForwardRefButtonType = (props, ref) => {
    const {children, ...rest} = props
    return (
      <IconButton ref={ref} {...rest}>
        {children}
      </IconButton>
    )
  }

  const CastedForwardRefButton = forwardRef(
    CastedForwardRefButtonFnc
  ) as CastedForwardRefButtonType

  return formatActions.length ? (
    <div className='table-row-actions' ref={anchorRef}>
      <CastedForwardRefButton
        className='actions-btn'
        onClick={togglePopper}
      >
        <MenuDots />
      </CastedForwardRefButton>
      {isPopperOpen && getPopper()}
    </div>
  )
    : <div className='table-row-actions-empty' />
}

export default ActionsCell

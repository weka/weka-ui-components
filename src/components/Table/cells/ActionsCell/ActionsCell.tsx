import React, { useRef } from 'react'
import { IconButton } from '@mui/material'
import propTypes from 'prop-types'
import { MenuPopper } from '@weka.io/weka-ui-components'
import SVGS from '../../../../static/svgs'
import useToggle from '../../../../hooks/useToggle'

import './actionsCell.scss'

function ActionsCell({ actions, row, disablePortal }) {
  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchorRef = useRef(null)
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
        open={isPopperOpen}
        onClickAway={togglePopper}
        items={formatActions}
      />
    )
  }
  return formatActions.length ? (
    <div className='table-row-actions'>
      <IconButton
        className='actions-btn'
        ref={anchorRef}
        onClick={togglePopper}
      >
        <SVGS.MenuDots />
      </IconButton>
      {isPopperOpen && getPopper()}
    </div>
  )
    : <div className='table-row-actions-empty' />
}

ActionsCell.defaultProps = { disablePortal: false }

ActionsCell.propTypes = {
  actions: propTypes.array.isRequired,
  row: propTypes.object.isRequired,
  disablePortal: propTypes.bool
}

export default ActionsCell

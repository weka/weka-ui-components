import { IconButton } from '@mui/material'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { ThinArrow } from '../../../../svgs'
import Tooltip from '../../../Tooltip'

import './expandCollapseButton.scss'
import { useTextEditorContext } from '../../context'

function ExpandCollapseButton() {
  const {
    value: { mode, shouldFoldAll, tags },
    setTextEditorContext
  } = useTextEditorContext('ExpandCollapseBtn')

  const disabled = useMemo(
    () => (tags && tags.length > 0) || mode !== 'json',
    [mode, tags]
  )

  return (
    <Tooltip
      data={disabled ? '' : !shouldFoldAll ? 'Collapse All' : 'Expand All'}
    >
      <div>
        <IconButton
          disabled={disabled}
          className={clsx({
            ['text-editor-expand-collapse-btn']: true,
            ['rotate']: !shouldFoldAll
          })}
          onClick={() =>
            setTextEditorContext((prev) => ({
              ...prev,
              shouldFoldAll: !shouldFoldAll
            }))
          }
        >
          <ThinArrow />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default ExpandCollapseButton

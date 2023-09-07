import React from 'react'

import { useTextEditorContext } from '../../context'
import ExpandCollapseButton from '../../../ExpandCollapseButton'
import Tooltip from '../../../Tooltip/Tooltip'
import { EMPTY_STRING } from '../../../../consts'

function FoldAllButton() {
  const {
    value: { mode, shouldFoldAll, tags },
    setTextEditorContext
  } = useTextEditorContext('ExpandCollapseBtn')

  const hidden = mode !== 'json'

  let disabled: string | boolean = false

  if (tags && tags.length > 0) {
    // TODO: review text
    disabled = 'Code folding is not supported when tags are present'
  }
  return (
    <>
      {!hidden && (
        <Tooltip data={disabled || EMPTY_STRING}>
          <ExpandCollapseButton
            disabled={!!disabled}
            shouldCollapse={!!shouldFoldAll}
            onChange={(newVal) =>
              setTextEditorContext((prev) => ({
                ...prev,
                shouldFoldAll: newVal
              }))
            }
          />
        </Tooltip>
      )}
    </>
  )
}

export default FoldAllButton

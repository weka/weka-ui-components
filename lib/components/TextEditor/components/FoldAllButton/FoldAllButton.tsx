import React from 'react'

import { EMPTY_STRING } from 'consts'

import ExpandCollapseButton from '../../../ExpandCollapseButton'
import { useTextEditorContext } from '../../context'

function FoldAllButton() {
  const {
    value: { mode, foldAll, tags, isLiteMode },
    setTextEditorContext
  } = useTextEditorContext('ExpandCollapseBtn')

  const hidden = mode === 'text'

  let disabled: string | boolean = false

  if (isLiteMode) {
    disabled = 'Code folding is not supported for large files'
  } else if (tags && tags.length > 0) {
    disabled = 'Code folding is not supported when tags are present'
  }
  return (
    <>
      {!hidden && (
        <ExpandCollapseButton
          disabled={!!disabled}
          shouldCollapse={!!foldAll}
          tooltip={disabled || EMPTY_STRING}
          onChange={(newVal) =>
            setTextEditorContext((prev) => ({
              ...prev,
              foldAll: newVal
            }))
          }
        />
      )}
    </>
  )
}

export default FoldAllButton

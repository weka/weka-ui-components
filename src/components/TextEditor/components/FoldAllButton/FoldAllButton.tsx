import React, { useMemo } from 'react'

import { useTextEditorContext } from '../../context'
import ExpandCollapseButton from '../../../ExpandCollapseButton'

function FoldAllButton() {
  const {
    value: { mode, shouldFoldAll, tags },
    setTextEditorContext
  } = useTextEditorContext('ExpandCollapseBtn')

  const disabled = useMemo(
    () => (tags && tags.length > 0) || mode !== 'json',
    [mode, tags]
  )

  return (
    <ExpandCollapseButton
      disabled={disabled}
      shouldCollapse={!!shouldFoldAll}
      onChange={(newVal) =>
        setTextEditorContext((prev) => ({
          ...prev,
          shouldFoldAll: newVal
        }))
      }
    />
  )
}

export default FoldAllButton

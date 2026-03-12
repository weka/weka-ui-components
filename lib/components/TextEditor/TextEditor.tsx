import React, { useEffect } from 'react'

import { useHideContent } from './components/TextEditorFull/hooks'
import type { ParsedData } from './components'
import {
  FoldAllButton,
  FontSizeControls,
  HideContentInput,
  LinesCount,
  SearchButton,
  TagsInput,
  TextEditorFull,
  TextViewerLite
} from './components'
import { DEFAULT_FONT_SIZE } from './consts'
import { TextEditorProvider, useTextEditorContext } from './context'
import { useLinesCount, useTags } from './hooks'

interface TextEditorProps {
  onChange?: () => void
  readOnly?: boolean
  value?: string
  onValidate?: () => void
  extraClass?: string
  allowSearch?: boolean
  allowCopy?: boolean
  /**
   * Determines whether to fold all lines or not. If `true`, all lines will be folded.
   * If a number, it represents the depth of folding. If `false`, all lines will be unfolded.
   */
  foldAll?: boolean | number
  valueForMatched?: ParsedData
  isValueForMatchedLoading?: boolean
  mode?: 'text' | 'json'
  initialLine?: number
  onScroll?: (line: number) => void
  maxLines?: number
  loading?: boolean
  liteMode?: boolean
}

function TextEditor(props: TextEditorProps) {
  const { value, maxLines, liteMode, loading } = props
  const context = useTextEditorContext(true)
  const setTextEditorContext = context?.setTextEditorContext
  const fontSize = context?.value.fontSize ?? DEFAULT_FONT_SIZE

  const filteredValue = useHideContent({ value })

  const lines = useTags({ value: filteredValue })

  useEffect(() => {
    setTextEditorContext?.((prev) => ({
      ...prev,
      loading
    }))
  }, [loading, setTextEditorContext])

  useLinesCount({
    value,
    lines,
    filteredValue
  })

  return liteMode ? (
    <TextViewerLite
      key={fontSize}
      fontSize={fontSize}
      lines={lines}
      maxLines={maxLines}
      value={filteredValue}
    />
  ) : (
    <TextEditorFull
      {...props}
      fontSize={fontSize}
      lines={lines}
      value={filteredValue}
    />
  )
}

TextEditor.Provider = TextEditorProvider
TextEditor.TagsInput = TagsInput
TextEditor.FoldAllButton = FoldAllButton
TextEditor.FontSizeControls = FontSizeControls
TextEditor.LinesCount = LinesCount
TextEditor.SearchButton = SearchButton
TextEditor.HideContentInput = HideContentInput

export default TextEditor

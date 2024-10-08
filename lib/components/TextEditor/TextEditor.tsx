import {
  FoldAllButton,
  TagsInput,
  FontSizeControls,
  LinesCount,
  TextEditorFull,
  TextViewerLite,
  SearchButton,
  ParsedData,
  HideContentInput
} from './components'
import { TextEditorProvider, useTextEditorContext } from './context'

import React, { useEffect } from 'react'
import { useLinesCount, useTags } from './hooks'
import { useHideContent } from './components/TextEditorFull/hooks'

export const DEFAULT_FONT_SIZE = 16

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
      value={filteredValue}
      fontSize={fontSize}
      maxLines={maxLines}
      lines={lines}
    />
  ) : (
    <TextEditorFull
      {...props}
      lines={lines}
      fontSize={fontSize}
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

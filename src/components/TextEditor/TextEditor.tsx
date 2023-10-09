import {
  FoldAllButton,
  TagsInput,
  FontSizeControls,
  LinesCount,
  TextEditorFull,
  TextViewerLite,
  SearchButton,
  ParsedData
} from './components'
import { TextEditorProvider, useTextEditorContext } from './context'

import React, { useEffect } from 'react'
import { useTags } from './hooks'

const maximumCharacters = 10 ** 7
export const DEFAULT_FONT_SIZE = 16

interface TextEditorProps {
  onChange?: () => void
  readOnly?: boolean
  value?: string
  onValidate?: () => void
  extraClass?: string
  allowSearch?: boolean
  allowCopy?: boolean
  shouldFoldAll?: boolean
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
  const { value, maxLines, liteMode: outerLiteMode, loading } = props
  const context = useTextEditorContext(true)
  const setTextEditorContext = context?.setTextEditorContext
  const fontSize = context?.value?.fontSize ?? DEFAULT_FONT_SIZE

  const lines = useTags({ value })

  const isLiteMode =
    outerLiteMode ?? !!(value && value.length > maximumCharacters)

  useEffect(() => {
    setTextEditorContext?.((prev) => ({
      ...prev,
      isLiteMode
    }))
  }, [setTextEditorContext, isLiteMode])

  useEffect(() => {
    setTextEditorContext?.((prev) => ({
      ...prev,
      loading
    }))
  }, [loading, setTextEditorContext])

  return isLiteMode ? (
    <TextViewerLite
      key={fontSize}
      value={value}
      fontSize={fontSize}
      maxLines={maxLines}
      lines={lines}
    />
  ) : (
    <TextEditorFull {...props} lines={lines} />
  )
}

TextEditor.Provider = TextEditorProvider
TextEditor.TagsInput = TagsInput
TextEditor.FoldAllButton = FoldAllButton
TextEditor.FontSizeControls = FontSizeControls
TextEditor.LinesCount = LinesCount
TextEditor.SearchButton = SearchButton

export default TextEditor

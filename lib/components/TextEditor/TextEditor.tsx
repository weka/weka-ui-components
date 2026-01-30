import React, { forwardRef, useEffect } from 'react'

import { useHideContent } from './components/TextEditorFull/hooks'
import type { ExternalSearchAction, ParsedData, TextEditorHandle } from './components'
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
  /**
   * External search term that triggers Ace's find-all functionality
   * to highlight matches in the editor
   */
  externalSearchTerm?: string
  /**
   * Whether the external search term should be treated as regex
   */
  externalSearchIsRegex?: boolean
  /**
   * Whether the external search should be case-sensitive
   */
  externalSearchCaseSensitive?: boolean
  /**
   * Whether the external search should match whole words only
   */
  externalSearchWholeWord?: boolean
  /**
   * Action to perform in Ace's native search (next/prev/first/last)
   */
  externalSearchAction?: ExternalSearchAction
  /**
   * Called when Ace's find reaches the boundary (no more matches in direction)
   */
  onSearchBoundary?: (direction: 'next' | 'prev') => void
  /**
   * Called with the current local match position and chunk total after each find action
   */
  onSearchCounterUpdate?: (current: number, chunkTotal: number) => void
  /**
   * When true, disables tag-based line filtering and custom gutter renderer
   * so the consumer can manage line numbering independently (e.g. chunked files)
   */
  disableTagsFilter?: boolean
}

const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(function TextEditor(props, ref) {
  const { value, maxLines, liteMode, loading, disableTagsFilter } = props
  const context = useTextEditorContext(true)
  const setTextEditorContext = context?.setTextEditorContext
  const fontSize = context?.value.fontSize ?? DEFAULT_FONT_SIZE

  const filteredValue = useHideContent({ value })

  const tagLines = useTags({ value: filteredValue })
  const lines = disableTagsFilter ? undefined : tagLines

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
      ref={ref}
      {...props}
      fontSize={fontSize}
      lines={lines}
      value={filteredValue}
    />
  )
})

const TextEditorWithStatics = TextEditor as typeof TextEditor & {
  Provider: typeof TextEditorProvider
  TagsInput: typeof TagsInput
  FoldAllButton: typeof FoldAllButton
  FontSizeControls: typeof FontSizeControls
  LinesCount: typeof LinesCount
  SearchButton: typeof SearchButton
  HideContentInput: typeof HideContentInput
}

TextEditorWithStatics.Provider = TextEditorProvider
TextEditorWithStatics.TagsInput = TagsInput
TextEditorWithStatics.FoldAllButton = FoldAllButton
TextEditorWithStatics.FontSizeControls = FontSizeControls
TextEditorWithStatics.LinesCount = LinesCount
TextEditorWithStatics.SearchButton = SearchButton
TextEditorWithStatics.HideContentInput = HideContentInput

export default TextEditorWithStatics

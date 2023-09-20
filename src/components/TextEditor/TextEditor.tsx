import {
  FoldAllButton,
  TagsInput,
  FontSizeControls,
  LinesCount,
  TextEditorProps,
  TextEditorFull,
  TextViewerLight
} from './components'
import { TextEditorProvider, useTextEditorContext } from './context'

import React from 'react'

const maximumCharacters = 10 ** 7
export const DEFAULT_FONT_SIZE = 16

function TextEditor(props: TextEditorProps) {
  const { value, maxLines } = props
  const context = useTextEditorContext(true)
  const fontSize = context?.value?.fontSize ?? DEFAULT_FONT_SIZE

  return value && value.length > maximumCharacters ? (
    <TextViewerLight
      key={fontSize}
      value={value}
      fontSize={fontSize}
      maxLines={maxLines}
    />
  ) : (
    <TextEditorFull {...props} />
  )
}

TextEditor.Provider = TextEditorProvider
TextEditor.TagsInput = TagsInput
TextEditor.FoldAllButton = FoldAllButton
TextEditor.FontSizeControls = FontSizeControls
TextEditor.LinesCount = LinesCount

export default TextEditor

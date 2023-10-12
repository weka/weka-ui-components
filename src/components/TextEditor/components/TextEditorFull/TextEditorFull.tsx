import React, { memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { EMPTY_STRING } from '../../../../consts'
import Copy from '../../../Copy'
import { useToggle } from '../../../../hooks'
import { Checkbox } from '../../../inputs'
import { CircularProgress } from '@mui/material'
import {
  useFoldAll,
  useLinePosition,
  useLinesCount,
  useOnlyMatching,
  useSearch,
  useTags as useForcedLineNumbers,
  useEditor,
  ParsedData
} from './hooks'
import clsx from 'clsx'

import { useTextEditorContext } from '../../context'
import Loader from '../../../Loader'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/ext-searchbox'

import './textEditorFull.scss'

export interface TextEditorFullProps {
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
  lines?: {
    number: string
    text: string
  }[]
  fontSize?: number
}
function TextEditorFull(props: TextEditorFullProps) {
  const {
    readOnly,
    value = EMPTY_STRING,
    onChange,
    onValidate,
    allowSearch = false,
    allowCopy = false,
    shouldFoldAll = false,
    extraClass = EMPTY_STRING,
    valueForMatched,
    isValueForMatchedLoading = false,
    mode = 'json',
    initialLine,
    onScroll,
    maxLines,
    loading,
    lines,
    fontSize,
    ...rest
  } = props

  const editorContext = useTextEditorContext(true)
  const editorContextValue = editorContext?.value
  const setTextEditorContext = editorContext?.setTextEditorContext

  useEffect(() => {
    setTextEditorContext?.((prev) => ({ ...prev, mode }))
  }, [setTextEditorContext, mode])

  const id = useId()
  const editorRef = useRef<AceEditor>(null)
  const editor = editorRef.current?.editor

  const [onlyMatching, toggleOnlyMatching] = useToggle(false)
  const [editorReady, setEditorReady] = useState(false)

  const handleLoad = () => {
    setEditorReady(true)
  }

  const options = useMemo(
    () => ({
      mode,
      disableFolding: false,
      shouldFoldAll: editorContextValue?.shouldFoldAll ?? shouldFoldAll,
      allowSearch: editorContextValue?.allowSearch ?? allowSearch,
      value: lines?.map((line) => line.text).join('\n') ?? value
    }),
    [
      allowSearch,
      editorContextValue?.allowSearch,
      editorContextValue?.shouldFoldAll,
      lines,
      mode,
      shouldFoldAll,
      value
    ]
  )

  const searchValue = useSearch({
    editor,
    allowSearch: options.allowSearch,
    editorReady,
    value: options.value
  })

  const jsonValue = useOnlyMatching({
    allowSearch: options.allowSearch,
    onlyMatching,
    searchValue,
    value,
    valueForMatched
  })

  useFoldAll({
    editor,
    shouldFoldAll: options.shouldFoldAll,
    value: options.value
  })

  useLinePosition({
    initialLine,
    onScroll,
    editor
  })

  useForcedLineNumbers({
    editor,
    value: options.value,
    lines
  })

  useLinesCount({
    value: options.value,
    lines
  })

  useEditor({
    editor,
    maxLines,
    onlyMatching,
    value: options.value
  })

  const classes = clsx({
    'text-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !options.allowSearch,
    'text-editor-wrapper-with-copy': allowCopy,
    'text-editor-wrapper-only-matching-lines': onlyMatching,
    'disable-folding': !!(lines && lines.length > 0),
    [extraClass]: true
  })

  console.log('value={onlyMatching ? jsonValue : options.value}', fontSize)

  return loading ? (
    <Loader />
  ) : (
    <div className={classes}>
      {allowCopy && <Copy text={jsonValue} extraClass='copy-btn' />}
      {(valueForMatched || isValueForMatchedLoading) && options.allowSearch && (
        <div className='matching-toggle'>
          <span>Show only matching lines</span>
          {isValueForMatchedLoading ? (
            <CircularProgress size={16} />
          ) : (
            <Checkbox checked={onlyMatching} onChange={toggleOnlyMatching} />
          )}
        </div>
      )}
      <AceEditor
        ref={editorRef}
        mode={mode}
        height='100%'
        fontSize={fontSize}
        width='99%'
        showPrintMargin={false}
        highlightActiveLine={false}
        name={id}
        editorProps={{ $blockScrolling: true }}
        readOnly={readOnly}
        value={onlyMatching ? jsonValue : options.value}
        onChange={onChange}
        onValidate={onValidate}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  )
}

export default memo(TextEditorFull)

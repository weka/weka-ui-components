import React, { memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { EMPTY_STRING } from '../../../../consts'
import Copy from '../../../Copy'
import { useToggle } from '../../../../hooks'
import { Checkbox } from '../../../inputs'
import { CircularProgress } from '@mui/material'
import {
  useFoldAll,
  useFontSize,
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

  const searchValue = useSearch({
    editor,
    allowSearch,
    editorReady,
    value
  })

  const jsonValue = useOnlyMatching({
    allowSearch,
    onlyMatching,
    searchValue,
    value,
    valueForMatched
  })

  const options = useMemo(
    () => ({
      value: onlyMatching ? jsonValue : value,
      mode,
      disableFolding: false,
      shouldFoldAll: editorContextValue?.shouldFoldAll ?? shouldFoldAll,
      ...(lines && {
        value: lines.map((line) => line.text).join('\n')
      })
    }),
    [
      editorContextValue?.shouldFoldAll,
      jsonValue,
      lines,
      mode,
      onlyMatching,
      shouldFoldAll,
      value
    ]
  )

  useFoldAll({
    editor,
    shouldFoldAll: options.shouldFoldAll
  })

  useLinePosition({
    initialLine,
    onScroll,
    editor
  })

  useForcedLineNumbers({
    editor,
    value,
    lines
  })

  useFontSize({ editor })

  useLinesCount({
    value,
    lines
  })

  useEditor({
    editor,
    maxLines,
    onlyMatching,
    value
  })

  const classes = clsx({
    'text-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !allowSearch,
    'text-editor-wrapper-with-copy': allowCopy,
    'text-editor-wrapper-only-matching-lines': onlyMatching,
    'disable-folding': !!(lines && lines.length > 0),
    [extraClass]: true
  })

  return loading ? (
    <Loader />
  ) : (
    <div className={classes}>
      {allowCopy && <Copy text={jsonValue} extraClass='copy-btn' />}
      {(valueForMatched || isValueForMatchedLoading) && allowSearch && (
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
        fontSize={16}
        width='99%'
        showPrintMargin={false}
        highlightActiveLine={false}
        name={id}
        editorProps={{ $blockScrolling: true }}
        readOnly={readOnly}
        value={options.value}
        onChange={onChange}
        onValidate={onValidate}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  )
}

export default memo(TextEditorFull)

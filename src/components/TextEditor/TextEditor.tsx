import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import clsx from 'clsx'
import { EMPTY_STRING } from '../../consts'
import Copy from '../Copy'
import { useToggle } from '../../hooks'
import { Checkbox } from '../inputs'
import { CircularProgress } from '@mui/material'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/ext-searchbox'

import './textEditor.scss'
import { useLinePosition } from './hooks'

interface ParsedData {
  [key: string]: any
}
interface JsonEditorProps {
  onChange?: () => void
  readOnly?: boolean
  value: string
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
  [key: string]: any
}
function TextEditor(props: JsonEditorProps) {
  const {
    readOnly,
    value,
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
    ...rest
  } = props
  const id = useId()
  const editorRef = useRef<AceEditor>(null)

  const [onlyMatching, toggleOnlyMatching] = useToggle(false)
  const [editorReady, setEditorReady] = useState(false)
  const [searchValue, setSearchValue] = useState(EMPTY_STRING)
  const [jsonValue, setJsonValue] = useState(value)

  const classes = clsx({
    'json-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !allowSearch,
    'json-editor-wrapper-with-copy': allowCopy,
    'json-editor-wrapper-only-matching-lines': onlyMatching,
    [extraClass]: true
  })

  const handleLoad = () => {
    setEditorReady(true)
  }

  const getFilteredValue = useCallback(() => {
    const searchTerm = searchValue.toLowerCase()
    const filtered = Object.entries(valueForMatched).reduce<
      Record<string, string | number | boolean>
    >((acc, [key, value]) => {
      if (
        key.toLowerCase().includes(searchTerm) ||
        `${value}`.toLowerCase().includes(searchTerm)
      ) {
        acc[key] = value
      }

      return acc
    }, {})
    return JSON.stringify(filtered, null, 2)
  }, [valueForMatched, searchValue])

  useEffect(() => {
    if (allowSearch && editorReady) {
      const onSearchChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        setSearchValue(target.value)
      }
      const searchInput = document.querySelector('.ace_search_field')
      searchInput?.addEventListener('input', onSearchChange)

      return () => {
        searchInput?.removeEventListener('input', onSearchChange)
      }
    }
  }, [allowSearch, editorReady])

  useEffect(() => {
    if (allowSearch) {
      if (onlyMatching && valueForMatched) {
        setJsonValue(getFilteredValue())
      } else {
        setJsonValue(value)
      }
    }
  }, [onlyMatching, searchValue, allowSearch, getFilteredValue, value])

  useEffect(() => {
    if (!value) {
      return
    }

    const editor = editorRef.current?.editor
    editor.scrollToLine(0)
    editor.selection.clearSelection()
  }, [onlyMatching, value])

  useEffect(() => {
    const editor = editorRef.current?.editor
    if (allowSearch) {
      editor.execCommand('find')
    }
  }, [allowSearch])

  useEffect(() => {
    const editor = editorRef.current?.editor
    if (shouldFoldAll) {
      editor.getSession().foldAll(1, editor.getSession().getLength())
    } else {
      editor.execCommand('unfoldall')
      editor.scrollToLine(0)
    }
  }, [shouldFoldAll])

  useLinePosition({
    initialLine,
    onScroll,
    editor: editorRef.current?.editor
  })

  return (
    <div className={classes}>
      {allowCopy && <Copy text={jsonValue} extraClass='copy-btn' />}
      {valueForMatched && allowSearch && (
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
        value={onlyMatching ? jsonValue : value}
        onChange={onChange}
        onValidate={onValidate}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  )
}

export default TextEditor

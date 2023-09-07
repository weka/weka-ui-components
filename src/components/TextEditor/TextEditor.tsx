import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import AceEditor from 'react-ace'
import { EMPTY_STRING } from '../../consts'
import Copy from '../Copy'
import { useToggle } from '../../hooks'
import { Checkbox } from '../inputs'
import { CircularProgress } from '@mui/material'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/ext-searchbox'

import './textEditor.scss'
import { useFontSize, useLinePosition, useTags } from './hooks'
import clsx from 'clsx'
import { FoldAllButton, TagsInput, FontSizeControls } from './components'
import { TextEditorProvider, useTextEditorContext } from './context'

interface ParsedData {
  [key: string]: any
}
export interface TextEditorProps {
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
  minLines?: number
  maxLines?: number
}
function TextEditor(props: TextEditorProps) {
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
    minLines,
    maxLines,
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
  const [searchValue, setSearchValue] = useState(EMPTY_STRING)
  const [jsonValue, setJsonValue] = useState(value)

  const handleLoad = () => {
    setEditorReady(true)
  }

  const [forcedOptions, setForcedOptions] = useState<{
    mode?: string
    value?: string
    disableFolding?: boolean
  }>({})

  const options = useMemo(
    () => ({
      value: onlyMatching ? jsonValue : value,
      mode,
      disableFolding: false,
      shouldFoldAll: editorContextValue?.shouldFoldAll ?? shouldFoldAll,
      ...forcedOptions
    }),
    [
      editorContextValue?.shouldFoldAll,
      forcedOptions,
      jsonValue,
      mode,
      onlyMatching,
      shouldFoldAll,
      value
    ]
  )

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
    if (options.shouldFoldAll) {
      editor.getSession().foldAll(1, editor.getSession().getLength())
    } else {
      editor.execCommand('unfoldall')
      editor.scrollToLine(0)
    }
  }, [options.shouldFoldAll])

  useLinePosition({
    initialLine,
    onScroll,
    editor
  })

  useTags({
    editor,
    value,
    setForcedOptions
  })

  useFontSize({ editor })

  useEffect(() => {
    editor?.setOptions({
      minLines,
      maxLines
    })
  }, [editor, maxLines, minLines])

  const classes = clsx({
    'text-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !allowSearch,
    'text-editor-wrapper-with-copy': allowCopy,
    'text-editor-wrapper-only-matching-lines': onlyMatching,
    'disable-folding': options.disableFolding,
    [extraClass]: true
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
        mode={options.mode}
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

TextEditor.Provider = TextEditorProvider
TextEditor.TagsInput = TagsInput
TextEditor.FoldAllButton = FoldAllButton
TextEditor.FontSizeControls = FontSizeControls

export default TextEditor

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
import {
  useFontSize,
  useLinePosition,
  useLinesCount,
  useSearch,
  useTags
} from './hooks'
import clsx from 'clsx'
import {
  FoldAllButton,
  TagsInput,
  FontSizeControls,
  LinesCount
} from './components'
import { TextEditorProvider, useTextEditorContext } from './context'
import Loader from '../Loader'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/ext-searchbox'

import './textEditor.scss'

interface ParsedData {
  [key: string]: any
}
export interface TextEditorProps {
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
  minLines?: number
  maxLines?: number
  loading?: boolean
}
function TextEditor(props: TextEditorProps) {
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
    minLines,
    maxLines,
    loading,
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

  const searchValue = useSearch({
    editor,
    allowSearch,
    editorReady,
    value
  })

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
    if (allowSearch) {
      if (onlyMatching && valueForMatched) {
        setJsonValue(getFilteredValue())
      } else {
        setJsonValue(value)
      }
    }
  }, [
    onlyMatching,
    searchValue,
    allowSearch,
    getFilteredValue,
    value,
    valueForMatched
  ])

  useEffect(() => {
    if (!value || !editor) {
      return
    }

    editor.scrollToLine(0)
    editor.selection.clearSelection()
  }, [onlyMatching, value])

  useEffect(() => {
    if (!editor) {
      return
    }

    if (options.shouldFoldAll) {
      editor.getSession().foldAll(1, editor.getSession().getLength())
    } else {
      editor.execCommand('unfoldall')
      editor.scrollToLine(0)
    }
  }, [editor, options.shouldFoldAll])

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

  useLinesCount({
    value,
    forcedValue: forcedOptions.value
  })

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

  return loading ? (
    <Loader />
  ) : (
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
TextEditor.LinesCount = LinesCount

export default TextEditor

import React, {
  forwardRef,
  lazy,
  memo,
  Suspense,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import type { IAceEditor } from 'react-ace/lib/types'
import { CircularProgress } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import { useToggle } from 'hooks'

import Copy from '../../../Copy'
import { Checkbox } from '../../../inputs'
import Loader from '../../../Loader'
import { useTextEditorContext } from '../../context'

import type { ExternalSearchAction, ParsedData } from './hooks'
import {
  useDisableSyntaxCheck,
  useEditor,
  useFoldAll,
  useForcedLineNumbers,
  useIsScrollbarVisible,
  useLinePosition,
  useOnlyMatching,
  useSearch
} from './hooks'

import './textEditorFull.scss'

const AceEditor = lazy(() =>
  import('react-ace').then(async (module) => {
    ;(window as any).ace.config.setModuleUrl(
      'ace/mode/json_worker',
      new URL(
        'ace-builds/src-noconflict/worker-json.js',
        import.meta.url
      ).toString()
    )

    await Promise.all([
      import('ace-builds/src-noconflict/mode-json'),
      import('ace-builds/src-noconflict/ext-searchbox')
    ])

    // vite bug: when the components installed as module, vite wraps async import in additional object, but for `yarn link` it doesn't
    return (
      typeof module.default !== 'function' // if it's a module
        ? module.default
        : module
    ) as typeof module
  })
)

export interface TextEditorHandle {
  getEditor: () => IAceEditor | undefined
}

export interface TextEditorFullProps {
  onChange?: () => void
  readOnly?: boolean
  value?: string
  onValidate?: () => void
  extraClass?: string
  allowSearch?: boolean
  allowCopy?: boolean
  foldAll?: boolean | number
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
  editorOptions?: Record<string, unknown>
  externalSearchTerm?: string
  externalSearchIsRegex?: boolean
  externalSearchCaseSensitive?: boolean
  externalSearchWholeWord?: boolean
  externalSearchAction?: ExternalSearchAction
  onSearchBoundary?: (direction: 'next' | 'prev') => void
  onSearchCounterUpdate?: (current: number, chunkTotal: number) => void
}
const TextEditorFull = forwardRef<TextEditorHandle, TextEditorFullProps>(function TextEditorFull({
  readOnly,
  value = EMPTY_STRING,
  onChange,
  onValidate,
  allowSearch = false,
  allowCopy = false,
  foldAll = false,
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
  editorOptions = {},
  externalSearchTerm,
  externalSearchIsRegex = false,
  externalSearchCaseSensitive = false,
  externalSearchWholeWord = false,
  externalSearchAction,
  onSearchBoundary,
  onSearchCounterUpdate,
  ...rest
}, ref) {

  const editorContext = useTextEditorContext(true)
  const editorContextValue = editorContext?.value
  const setTextEditorContext = editorContext?.setTextEditorContext

  useEffect(() => {
    setTextEditorContext?.((prev) => ({ ...prev, mode }))
  }, [setTextEditorContext, mode])

  const id = useId()
  const editorRef = useRef<{ editor: IAceEditor }>(null)
  const editor = editorRef.current?.editor

  const [onlyMatching, toggleOnlyMatching] = useToggle(false)
  const [editorReady, setEditorReady] = useState(false)

  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current?.editor
  }), [editorReady])

  const handleLoad = () => {
    setEditorReady(true)
  }

  const options = useMemo(
    () => ({
      mode,
      disableFolding: false,
      foldAll: editorContextValue?.foldAll ?? foldAll,
      allowSearch: editorContextValue?.allowSearch ?? allowSearch,
      value: lines?.map((line) => line.text).join('\n') ?? value
    }),
    [
      allowSearch,
      editorContextValue?.allowSearch,
      editorContextValue?.foldAll,
      lines,
      mode,
      foldAll,
      value
    ]
  )

  const searchValue = useSearch({
    editor,
    allowSearch: options.allowSearch,
    editorReady,
    value: options.value,
    externalSearchTerm,
    externalSearchIsRegex,
    externalSearchCaseSensitive,
    externalSearchWholeWord,
    externalSearchAction,
    onSearchBoundary,
    onSearchCounterUpdate
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
    foldAll: options.foldAll,
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

  useDisableSyntaxCheck({
    editor
  })

  useEditor({
    editor,
    onlyMatching,
    value: options.value
  })

  const isScrollbarVisible = useIsScrollbarVisible({ editorReady })

  const classes = clsx({
    'text-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !options.allowSearch,
    'text-editor-wrapper-with-copy': allowCopy,
    'text-editor-wrapper-only-matching-lines': onlyMatching,
    'disable-folding': !!(lines && lines.length > 0),
    [extraClass]: true
  })

  return loading ? (
    <Loader />
  ) : (
    <div className={classes}>
      {allowCopy ? (
        <Copy
          extraClass='copy-btn'
          text={jsonValue}
        />
      ) : null}
      {(valueForMatched || isValueForMatchedLoading) &&
      options.allowSearch &&
      isScrollbarVisible !== null ? (
        <div
          className={clsx('matching-toggle', {
            'with-scrollbar': isScrollbarVisible
          })}
        >
          <span>Show only matching lines</span>
          {isValueForMatchedLoading ? (
            <CircularProgress size={16} />
          ) : (
            <Checkbox
              checked={onlyMatching}
              onChange={toggleOnlyMatching}
            />
          )}
        </div>
      ) : null}
      <Suspense fallback={<Loader />}>
        <AceEditor
          ref={editorRef}
          editorProps={{ $blockScrolling: true }}
          fontSize={fontSize}
          height='100%'
          highlightActiveLine={false}
          mode={mode}
          name={id}
          onChange={onChange}
          onLoad={handleLoad}
          onValidate={onValidate}
          readOnly={readOnly}
          setOptions={{ maxLines, ...editorOptions }}
          showPrintMargin={false}
          value={onlyMatching ? jsonValue : options.value}
          width='calc(100% - 16px)'
          {...rest}
        />
      </Suspense>
    </div>
  )
})

export default memo(TextEditorFull)

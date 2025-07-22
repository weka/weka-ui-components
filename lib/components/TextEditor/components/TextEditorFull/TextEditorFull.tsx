import type { IAceEditor } from 'react-ace/lib/types'

import React, {
  lazy,
  memo,
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import { EMPTY_STRING } from 'consts'
import Copy from '../../../Copy'
import { useToggle } from 'hooks'
import { Checkbox } from '../../../inputs'
import { CircularProgress } from '@mui/material'
import {
  useFoldAll,
  useLinePosition,
  useOnlyMatching,
  useSearch,
  useForcedLineNumbers,
  useEditor,
  ParsedData,
  useDisableSyntaxCheck,
  useIsScrollbarVisible
} from './hooks'
import clsx from 'clsx'
import { useTextEditorContext } from '../../context'
import Loader from '../../../Loader'

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
}
function TextEditorFull(props: TextEditorFullProps) {
  const {
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
    ...rest
  } = props

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
      {allowCopy && <Copy text={jsonValue} extraClass='copy-btn' />}
      {(valueForMatched || isValueForMatchedLoading) &&
        options.allowSearch &&
        isScrollbarVisible !== null && (
          <div
            className={clsx('matching-toggle', {
              ['with-scrollbar']: isScrollbarVisible
            })}
          >
            <span>Show only matching lines</span>
            {isValueForMatchedLoading ? (
              <CircularProgress size={16} />
            ) : (
              <Checkbox checked={onlyMatching} onChange={toggleOnlyMatching} />
            )}
          </div>
        )}
      <Suspense fallback={<Loader />}>
        <AceEditor
          ref={editorRef}
          mode={mode}
          height='100%'
          fontSize={fontSize}
          width='calc(100% - 16px)'
          showPrintMargin={false}
          highlightActiveLine={false}
          name={id}
          editorProps={{ $blockScrolling: true }}
          readOnly={readOnly}
          value={onlyMatching ? jsonValue : options.value}
          onChange={onChange}
          onValidate={onValidate}
          onLoad={handleLoad}
          setOptions={{ maxLines, ...editorOptions }}
          {...rest}
        />
      </Suspense>
    </div>
  )
}

export default memo(TextEditorFull)

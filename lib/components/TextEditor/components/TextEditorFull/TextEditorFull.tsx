import type { ExternalSearchAction, ParsedData, SearchDirection } from './hooks'
import type { IAceEditor } from 'react-ace/lib/types'

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
import { CircularProgress } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING, NOP } from '#consts'
import { useToggle } from '#hooks'

import Copy from '../../../Copy'
import { Checkbox } from '../../../inputs'
import Loader from '../../../Loader'
import { useTextEditorContext } from '../../context'
import { ChunkSearchBox } from '../ChunkSearchBox'
import {
  useDisableSyntaxCheck,
  useEditor,
  useFoldAll,
  useForcedLineNumbers,
  useInternalSearch,
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

const CUSTOM_SEARCH_COMMANDS = {
  openSearch: {
    name: 'openCustomSearch',
    bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
    readOnly: true
  },
  findNext: {
    name: 'customSearchNext',
    bindKey: { win: 'Ctrl-K', mac: 'Command-G' },
    readOnly: true
  },
  findPrevious: {
    name: 'customSearchPrevious',
    bindKey: { win: 'Ctrl-Shift-K', mac: 'Command-Shift-G' },
    readOnly: true
  }
}

export interface TextEditorFullProps {
  onChange?: () => void
  /** called once the underlying Ace editor instance has mounted */
  onLoad?: (editor: IAceEditor) => void
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
  externalSearchExceeded?: boolean
  externalSearchAction?: ExternalSearchAction
  onSearchBoundary?: (direction: SearchDirection) => void
  onSearchCounterUpdate?: (
    current: number,
    chunkTotal: number,
    exceeded?: boolean
  ) => void
}
const TextEditorFull = forwardRef<TextEditorHandle, TextEditorFullProps>(
  function TextEditorFull(
    {
      readOnly,
      value = EMPTY_STRING,
      onChange,
      onLoad,
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
      externalSearchExceeded = false,
      externalSearchAction,
      onSearchBoundary,
      onSearchCounterUpdate,
      ...rest
    },
    ref
  ) {
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
    const [aceEditor, setAceEditor] = useState<IAceEditor | undefined>(
      undefined
    )

    useImperativeHandle(
      ref,
      () => ({
        getEditor: () => editorRef.current?.editor
      }),
      [editorReady]
    )

    const handleLoad = (loadedEditor: IAceEditor) => {
      setAceEditor(loadedEditor)
      setEditorReady(true)
      onLoad?.(loadedEditor)
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

    const hasExternalSearch = Boolean(
      externalSearchTerm ||
        externalSearchAction ||
        onSearchBoundary ||
        onSearchCounterUpdate
    )

    const internalSearch = useInternalSearch()
    const { setDismissed, setSearchTerm } = internalSearch
    const searchInputRef = useRef<HTMLInputElement>(null)

    const showSearchBox =
      options.allowSearch && !hasExternalSearch && !internalSearch.dismissed

    const latestOpenSearchRef = useRef(NOP)
    const latestFindDirectionRef = useRef<(backwards: boolean) => void>(NOP)

    useEffect(() => {
      latestOpenSearchRef.current = () => {
        if (hasExternalSearch || !options.allowSearch) {
          return
        }
        setDismissed(false)
        const selectedText = aceEditor?.getSelectedText() ?? EMPTY_STRING
        if (selectedText && !selectedText.includes('\n')) {
          setSearchTerm(selectedText)
        }
        requestAnimationFrame(() => {
          searchInputRef.current?.focus()
          searchInputRef.current?.select()
        })
      }
      latestFindDirectionRef.current = (backwards: boolean) => {
        if (!showSearchBox || !internalSearch.searchTerm) {
          return
        }
        if (backwards) {
          internalSearch.handlePrev()
        } else {
          internalSearch.handleNext()
        }
      }
    })

    const prevAllowSearchRef = useRef(options.allowSearch)
    useEffect(() => {
      const searchJustEnabled =
        options.allowSearch && !prevAllowSearchRef.current
      prevAllowSearchRef.current = options.allowSearch
      if (!options.allowSearch) {
        return
      }
      setDismissed(false)
      if (searchJustEnabled) {
        latestOpenSearchRef.current()
      }
    }, [options.allowSearch, setDismissed])

    useEffect(() => {
      if (!aceEditor) {
        return
      }
      aceEditor.commands.addCommand({
        ...CUSTOM_SEARCH_COMMANDS.openSearch,
        exec: () => latestOpenSearchRef.current()
      })
      aceEditor.commands.addCommand({
        ...CUSTOM_SEARCH_COMMANDS.findNext,
        exec: () => latestFindDirectionRef.current(false)
      })
      aceEditor.commands.addCommand({
        ...CUSTOM_SEARCH_COMMANDS.findPrevious,
        exec: () => latestFindDirectionRef.current(true)
      })
    }, [aceEditor])

    useSearch({
      editor: aceEditor,
      editorReady,
      value: options.value,
      externalSearchTerm: hasExternalSearch
        ? externalSearchTerm
        : (showSearchBox && internalSearch.searchTerm) || undefined,
      externalSearchIsRegex: hasExternalSearch
        ? externalSearchIsRegex
        : internalSearch.isRegex,
      externalSearchCaseSensitive: hasExternalSearch
        ? externalSearchCaseSensitive
        : internalSearch.isCaseSensitive,
      externalSearchWholeWord: hasExternalSearch
        ? externalSearchWholeWord
        : internalSearch.isWholeWord,
      externalSearchExceeded: hasExternalSearch && externalSearchExceeded,
      externalSearchAction: hasExternalSearch
        ? externalSearchAction
        : internalSearch.action,
      onSearchBoundary: hasExternalSearch
        ? onSearchBoundary
        : internalSearch.wrapSearchAtBoundary,
      onSearchCounterUpdate: hasExternalSearch
        ? onSearchCounterUpdate
        : internalSearch.handleCounterUpdate
    })

    const searchValue = showSearchBox ? internalSearch.searchTerm : EMPTY_STRING

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
        {showSearchBox ? (
          <ChunkSearchBox
            currentMatch={internalSearch.counter.current}
            exceeded={internalSearch.exceeded}
            isCaseSensitive={internalSearch.isCaseSensitive}
            isRegex={internalSearch.isRegex}
            isWholeWord={internalSearch.isWholeWord}
            onCaseSensitiveChange={internalSearch.setIsCaseSensitive}
            onClose={() => setDismissed(true)}
            onNext={internalSearch.handleNext}
            onPrev={internalSearch.handlePrev}
            onRegexChange={internalSearch.setIsRegex}
            onSearchTermChange={setSearchTerm}
            onWholeWordChange={internalSearch.setIsWholeWord}
            searchInputRef={searchInputRef}
            searchTerm={internalSearch.searchTerm}
            totalMatches={internalSearch.counter.total}
          />
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
  }
)

export default memo(TextEditorFull)

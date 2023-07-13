import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import AceEditor from 'react-ace'
import classNames from 'classnames'
import { EMPTY_STRING } from '../../consts'
import Copy from '../Copy'
import { useToggle } from '../../hooks'
import { Checkbox } from '../inputs'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/ext-searchbox'

import './jsonEditor.scss'

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
  [key: string]: any
}
function JsonEditor(props: JsonEditorProps) {
  const {
    readOnly,
    value,
    onChange,
    onValidate,
    allowSearch = false,
    allowCopy = false,
    shouldFoldAll = false,
    extraClass = EMPTY_STRING,
    ...rest
  } = props
  const id = useId()
  const editorRef = useRef<any>(null)

  const [onlyMatching, toggleOnlyMatching] = useToggle(false)
  const [editorReady, setEditorReady] = useState(false)
  const [searchValue, setSearchValue] = useState(EMPTY_STRING)
  const [jsonValue, setJsonValue] = useState(value)

  const classes = classNames({
    'json-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !allowSearch,
    'json-editor-wrapper-with-copy': allowCopy,
    'json-editor-wrapper-only-matching-lines': onlyMatching,
    [extraClass]: true
  })

  const reformattedValue = useMemo(() => {
    const reformatValue = (json: ParsedData, initialAccounter: Array<string>) =>
      Object.keys(json).reduce<Record<string, string | number>>((acc, key) => {
        if (typeof json[key] === 'object' && json[key] !== null) {
          acc = {
            ...acc,
            ...reformatValue(json[key], [...initialAccounter, key])
          }
        } else {
          acc[[...initialAccounter, key].join('.')] = json[key]
        }
        return acc
      }, {})

    if (allowSearch && !!value) {
      const parsedValue = JSON.parse(value)

      return parsedValue ? reformatValue(parsedValue, []) : {}
    }

    return {}
  }, [allowSearch, value])

  const handleLoad = () => {
    setEditorReady(true)
  }

  const getFilteredValue = useCallback(() => {
    const searchTerm = searchValue.toLowerCase()
    const filtered = Object.keys(reformattedValue).reduce<
      Record<string, string | number | boolean>
    >((acc, key) => {
      if (
        key.toLowerCase().includes(searchTerm) ||
        `${reformattedValue[key]}`.toLowerCase().includes(searchTerm)
      ) {
        acc[key] = reformattedValue[key]
      }

      return acc
    }, {})
    return JSON.stringify(filtered, null, 2)
  }, [reformattedValue, searchValue])

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
      const editor = editorRef.current?.editor
      if (onlyMatching) {
        setJsonValue(getFilteredValue())
      } else {
        setJsonValue(value)
      }
      editor.scrollToLine(0)
    }
  }, [onlyMatching, searchValue, allowSearch, getFilteredValue, value])

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

  return (
    <div className={classes}>
      {allowCopy && <Copy text={jsonValue} extraClass='copy-btn' />}
      {allowSearch && (
        <div className='matching-toggle'>
          <span>Show only matching lines</span>
          <Checkbox checked={onlyMatching} onChange={toggleOnlyMatching} />
        </div>
      )}
      <AceEditor
        ref={editorRef}
        mode='json'
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

export default JsonEditor

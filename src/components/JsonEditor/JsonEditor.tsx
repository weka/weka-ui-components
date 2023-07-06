import React, { useEffect, useId, useRef } from 'react'
import AceEditor from 'react-ace'
import classNames from 'classnames'
import { EMPTY_STRING } from '../../consts'
import Copy from '../Copy'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/ext-searchbox'

import './jsonEditor.scss'

interface JsonEditorProps {
  onChange?: () => void
  readOnly?: boolean
  value?: string
  onValidate?: () => void
  extraClass?: string
  allowSearch?: boolean
  allowCopy?: boolean
  shouldFoldAll?: boolean
  [key: string]: any
}
function JsonEditor(props:JsonEditorProps) {
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
  const classes = classNames({
    'json-editor-wrapper': true,
    'read-only': readOnly,
    'hide-search': !allowSearch,
    'json-editor-wrapper-with-copy': allowCopy,
    [extraClass]: true
  })

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
      {allowCopy && (<Copy text={value} extraClass='copy-btn' />)}
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
        value={value}
        onChange={onChange}
        onValidate={onValidate}
        {...rest}
      />
    </div>
  )
}

export default JsonEditor

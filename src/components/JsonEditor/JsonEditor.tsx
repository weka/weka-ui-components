import React, { useId } from 'react'
import AceEditor from 'react-ace'
import classNames from 'classnames'
import { EMPTY_STRING } from '../../consts'

import 'ace-builds/src-noconflict/mode-json'

import './jsonEditor.scss'

interface JsonEditorProps {
  onChange?: () => void,
  readOnly?: boolean,
  value?: string,
  onValidate?: () => void,
  extraClass?: string,
  [key: string]: any
}
function JsonEditor(props:JsonEditorProps) {
  const {
    readOnly,
    value,
    onChange,
    onValidate,
    extraClass = EMPTY_STRING,
    ...rest
  } = props
  const id = useId()
  const classes = classNames({
    'json-editor-wrapper': true,
    'read-only': readOnly,
    [extraClass]: true
  })
  return (
    <div className={classes}>
      <AceEditor
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
        maxLines={Infinity}
        {...rest}
      />
    </div>
  )
}

export default JsonEditor

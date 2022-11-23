import React, { useId } from 'react'
import AceEditor from 'react-ace'
import classNames from 'classnames'
import propTypes from 'prop-types'

import 'ace-builds/src-noconflict/mode-json'

import './jsonEditor.scss'

function JsonEditor(props) {
  const {
    readOnly,
    value,
    onChange,
    onValidate,
    ...rest } = props
  const id = useId()
  const classes = classNames({
    'json-editor-wrapper': true,
    'read-only': readOnly
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
        {...rest}
      />
    </div>
  )
}

JsonEditor.defaultProps = { readOnly: false, onValidate: () => {} }

JsonEditor.propTypes = {
  onChange: propTypes.func.isRequired,
  readOnly: propTypes.bool,
  value: propTypes.string.isRequired,
  onValidate: propTypes.func

}

export default JsonEditor

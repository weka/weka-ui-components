import React, { useId } from 'react'
import AceEditor from 'react-ace'
import classNames from 'classnames'
import propTypes from 'prop-types'

import 'ace-builds/src-noconflict/mode-json'

import './jsonEditor.scss'

function JsonEditor(props) {
  const { readOnly, ...rest } = props
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
        {...rest}
      />
    </div>
  )
}

JsonEditor.defaultProps = { readOnly: false }

JsonEditor.propTypes = { onChange: propTypes.func.isRequired, readOnly: propTypes.bool }

export default JsonEditor

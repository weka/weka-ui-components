import React from 'react'
import JsonEditor from './JsonEditor'

const JsonEditorWrapper = (props) => <JsonEditor {...props} />

export default React.memo(JsonEditorWrapper)

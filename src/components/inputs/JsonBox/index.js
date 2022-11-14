import React from 'react'
import JsonBox from './JsonBox'

const JsonBoxWrapper = (props) => <JsonBox {...props} />

export default React.memo(JsonBoxWrapper)

import React from 'react'
import TextBox from './TextBox'

const TextBoxWrapper = (props) => <TextBox {...props} />

export default React.memo(TextBoxWrapper)

import React from 'react'
import TextField from './TextField'

const TextFieldWrapper = (props) => <TextField {...props} />

export default React.memo(TextFieldWrapper)

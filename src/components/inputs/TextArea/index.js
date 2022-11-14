import React from 'react'
import TextArea from './TextArea'

const TextAreaWrapper = (props) => <TextArea {...props} />

export default React.memo(TextAreaWrapper)

import React from 'react'
import TagsBox from './TagsBox'

const TextBoxWrapper = (props) => <TagsBox {...props} />

export default React.memo(TextBoxWrapper)

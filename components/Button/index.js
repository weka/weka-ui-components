import React from 'react'
import Button from './Button'

const ButtonWrapper = (props) => <Button {...props} />

export default React.memo(ButtonWrapper)

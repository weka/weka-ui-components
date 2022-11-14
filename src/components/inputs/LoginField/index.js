import React from 'react'
import LoginField from './LoginField'

const LoginFieldWrapper = (props) => <LoginField {...props} />

export default React.memo(LoginFieldWrapper)

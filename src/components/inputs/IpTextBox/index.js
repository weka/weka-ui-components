import React from 'react'
import IpTextBox from './IpTextBox'

const IpTextBoxWrapper = (props) => <IpTextBox {...props} />

export default React.memo(IpTextBoxWrapper)

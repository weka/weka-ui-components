import React from 'react'
import propTypes from 'prop-types'
import { passwordStrength } from 'check-password-strength'
import { EMPTY_STRING } from '../../consts'

import './newPasswordTooltip.scss'

function NewPasswordTooltip({ passValue }) {
  const passStrength = passwordStrength(passValue)

  return (
    <div className='password-min-demand'>
      <span className='demand-headline'>Password must contain:</span>
      <span className={passStrength.length >= 8 ? 'valid' : EMPTY_STRING}>● At least 8 characters</span>
      <span className={passStrength.contains.includes('uppercase') ? 'valid' : EMPTY_STRING}>● Uppercase letter</span>
      <span className={passStrength.contains.includes('lowercase') ? 'valid' : EMPTY_STRING}>● Lowercase letter</span>
      <span className={(passStrength.contains.includes('number') || passStrength.contains.includes('symbol')) ? 'valid' : EMPTY_STRING}>
        ● Number or special character
      </span>
    </div>
  )
}

NewPasswordTooltip.defaultProps = { passValue: EMPTY_STRING }

NewPasswordTooltip.propTypes = { passValue: propTypes.string }

export default NewPasswordTooltip

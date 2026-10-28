import React from 'react'
import { owaspSymbols, passwordStrength } from 'check-password-strength'
import { EMPTY_STRING } from '#consts'

import './newPasswordTooltip.scss'

interface NewPasswordTooltipProps {
  passValue?: string
}
function NewPasswordTooltip({
  passValue = EMPTY_STRING
}: NewPasswordTooltipProps) {
  // v3's default counts any non-alphanumeric character (e.g. spaces) as a symbol
  const passStrength = passwordStrength(passValue, undefined, owaspSymbols)

  return (
    <div className='password-min-demand'>
      <span className='demand-headline'>Password must contain:</span>
      <span className={passStrength.length >= 8 ? 'valid' : EMPTY_STRING}>
        ● At least 8 characters
      </span>
      <span
        className={
          passStrength.contains.includes('uppercase') ? 'valid' : EMPTY_STRING
        }
      >
        ● Uppercase letter
      </span>
      <span
        className={
          passStrength.contains.includes('lowercase') ? 'valid' : EMPTY_STRING
        }
      >
        ● Lowercase letter
      </span>
      <span
        className={
          passStrength.contains.includes('number') ||
          passStrength.contains.includes('symbol')
            ? 'valid'
            : EMPTY_STRING
        }
      >
        ● Number or special character
      </span>
    </div>
  )
}
export default NewPasswordTooltip

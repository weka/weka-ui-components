import type { Result } from 'check-password-strength'

import { passwordStrength } from 'check-password-strength'
import clsx from 'clsx'

import styles from './passwordInput.module.scss'

const RULES_HEADER = 'Password must contain:'
const MIN_LENGTH = 8

const RULES: {
  label: string
  met: (s: Result<string>) => boolean
}[] = [
  { label: 'At least 8 characters', met: (s) => s.length >= MIN_LENGTH },
  {
    label: 'One uppercase letter',
    met: (s) => s.contains.includes('uppercase')
  },
  {
    label: 'One lowercase letter',
    met: (s) => s.contains.includes('lowercase')
  },
  {
    label: 'One number or special character',
    met: (s) => s.contains.includes('number') || s.contains.includes('symbol')
  }
]

export interface PasswordRequirementsProps {
  value: string
}

export function PasswordRequirements({
  value
}: Readonly<PasswordRequirementsProps>) {
  const strength = passwordStrength(value)
  return (
    <div className={styles.rules}>
      <span className={styles.rulesHeader}>{RULES_HEADER}</span>
      {RULES.map((rule) => (
        <span
          key={rule.label}
          className={clsx(styles.ruleRow, rule.met(strength) && styles.met)}
        >
          {rule.label}
        </span>
      ))}
    </div>
  )
}

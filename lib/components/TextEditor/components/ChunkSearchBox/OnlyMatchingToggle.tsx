import { CircularProgress } from '@mui/material'
import clsx from 'clsx'

import { Checkbox } from '../../../inputs'

interface OnlyMatchingToggleProps {
  checked?: boolean
  loading?: boolean
  /** the toggle is rendered only when a handler is provided */
  onChange?: (checked: boolean) => void
}

function OnlyMatchingToggle({
  checked = false,
  loading = false,
  onChange
}: Readonly<OnlyMatchingToggleProps>) {
  if (!onChange) {
    return null
  }

  return (
    <label
      aria-busy={loading}
      className={clsx('search-only-matching', loading && 'loading')}
    >
      {loading ? (
        <CircularProgress size={16} />
      ) : (
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      )}
      <span>Show only matching lines</span>
    </label>
  )
}

export default OnlyMatchingToggle

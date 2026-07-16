import { EyeIcon } from '../../icons/EyeIcon'
import { EyeOffIcon } from '../../icons/EyeOffIcon'
import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'

const SHOW_LABEL = 'Show password'
const HIDE_LABEL = 'Hide password'

export interface PasswordToggleButtonProps {
  isVisible: boolean
  onToggle: () => void
  disabled?: boolean
}

export function PasswordToggleButton({
  isVisible,
  onToggle,
  disabled = false
}: Readonly<PasswordToggleButtonProps>) {
  const label = isVisible ? HIDE_LABEL : SHOW_LABEL

  return (
    <Tooltip data={label}>
      <IconButton
        ariaLabel={label}
        disabled={disabled}
        onClick={onToggle}
        small
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </IconButton>
    </Tooltip>
  )
}

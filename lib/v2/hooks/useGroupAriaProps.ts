import { useId } from 'react'

const GROUP_ROLE = 'group'

export interface GroupLabelProps {
  /** Visible label rendered by the component itself; wins over the aria props when present. */
  label?: string
  /** Accessible name used only when no visible label is rendered or referenced. */
  ariaLabel?: string
  /** Id of an external label element naming the group, e.g. a FieldWrapper label. */
  ariaLabelledBy?: string
}

export interface GroupAriaProps {
  role: typeof GROUP_ROLE
  'aria-label'?: string
  'aria-labelledby'?: string
}

interface UseGroupAriaPropsResult {
  /** Id to put on the component's own label element so the group references it. */
  labelId: string
  groupProps: GroupAriaProps
}

/**
 * Names a composite control (several inputs behind one value) as a single
 * `group`. A rendered `label` is referenced by id, otherwise an external
 * `ariaLabelledBy`, otherwise `ariaLabel`; never both at once so assistive
 * technology reads exactly one name.
 */
export function useGroupAriaProps({
  label,
  ariaLabel,
  ariaLabelledBy
}: GroupLabelProps): UseGroupAriaPropsResult {
  const labelId = useId()
  const labelledBy = label ? labelId : ariaLabelledBy

  return {
    labelId,
    groupProps: {
      role: GROUP_ROLE,
      'aria-labelledby': labelledBy,
      'aria-label': labelledBy ? undefined : ariaLabel
    }
  }
}

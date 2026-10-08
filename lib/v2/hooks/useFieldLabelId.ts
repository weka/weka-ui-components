import { useId } from 'react'

/**
 * Stable id for a form field's label element, or `undefined` when there is no
 * label. Lets a wrapper bind a non-labelable control (combobox, radiogroup,
 * group) to its visible label through `aria-labelledby` without emitting a
 * dangling reference when the label is omitted.
 */
export function useFieldLabelId(label: string | undefined): string | undefined {
  const id = useId()
  return label ? id : undefined
}

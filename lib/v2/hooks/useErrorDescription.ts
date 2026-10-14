import { useId } from 'react'

interface UseErrorDescriptionResult {
  /** Id to put on the component's own error text element. */
  errorId: string
  /** Value for `aria-describedby`, or `undefined` when nothing describes the control. */
  describedBy: string | undefined
}

/**
 * Links a control to the error text it renders itself, merged with an id from a
 * parent that renders the message elsewhere. The own id is only included while
 * `error` is set, so `aria-describedby` never points at a missing element.
 */
export function useErrorDescription(
  error: string | undefined,
  ariaDescribedBy?: string
): UseErrorDescriptionResult {
  const errorId = useId()
  const ids = [error ? errorId : undefined, ariaDescribedBy].filter(Boolean)

  return { errorId, describedBy: ids.length ? ids.join(' ') : undefined }
}

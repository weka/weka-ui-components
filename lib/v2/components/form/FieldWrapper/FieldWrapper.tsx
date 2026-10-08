import type { ReactNode } from 'react'

import { InfoIcon } from '../../../icons'
import { Tooltip } from '../../Tooltip'

import styles from './fieldWrapper.module.scss'

export interface FieldWrapperProps {
  error?: string
  children: ReactNode
  label?: string
  info?: string
  required?: boolean
  /** Renders the label as a `<label>` bound to this id; without it the label is a plain `<span>`. */
  htmlFor?: string
  /** Id of the label element, for controls that are named through `aria-labelledby` instead of `htmlFor`. */
  labelId?: string
  /** Replaces the default label styling entirely instead of merging with it. */
  labelClassName?: string
}

/**
 * Shared layout for form inputs: an optional label row (label, required marker,
 * info tooltip), the input itself, and the validation error underneath.
 */
export function FieldWrapper({
  error,
  children,
  label,
  info,
  required,
  htmlFor,
  labelId,
  labelClassName
}: Readonly<FieldWrapperProps>) {
  const LabelTag = htmlFor ? 'label' : 'span'

  return (
    <div className={styles.fieldWrapper}>
      {label || info ? (
        <span className={styles.labelRow}>
          {label ? (
            <LabelTag
              className={labelClassName ?? styles.labelText}
              htmlFor={htmlFor}
              id={labelId}
            >
              {label}
              {required ? (
                <span className={styles.required}>&thinsp;*</span>
              ) : null}
            </LabelTag>
          ) : null}
          {info ? (
            <Tooltip data={info}>
              <span className={styles.infoIcon}>
                <InfoIcon />
              </span>
            </Tooltip>
          ) : null}
        </span>
      ) : null}
      {children}
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  )
}

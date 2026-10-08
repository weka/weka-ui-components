import { useState } from 'react'
import clsx from 'clsx'

import { type GroupLabelProps, useGroupAriaProps } from '#v2/hooks'
import { EMPTY_STRING } from '#v2/utils/consts'

import { IpInput } from '../IpInput'

import styles from './ipRangeInput.module.scss'

const START_ARIA_LABEL = 'Start IP'
const END_ARIA_LABEL = 'End IP'

export interface IpRangeInputProps extends GroupLabelProps {
  value: string
  onChange: (value: string) => void
  /** Visible label above the start address; the endpoint is still named for assistive technology when omitted. */
  startLabel?: string
  /** Visible label above the end address; the endpoint is still named for assistive technology when omitted. */
  endLabel?: string
  disabled?: boolean
  required?: boolean
  error?: string
  info?: string
}

function parseRange(value: string): { start: string; end: string } {
  if (!value) {
    return { start: EMPTY_STRING, end: EMPTY_STRING }
  }
  const idx = value.indexOf('-')
  if (idx === -1) {
    return { start: value, end: EMPTY_STRING }
  }
  return { start: value.slice(0, idx), end: value.slice(idx + 1) }
}

export function IpRangeInput({
  value,
  onChange,
  label,
  ariaLabel,
  ariaLabelledBy,
  startLabel,
  endLabel,
  disabled = false,
  required = false,
  error
}: Readonly<IpRangeInputProps>) {
  const { labelId, groupProps } = useGroupAriaProps({
    label,
    ariaLabel,
    ariaLabelledBy
  })
  const [start, setStart] = useState(() => parseRange(value).start)
  const [end, setEnd] = useState(() => parseRange(value).end)
  const [lastValue, setLastValue] = useState(value)

  if (value !== lastValue) {
    setLastValue(value)
    const parsed = parseRange(value)
    setStart(parsed.start)
    setEnd(parsed.end)
  }

  function emit(nextStart: string, nextEnd: string) {
    const nextValue =
      nextStart && nextEnd ? `${nextStart}-${nextEnd}` : EMPTY_STRING
    setLastValue(nextValue)
    onChange(nextValue)
  }

  function handleStartChange(newStart: string) {
    setStart(newStart)
    emit(newStart, end)
  }

  function handleEndChange(newEnd: string) {
    setEnd(newEnd)
    emit(start, newEnd)
  }

  return (
    <div
      className={clsx(styles.wrapper, error && styles.hasError)}
      {...groupProps}
    >
      {label ? (
        <span
          className={styles.label}
          id={labelId}
        >
          {label}
          {required ? <span className={styles.requiredStar}> *</span> : null}
        </span>
      ) : null}
      <div className={styles.rangeRow}>
        <div className={styles.ipBox}>
          <IpInput
            ariaLabel={START_ARIA_LABEL}
            disabled={disabled}
            label={startLabel}
            onChange={handleStartChange}
            required={required}
            value={start}
          />
        </div>
        <span className={styles.rangeSeparator}>–</span>
        <div className={styles.ipBox}>
          <IpInput
            ariaLabel={END_ARIA_LABEL}
            disabled={disabled}
            label={endLabel}
            onChange={handleEndChange}
            required={required}
            value={end}
          />
        </div>
      </div>
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  )
}

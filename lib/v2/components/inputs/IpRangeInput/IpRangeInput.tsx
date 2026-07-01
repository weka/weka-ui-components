import { useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import { IpInput } from '../IpInput'

import styles from './ipRangeInput.module.scss'

export interface IpRangeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  startLabel?: string
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
  startLabel,
  endLabel,
  disabled = false,
  required = false,
  error
}: Readonly<IpRangeInputProps>) {
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
    <div className={clsx(styles.wrapper, error && styles.hasError)}>
      {label ? (
        <span className={styles.label}>
          {label}
          {required ? <span className={styles.requiredStar}> *</span> : null}
        </span>
      ) : null}
      <div className={styles.rangeRow}>
        <div className={styles.ipBox}>
          <IpInput
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

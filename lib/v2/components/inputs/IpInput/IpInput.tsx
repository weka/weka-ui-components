import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'

import { useRef, useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING, KEYBOARD_KEYS } from '#v2/utils/consts'

import styles from './ipInput.module.scss'

const OCTET_COUNT = 4
const MAX_OCTET = 255
const MIN_OCTET = 0
const AUTO_ADVANCE_THRESHOLD = 100
const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/
const BLANK_OCTETS = [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING, EMPTY_STRING]

function parseOctets(value: string): string[] {
  if (!value) {
    return [...BLANK_OCTETS]
  }
  const parts = value.split('.')
  if (parts.length === OCTET_COUNT) {
    return parts
  }
  return [...BLANK_OCTETS]
}

function clampOctet(raw: string): string {
  if (raw === EMPTY_STRING) {
    return EMPTY_STRING
  }
  const num = parseInt(raw, 10)
  if (Number.isNaN(num)) {
    return EMPTY_STRING
  }
  return String(Math.min(MAX_OCTET, Math.max(MIN_OCTET, num)))
}

export interface IpInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
  required?: boolean
  error?: string
  info?: string
  dataTestId?: string
}

export function IpInput({
  value,
  onChange,
  label,
  disabled = false,
  required = false,
  error,
  dataTestId
}: Readonly<IpInputProps>) {
  const [octets, setOctets] = useState<string[]>(() => parseOctets(value))
  const [lastValue, setLastValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  if (value !== lastValue) {
    setLastValue(value)
    setOctets(parseOctets(value))
  }

  function getInputs(): NodeListOf<HTMLInputElement> | null {
    return (
      containerRef.current?.querySelectorAll('input[type="number"]') ?? null
    )
  }

  function focusNext(currentIndex: number) {
    const inputs = getInputs()
    if (inputs && currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus()
      inputs[currentIndex + 1].select()
    }
  }

  function focusPrev(currentIndex: number) {
    const inputs = getInputs()
    if (inputs && currentIndex > 0) {
      inputs[currentIndex - 1].focus()
      inputs[currentIndex - 1].select()
    }
  }

  function emitChange(nextOctets: string[]) {
    const anyBlank = nextOctets.some((o) => o === EMPTY_STRING)
    const nextValue = anyBlank ? EMPTY_STRING : nextOctets.join('.')
    setLastValue(nextValue)
    onChange(nextValue)
  }

  function handleOctetChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const clamped = clampOctet(raw)
    const next = octets.map((o, i) => (i === index ? clamped : o))
    setOctets(next)
    emitChange(next)

    if (
      clamped !== EMPTY_STRING &&
      parseInt(clamped, 10) >= AUTO_ADVANCE_THRESHOLD
    ) {
      focusNext(index)
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === KEYBOARD_KEYS.ARROW_RIGHT || e.key === '.') {
      e.preventDefault()
      focusNext(index)
    } else if (e.key === KEYBOARD_KEYS.ARROW_LEFT) {
      e.preventDefault()
      focusPrev(index)
    } else {
      // no-op for other keys
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text')
    if (IP_PATTERN.test(pasted)) {
      e.preventDefault()
      const parts = pasted.split('.')
      const next = parts.map(clampOctet)
      setOctets(next)
      emitChange(next)
    }
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.container,
        error && styles.error,
        disabled && styles.disabled
      )}
      {...(dataTestId && { 'data-testid': dataTestId })}
    >
      {label ? (
        <span className={styles.label}>
          {label}
          {required ? <span className={styles.requiredStar}> *</span> : null}
        </span>
      ) : null}
      <div className={styles.valueRow}>
        {octets.map((octet, index) => (
          <span
            key={index}
            className={styles.octetWrapper}
          >
            <input
              className={styles.octetInput}
              disabled={disabled}
              max={MAX_OCTET}
              min={MIN_OCTET}
              onChange={(e) => handleOctetChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              type='number'
              value={octet}
            />
            {index < OCTET_COUNT - 1 ? (
              <span className={styles.separator}>.</span>
            ) : null}
          </span>
        ))}
      </div>
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  )
}

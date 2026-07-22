import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'

import { useRef, useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING, KEYBOARD_KEYS } from '#v2/utils/consts'

import { IpInput } from '../IpInput'

import styles from './ipSubnetInput.module.scss'

const MIN_PART = 0
const MAX_OCTET = 255
const MAX_BITS = 32
const CIDR_PATTERN = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/

function clampPart(raw: string, max: number): string {
  if (raw === EMPTY_STRING) {
    return EMPTY_STRING
  }
  const num = parseInt(raw, 10)
  if (Number.isNaN(num)) {
    return EMPTY_STRING
  }
  return String(Math.min(max, Math.max(MIN_PART, num)))
}

function parseSubnet(value: string): { ip: string; bits: string } {
  if (!value) {
    return { ip: EMPTY_STRING, bits: EMPTY_STRING }
  }
  const idx = value.indexOf('/')
  if (idx === -1) {
    return { ip: value, bits: EMPTY_STRING }
  }
  return { ip: value.slice(0, idx), bits: value.slice(idx + 1) }
}

export interface IpSubnetInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
  required?: boolean
  error?: string
  info?: string
  dataTestId?: string
}

export function IpSubnetInput({
  value,
  onChange,
  label,
  disabled = false,
  required = false,
  error,
  dataTestId
}: Readonly<IpSubnetInputProps>) {
  const [ip, setIp] = useState(() => parseSubnet(value).ip)
  const [bits, setBits] = useState(() => parseSubnet(value).bits)
  const [lastValue, setLastValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  if (value !== lastValue) {
    setLastValue(value)
    const parsed = parseSubnet(value)
    setIp(parsed.ip)
    setBits(parsed.bits)
  }

  function emit(nextIp: string, nextBits: string) {
    const nextValue =
      nextIp && nextBits !== EMPTY_STRING
        ? `${nextIp}/${nextBits}`
        : EMPTY_STRING
    setLastValue(nextValue)
    onChange(nextValue)
  }

  function handleIpChange(newIp: string) {
    setIp(newIp)
    emit(newIp, bits)
  }

  function handleBitsChange(e: ChangeEvent<HTMLInputElement>) {
    const clamped = clampPart(e.target.value, MAX_BITS)
    setBits(clamped)
    emit(ip, clamped)
  }

  function getNumberInputs(): NodeListOf<HTMLInputElement> | null {
    return (
      containerRef.current?.querySelectorAll('input[type="number"]') ?? null
    )
  }

  function focusInput(input: HTMLInputElement) {
    input.focus()
    input.select()
  }

  function handleBitsKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== KEYBOARD_KEYS.ARROW_LEFT) {
      return
    }
    const inputs = getNumberInputs()
    if (!inputs || inputs.length < 2) {
      return
    }
    e.preventDefault()
    focusInput(inputs[inputs.length - 2])
  }

  function handleOctetsKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const shouldJumpToBits =
      e.key === '/' || e.key === '.' || e.key === KEYBOARD_KEYS.ARROW_RIGHT
    if (!shouldJumpToBits) {
      return
    }
    const inputs = getNumberInputs()
    if (!inputs || inputs.length < 2) {
      return
    }
    const lastOctet = inputs[inputs.length - 2]
    if (e.target !== lastOctet) {
      return
    }
    e.preventDefault()
    focusInput(inputs[inputs.length - 1])
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const pasted = e.clipboardData.getData('text')
    if (!CIDR_PATTERN.test(pasted)) {
      return
    }
    e.preventDefault()
    const parsed = parseSubnet(pasted)
    const nextIp = parsed.ip
      .split('.')
      .map((octet) => clampPart(octet, MAX_OCTET))
      .join('.')
    const nextBits = clampPart(parsed.bits, MAX_BITS)
    setIp(nextIp)
    setBits(nextBits)
    emit(nextIp, nextBits)
  }

  return (
    <div
      ref={containerRef}
      className={styles.wrapper}
      onPaste={handlePaste}
      {...(dataTestId && { 'data-testid': dataTestId })}
    >
      {label ? (
        <span className={styles.label}>
          {label}
          {required ? <span className={styles.requiredStar}> *</span> : null}
        </span>
      ) : null}
      <div className={styles.subnetRow}>
        <div
          className={styles.ipBox}
          onKeyDown={handleOctetsKeyDown}
        >
          <IpInput
            disabled={disabled}
            onChange={handleIpChange}
            required={required}
            value={ip}
          />
        </div>
        <span className={styles.subnetSeparator}>/</span>
        <div className={clsx(styles.bitsBox, disabled && styles.disabled)}>
          <input
            className={styles.bitsInput}
            disabled={disabled}
            max={MAX_BITS}
            min={MIN_PART}
            onChange={handleBitsChange}
            onKeyDown={handleBitsKeyDown}
            type='number'
            value={bits}
          />
        </div>
      </div>
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  )
}

import React from 'react'
import clsx from 'clsx'

import { EMPTY_STRING, NOP } from 'consts'
import svgs from 'svgs'

import './NumInput.scss'

const { Arrow } = svgs

interface NumInputProps {
  max: number
  value: number
  onChange?: (val?: number) => void
  numTitle?: string
  numFocus?: { [key: string]: any }
  setNumFocus?: (state: { [key: string]: any }) => void
  initialNumState?: { [key: string]: any }
}

function NumInput({
  max,
  value,
  onChange = NOP,
  numTitle = EMPTY_STRING,
  initialNumState = {},
  numFocus = {},
  setNumFocus = NOP
}: NumInputProps) {
  const numInputClasses = clsx({
    'num-input-controller': true,
    'num-input-controller-active': numFocus[numTitle]
  })

  return (
    <div
      onBlur={() => setNumFocus({ initialNumState })}
      onFocus={() => {
        setNumFocus({ ...initialNumState, [numTitle]: true })
      }}
      className={numInputClasses}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
    >
      <input
        max={max}
        min='0'
        onFocus={(e) => e.target.select()}
        type='number'
        value={value < 10 ? `0${value}` : value}
        onChange={(e) => {
          e.target.value = parseInt(e.target.value, 10)
          const valAsNum = e.target.valueAsNumber
          const formattedVal = valAsNum > max ? max : valAsNum
          onChange(formattedVal)
        }}
      />
      <div className='arrow-buttons'>
        <Arrow
          className='rotate180'
          onClick={() => {
            onChange((value + max + 2) % (max + 1))
          }}
          onMouseDown={(e) => {
            if (e.detail > 1) {
              e.preventDefault()
            }
          }}
        />
        <Arrow
          onClick={() => {
            onChange((value + max) % (max + 1))
          }}
          onMouseDown={(e) => {
            if (e.detail > 1) {
              e.preventDefault()
            }
          }}
        />
      </div>
    </div>
  )
}

export default NumInput

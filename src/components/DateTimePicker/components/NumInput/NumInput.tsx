import React from 'react'
import classNames from 'classnames'
import { Arrow } from '../../../../svgs'
import { EMPTY_STRING, NOP } from '../../../../consts'

import './NumInput.scss'

interface NumInputProps {
  max: number
  value: number
  onChange?: (val?: number) => void
  numTitle?: string
  numFocus?: { [key: string]: any }
  setNumFocus?: (state: {[key: string]: any }) => void
  initialNumState?: { [key: string]: any }
}

function NumInput(props: NumInputProps) {
  const { max, value, onChange = NOP, numTitle = EMPTY_STRING, initialNumState = {}, numFocus = {}, setNumFocus = NOP } = props

  const numInputClasses = classNames({
    'num-input-controller': true,
    'num-input-controller-active': numFocus[numTitle]
  })

  return (
    <div
      className={numInputClasses}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      onFocus={() => {
        setNumFocus({ ...initialNumState, [numTitle]: true })
      }}
      onBlur={() => setNumFocus({ initialNumState })}
    >
      <input
        type='number'
        min='0'
        max={max}
        onFocus={(e) => e.target.select()}
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
          onMouseDown={(e) => {
            if (e.detail > 1) {
              e.preventDefault()
            }
          }}
          onClick={() => { onChange((value + max + 2) % (max + 1)) }}
        />
        <Arrow
          onMouseDown={(e) => {
            if (e.detail > 1) {
              e.preventDefault()
            }
          }}
          onClick={() => { onChange((value + max) % (max + 1)) }}
        />
      </div>

    </div>
  )
}

export default NumInput

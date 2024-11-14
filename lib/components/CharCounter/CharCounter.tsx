import React from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from '../../consts'

import './charCounter.scss'

export interface CharCounterProps {
  maxChars: number
  messageLength: number
  hideMaxChars?: boolean
  extraClass?: string
}

function CharCounter({
  maxChars,
  messageLength,
  hideMaxChars = false,
  extraClass = EMPTY_STRING
}: CharCounterProps) {
  return (
    <div
      className={clsx({
        'char-counter': true,
        [extraClass]: true,
        'char-counter-no-max': hideMaxChars
      })}
    >
      {!hideMaxChars && <div>{`max. ${maxChars} characters`}</div>}
      <div>{`${messageLength}/${maxChars} characters`}</div>
    </div>
  )
}

export default CharCounter

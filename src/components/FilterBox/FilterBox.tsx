import React from 'react'
import { Close } from '../../svgs'
import { FILTERBOXES } from '../../consts'

import './filterBox.scss'
import { startCase } from 'lodash'

interface FilterBoxProps {
  name: string
  text: string | Array<string>
  onDelete: () => void
}

function FilterBox({ name, text, onDelete }: FilterBoxProps) {
  return (
    <div className='box-filter-container' key={name}>
      <span className='filter-headline'>
        {FILTERBOXES[`${name.toUpperCase().replace(/\s/g, '')}`]}
        <Close onClick={onDelete} />
      </span>
      <span className='filter-data'>
        {Array.isArray(text)
          ? text.map((t) => startCase(t)).join(', ')
          : startCase(text)}
      </span>
    </div>
  )
}

export default FilterBox

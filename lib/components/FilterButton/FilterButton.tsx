import React from 'react'
import Button from '../Button'
import Tooltip from '../Tooltip'
import svgs from 'svgs'
import { EMPTY_STRING } from 'consts'
import clsx from 'clsx'

import './filterButton.scss'

const { Filter } = svgs

interface FilterButtonProps {
  onClick: () => void
  disable?: boolean
  extraClass?: string
  tooltipText?: string
}

function FilterButton({
  onClick,
  disable,
  extraClass = EMPTY_STRING,
  tooltipText = EMPTY_STRING
}: FilterButtonProps) {
  const btnClasses = clsx({
    [extraClass]: true,
    'filter-btn': true
  })
  return (
    <div>
      <Tooltip data={tooltipText}>
        <div>
          <Button onClick={onClick} disable={disable} extraClass={btnClasses}>
            <div className='filter-icon-wrapper'>
              <Filter className='filter-icon' />
            </div>
          </Button>
        </div>
      </Tooltip>
    </div>
  )
}

export default FilterButton

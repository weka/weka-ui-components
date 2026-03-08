import React from 'react'
import clsx from 'clsx'

import { SEVERITIES, SEVERITIES_ICONS } from 'consts'
import { useToggle } from 'hooks'

import type { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'

import './severityFilter.scss'

function SeverityFilter<Data, Value>({
  column
}: ExtendedFilterProps<Data, Value>) {
  const filterValue = column.getFilterValue()
  const [isPopperOpen, togglePopper] = useToggle(false)

  return (
    <FilterWrapper
      column={column}
      hideWrapper
      isPopperOpen={isPopperOpen}
      onTogglePopper={togglePopper}
      value={filterValue}
    >
      <div className='severity-filter'>
        <span className='heading-4'>Min. Severity</span>
        {SEVERITIES.map((severity) => {
          const Icon = SEVERITIES_ICONS[severity]
          const classes = clsx({
            'severity-wrapper': true,
            [severity.toLowerCase()]: true
          })
          return (
            <div
              key={severity}
              className={classes}
              onClick={() => {
                column.setFilterValue(severity)
                togglePopper()
              }}
            >
              <span>
                <Icon />
              </span>
              {severity}
            </div>
          )
        })}
      </div>
    </FilterWrapper>
  )
}

export default SeverityFilter

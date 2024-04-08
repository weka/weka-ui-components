import React from 'react'
import clsx from 'clsx'
import FilterWrapper from '../../FilterWrapper'
import { SEVERITIES, SEVERITIES_ICONS } from '../../../../../consts'
import useToggle from '../../../../../hooks/useToggle'
import { ExtendedFilterProps } from '../../../types'

import './severityFilter.scss'

function SeverityFilter<Data, Value>({
  column
}: ExtendedFilterProps<Data, Value>) {
  const filterValue = column.getFilterValue()
  const [isPopperOpen, togglePopper] = useToggle(false)

  return (
    <FilterWrapper
      column={column}
      value={filterValue}
      hideWrapper
      isPopperOpen={isPopperOpen}
      onTogglePopper={togglePopper}
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
              onClick={() => {
                column.setFilterValue(severity)
                togglePopper()
              }}
              className={classes}
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

import React from 'react'
import clsx from 'clsx'
import FilterWrapper from '../FilterWrapper'
import { SEVERITIES, SEVERITIES_ICONS } from '../../../../consts'
import { UseFiltersColumnProps } from 'react-table'
import useToggle from '../../../../hooks/useToggle'

import './severityFilter.scss'

interface ExtendedFiltersColumn<T extends object>
  extends UseFiltersColumnProps<T> {
  Header: string
  [key: string]: any
  byMinSeverity?: boolean
}

function SeverityFilter({ column }: ExtendedFiltersColumn<object>) {
  const { filterValue, setFilter, byMinSeverity = true } = column
  const [isPopperOpen, togglePopper] = useToggle(false)

  return (
    <FilterWrapper
      setFilter={setFilter}
      value={filterValue}
      columnTitle={byMinSeverity ? 'Min. Severity' : 'Severity'}
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
                setFilter(severity)
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

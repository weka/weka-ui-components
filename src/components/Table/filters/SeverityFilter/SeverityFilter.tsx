import classNames from 'classnames'
import React from 'react'
import FilterWrapper from '../FilterWrapper'

import { SEVERITIES, SEVERITIES_ICONS } from '../../../../consts'

import { UseFiltersColumnProps } from 'react-table'

import './severityFilter.scss'
import useToggle from '../../../../hooks/useToggle'

interface ExtendedFiltersColumn<T extends object>
  extends UseFiltersColumnProps<T> {
  fixedOptions: Array<any>
  Header: string
  id?: string
  [key: string]: any
}

function SeverityFilter({
  column: { filterValue, setFilter, Header }
}: {
  column: ExtendedFiltersColumn<object>
}) {
  const [isPopperOpen, togglePopper] = useToggle(false)

  return (
    <FilterWrapper
      setFilter={setFilter}
      value={filterValue}
      columnTitle={Header || 'Min. Severity'}
      showFilterButton={false}
      isPopperOpen={isPopperOpen}
      onTogglePopper={togglePopper}
    >
      <div className='severity-filter'>
        <span className='heading-4'>Min. Severity</span>
        {SEVERITIES.map((severity) => {
          const Icon = SEVERITIES_ICONS[severity]
          const classes = classNames({
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

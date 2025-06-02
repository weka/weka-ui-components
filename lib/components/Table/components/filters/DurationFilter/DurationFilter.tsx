import React, { useEffect, useState } from 'react'
import utils from 'utils'
import { useToggle } from 'hooks'
import { EMPTY_STRING } from 'consts'
import FilterWrapper from '../../FilterWrapper'
import Button from '../../../../Button'
import { TextField } from '../../../../inputs'
import Select from '../../../../inputs/Select'
import { ExtendedFilterProps } from '../../../types'

import './durationFilter.scss'

export type DurationFilterOptions = {
  enableCustomFormat?: boolean
  customFormat?: string
  timezone?: string
}

export interface DurationFilterValue {
  operator: '>' | '<' | '='
  duration?: string
}

export const isDurationFilterValue = (obj: unknown) => {
  return !!(utils.isObject(obj) && ('operator' in obj || 'duration' in obj))
}

function DurationFilter<Data>({
  column
}: ExtendedFilterProps<Data, DurationFilterValue, DurationFilterOptions>) {
  const filterValue = column.getFilterValue()

  const [operator, setOperator] = useState<DurationFilterValue['operator']>(
    filterValue?.operator || '='
  )
  const [duration, setDuration] = useState(filterValue?.duration || undefined)

  const [isFilterOpen, toggleIsFilterOpen] = useToggle(false)

  useEffect(() => {
    if (!filterValue) {
      setOperator('=')
      setDuration(undefined)
    }
  }, [filterValue])

  return (
    <FilterWrapper
      column={column}
      hideWrapper
      isPopperOpen={isFilterOpen}
      onTogglePopper={toggleIsFilterOpen}
    >
      <div className='duration-filter-wrapper'>
        <div className='duration-filter-inputs'>
          <Select
            value={operator}
            onChange={(value) =>
              setOperator(value as DurationFilterValue['operator'])
            }
            options={[
              { value: '>', label: '>' },
              { value: '<', label: '<' },
              { value: '=', label: '=' }
            ]}
          />
          <TextField
            onChange={setDuration}
            value={duration}
            label={EMPTY_STRING}
          />
        </div>
        <div className='duration-filter-controller'>
          <Button
            disable={!duration}
            onClick={() => {
              column.setFilterValue({
                operator,
                duration
              })
              toggleIsFilterOpen()
            }}
          >
            Filter
          </Button>
        </div>
      </div>
    </FilterWrapper>
  )
}

export default DurationFilter

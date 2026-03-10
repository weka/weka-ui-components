import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EMPTY_STRING, EVENT_KEYS } from 'consts'
import { useToggle } from 'hooks'
import utils from 'utils'

import Button from '../../../../Button'
import { TextField } from '../../../../inputs'
import Select from '../../../../inputs/Select'
import Tooltip from '../../../../Tooltip'
import type { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'

import './durationFilter.scss'

export const COMPARE_OPERATORS = {
  '>': '>',
  '<': '<',
  '=': '='
} as const

export type CompareOperator = keyof typeof COMPARE_OPERATORS

export interface DurationFilterValue {
  operator: CompareOperator
  duration?: string
}

export const isDurationFilterValue = (
  obj: unknown
): obj is { operator: string; duration: string } =>
  utils.isObject(obj) && ('operator' in obj || 'duration' in obj)

function DurationFilter<Data>({
  column
}: ExtendedFilterProps<Data, DurationFilterValue>) {
  const filterValue = column.getFilterValue() as DurationFilterValue

  const [operator, setOperator] = useState<DurationFilterValue['operator']>(
    filterValue?.operator || COMPARE_OPERATORS['=']
  )
  const [duration, setDuration] = useState(
    filterValue?.duration || EMPTY_STRING
  )

  const [isFilterOpen, toggleIsFilterOpen] = useToggle(false)

  useEffect(() => {
    setOperator(filterValue?.operator || COMPARE_OPERATORS['='])
    setDuration(filterValue?.duration || EMPTY_STRING)
  }, [filterValue])

  const handleFilterApply = useCallback(() => {
    column.setFilterValue({ operator, duration })
    toggleIsFilterOpen()
  }, [column, operator, duration, toggleIsFilterOpen])

  const operatorOptions = useMemo(
    () => Object.values(COMPARE_OPERATORS).map(utils.formatStringOption),
    []
  )

  return (
    <FilterWrapper
      column={column}
      hideWrapper
      isPopperOpen={isFilterOpen}
      onTogglePopper={toggleIsFilterOpen}
    >
      <div className='duration-filter-wrapper'>
        <Tooltip data='Enter duration value in format: 1y 2mon 3w 4d 5h 6min 7sec'>
          <div>
            <div className='duration-filter-inputs'>
              <Select
                options={operatorOptions}
                value={operator}
                onChange={(value) =>
                  setOperator(value as DurationFilterValue['operator'])
                }
              />
              <TextField
                label={EMPTY_STRING}
                onChange={setDuration}
                value={duration}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === EVENT_KEYS.ENTER) {
                    handleFilterApply()
                  }
                }}
              />
            </div>
            <div className='duration-filter-controller'>
              <Button
                disable={!duration}
                onClick={handleFilterApply}
              >
                Filter
              </Button>
            </div>
          </div>
        </Tooltip>
      </div>
    </FilterWrapper>
  )
}

export default DurationFilter

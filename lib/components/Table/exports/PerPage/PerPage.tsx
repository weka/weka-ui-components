import type { Dispatch, SetStateAction } from 'react'
import React from 'react'

import { PER_PAGE_OPTIONS } from 'consts'

import Select from '../../../inputs/Select'

import './perPage.scss'

interface PerPageProps {
  value: string | number
  onChange: ((val: string | number) => void) | Dispatch<SetStateAction<number>>
  options?: typeof PER_PAGE_OPTIONS
}

function PerPage({
  value,
  onChange,
  options = PER_PAGE_OPTIONS
}: PerPageProps) {
  return (
    <div className='per-page'>
      <Select
        onChange={onChange}
        options={options}
        value={value}
        wrapperClass='per-page-select'
      />
      <span>per page</span>
    </div>
  )
}

export default PerPage

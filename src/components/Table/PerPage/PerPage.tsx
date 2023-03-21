import React from 'react'
import Select from '../../inputs/Select'
import { PER_PAGE_OPTIONS } from '../../../consts'

import './perPage.scss'

interface PerPageProps {
  value: string | number
  onChange: (val: string | number) => void
  options?: Option[]
}

function PerPage({
  value,
  onChange,
  options = PER_PAGE_OPTIONS
}: PerPageProps) {
  return (
    <div className='per-page'>
      <Select
        value={value}
        options={options}
        wrapperClass='per-page-select'
        onChange={onChange}
      />
      <span>per page</span>
    </div>
  )
}

export default PerPage

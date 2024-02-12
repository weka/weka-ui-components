import React from 'react'
import { components, MultiValueRemoveProps } from 'react-select'

import './multiValueRemove.scss'

function MultiValueRemove(props: MultiValueRemoveProps<Option>) {
  return props.data.isUnremovable ? (
    <div className='react-select__multi-value__remove__unremovable' />
  ) : (
    <components.MultiValueRemove {...props} />
  )
}

export default MultiValueRemove

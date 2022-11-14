import React from 'react'
import propTypes from 'prop-types'
import { components } from 'react-select'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'

import './clearIndicator.scss'

function ClearIndicator(props) {
  const { selectProps } = props

  return (
    <Tooltip data={selectProps.clearText || EMPTY_STRING}>
      <div>
        <components.ClearIndicator {...props} />
      </div>
    </Tooltip>
  )
}

ClearIndicator.propTypes = { selectProps: propTypes.object.isRequired }

export default ClearIndicator

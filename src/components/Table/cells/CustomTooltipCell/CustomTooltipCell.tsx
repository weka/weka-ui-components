import React from 'react'
import propTypes from 'prop-types'
import { Tooltip } from '@weka.io/weka-ui-components'
import { EMPTY_STRING } from '../../../../utils/consts'

import './customTooltipCell.scss'

function CustomTooltipCell({ value, tooltipData }) {
  return (
    <Tooltip data={tooltipData}>
      <span>
        {value}
      </span>
    </Tooltip>
  )
}

CustomTooltipCell.defaultProps = { tooltipData: EMPTY_STRING }

CustomTooltipCell.propTypes = {
  value: propTypes.string.isRequired,
  tooltipData: propTypes.string
}

export default CustomTooltipCell

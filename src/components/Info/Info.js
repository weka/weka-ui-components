import React from 'react'
import propTypes from 'prop-types'
import Tooltip from '../Tooltip'
import { Info as InfoSvg } from '../../svgs'

import './info.scss'

function Info({ data }) {
  return (
    <Tooltip
      data={data}
      placement='right'
    >
      <InfoSvg className='component-info' />
    </Tooltip>
  )
}

Info.propTypes = { data: propTypes.oneOfType([propTypes.string, propTypes.element]).isRequired }

export default Info

import React, {ReactElement} from 'react'
import Tooltip from '../Tooltip'
import { Info as InfoSvg } from '../../svgs'

import './info.scss'

interface InfoProps {
  data: ReactElement | string
}
function Info({ data }: InfoProps) {
  return (
    <Tooltip
      data={data}
      placement='right'
    >
      <InfoSvg className='component-info' />
    </Tooltip>
  )
}
export default Info

import React, { ReactElement } from 'react'
import Tooltip from '../Tooltip'
import { Info as InfoSvg } from '../../svgs'
import classNames from 'classnames'

import './info.scss'

interface InfoProps {
  data: ReactElement | string
  extraClass?: string
}
function Info({ data, extraClass }: InfoProps) {
  return (
    <Tooltip
      data={data}
      placement='right'
    >
      <InfoSvg className={classNames('component-info', extraClass)} />
    </Tooltip>
  )
}
export default Info

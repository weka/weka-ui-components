import React, { ReactElement } from 'react'
import Tooltip from '../Tooltip'
import { Info as InfoSvg } from 'svgs'
import clsx from 'clsx'

import './info.scss'

export interface InfoProps {
  data: ReactElement | string
  extraClass?: string
}

function Info({ data, extraClass }: InfoProps) {
  return (
    <Tooltip data={data}>
      <InfoSvg className={clsx('component-info', extraClass)} />
    </Tooltip>
  )
}

export default Info

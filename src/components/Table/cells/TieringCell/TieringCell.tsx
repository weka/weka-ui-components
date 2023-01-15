import React from 'react'
import CircularProgress from '../../../CircularProgress'
import Tooltip from '../../../Tooltip'
import { OBS_IS_DETACHING, OBS_MODES } from '../../../../consts'
import { RemoteTiering, Tiering } from '../../../../svgs'
import { CustomCellProps } from '../../Table'

import './tieringCell.scss'

type TieringValue = {
  mode: string
  name: string
  state: string
  detachProgress: number | null
  [key: string]: any
}

function getSVG({ mode, name, state, detachProgress = 0 }: TieringValue) {
  if (state === OBS_IS_DETACHING) {
    return (
      <Tooltip data='Object Store Bucket is being detached' key={name}>
        <div>
          <CircularProgress progress={typeof detachProgress === 'number' ? detachProgress : undefined} />
        </div>
      </Tooltip>
    )
  }
  const Icon = mode === OBS_MODES.REMOTE ? RemoteTiering : Tiering
  return <Icon key={name} className={mode.toLowerCase()} />
}

function TieringCell({ cell }: CustomCellProps) {
  const { value } = cell
  return (
    <div className='tiering-cell'>
      {value.map((val: TieringValue) => getSVG(val))}
    </div>
  )
}

export default TieringCell

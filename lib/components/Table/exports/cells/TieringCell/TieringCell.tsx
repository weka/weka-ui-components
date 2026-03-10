import React from 'react'

import { OBS_IS_DETACHING, OBS_MODES } from 'consts'
import svgs from 'svgs'

import CircularProgress from '../../../../CircularProgress'
import Tooltip from '../../../../Tooltip'
import type { ExtendedCellProps } from '../../../types'

import './tieringCell.scss'

const { RemoteTiering, Tiering } = svgs

type TieringValue = {
  mode: string
  name: string
  state: string
  detachProgress: number | null
}

export type TieringCellValue = TieringValue[]

function getSVG({ mode, name, state, detachProgress = 0 }: TieringValue) {
  if (state === OBS_IS_DETACHING) {
    return (
      <Tooltip
        key={name}
        data='Object Store Bucket is being detached'
      >
        <div>
          <CircularProgress
            progress={
              typeof detachProgress === 'number' ? detachProgress : undefined
            }
          />
        </div>
      </Tooltip>
    )
  }
  const Icon = mode === OBS_MODES.REMOTE ? RemoteTiering : Tiering
  return (
    <Icon
      key={name}
      className={mode.toLowerCase()}
    />
  )
}

function TieringCell<Data>({
  cell,
  customValue
}: ExtendedCellProps<Data, TieringCellValue>) {
  const value = customValue !== undefined ? customValue : cell.getValue()

  return <div className='tiering-cell'>{value.map((val) => getSVG(val))}</div>
}

export default TieringCell

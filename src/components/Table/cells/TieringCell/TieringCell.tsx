import React from 'react'
import propTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { CircularProgress, Tooltip } from '@weka.io/weka-ui-components'
import { NAMESPACES, OBS_IS_DETACHING, OBS_MODES } from '../../../../utils/consts'
import SVGS from '../../../../static/svgs'

import './tieringCell.scss'

function getSVG({ mode, name, state, detachProgress }, t) {
  if (state === OBS_IS_DETACHING) {
    return (
      <Tooltip data={t(`${NAMESPACES.FILESYSTEMS}:FS_OBS_BUCKET_IS_DETACHED`)} key={name}>
        <div>
          <CircularProgress progress={detachProgress} />
        </div>
      </Tooltip>
    )
  }
  const Icon = mode === OBS_MODES.REMOTE ? SVGS.RemoteTiering : SVGS.Tiering
  return <Icon key={name} className={mode.toLowerCase()} />
}

function TieringCell({ cell }) {
  const { t } = useTranslation([NAMESPACES.FILESYSTEMS])
  const { value } = cell
  return (
    <div className='tiering-cell'>
      {value.map((val) => getSVG(val, t))}
    </div>
  )
}

TieringCell.propTypes = { cell: propTypes.object.isRequired }

export default TieringCell

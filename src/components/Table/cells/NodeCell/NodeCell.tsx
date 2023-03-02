import React from 'react'
import { CustomCellProps } from '../../Table'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING, SHORT_ROLES } from '../../../../consts'
import classNames from 'classnames'

import './nodeCell.scss'

function NodeCell({ cell }: CustomCellProps) {
  const { value } = cell
  const { nid, isBackend, roles } = value

  const isBackendClasses = classNames({
    'is-backend': isBackend,
    'is-client': !isBackend
  })

  return (
    <div>
      <span>{nid} </span>
      {isBackend && (
        <span>
        {roles.length ? `(${roles?.reduce((acc: Array<string>, role: string) => {
          SHORT_ROLES[role] ? acc.push(SHORT_ROLES[role]) : acc.push(role)
          return acc
        }, []).join(', ')}) `: EMPTY_STRING}
      </span>)}
      <Tooltip data={isBackend ? 'Backend' : 'Client'}>
        <span className={isBackendClasses}>{isBackend ? '(B)' : ' (C)'}</span>
      </Tooltip>
    </div>
  )
}

export default NodeCell

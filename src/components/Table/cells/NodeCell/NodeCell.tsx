import React from 'react'
import { CustomCellProps } from '../../Table'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING, SHORT_ROLES } from '../../../../consts'
import clsx from 'clsx'

import './nodeCell.scss'

function NodeCell({ cell }: CustomCellProps) {
  const { value } = cell
  const { nid, isBackend, roles } = value

  const isBackendClasses = clsx({
    'is-backend': isBackend,
    'is-client': !isBackend
  })

  const formattedRoles = roles?.length
    ? `(${roles
        ?.reduce((acc: Array<string>, role: string) => {
          SHORT_ROLES[role] ? acc.push(SHORT_ROLES[role]) : acc.push(role)
          return acc
        }, [])
        .join(', ')}) `
    : EMPTY_STRING

  return (
    <Tooltip data={`${nid} ${formattedRoles} (${isBackend ? 'Backend' : 'Client'})`}>
      <div className='node-cell'>
        <span>{nid} </span>
        {isBackend && <span>{formattedRoles}</span>}
        <span className={isBackendClasses}>{isBackend ? '(B)' : ' (C)'}</span>
      </div>
    </Tooltip>
  )
}

export default NodeCell

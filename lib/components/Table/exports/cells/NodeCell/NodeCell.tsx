import React from 'react'
import clsx from 'clsx'

import { EMPTY_STRING, SHORT_ROLES } from 'consts'

import Tooltip from '../../../../Tooltip'
import type { ExtendedCellProps } from '../../../types'

import './nodeCell.scss'

export type NodeCellValue = {
  nid: string
  isBackend: boolean
  showIsBackend: boolean
  roles?: string[]
}

function NodeCell<Data>({
  cell,
  customValue
}: ExtendedCellProps<Data, NodeCellValue>) {
  const value = customValue !== undefined ? customValue : cell.getValue()

  const { nid, isBackend, showIsBackend, roles } = value

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
    <Tooltip
      data={`${nid} ${formattedRoles} ${
        showIsBackend ? (isBackend ? '(Backend)' : '(Client)') : EMPTY_STRING
      }`}
    >
      <div className='node-cell'>
        <span>{nid} </span>
        {isBackend ? <span>{formattedRoles}</span> : null}
        {showIsBackend ? (
          <span className={isBackendClasses}>{isBackend ? '(B)' : ' (C)'}</span>
        ) : null}
      </div>
    </Tooltip>
  )
}

export default NodeCell

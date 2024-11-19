import React from 'react'
import Tooltip from '../../../../Tooltip'
import { EMPTY_STRING, SHORT_ROLES } from '~consts'
import clsx from 'clsx'

import './nodeCell.scss'
import { ExtendedCellProps } from '../../../types'

export type NodeCellValue = {
  nid: string
  isBackend: boolean
  showIsBackend: boolean
  roles?: string[]
}

function NodeCell<Data>(props: ExtendedCellProps<Data, NodeCellValue>) {
  const { cell, customValue } = props

  const value = customValue !== undefined ? customValue : cell.getValue()

  const { nid, isBackend, showIsBackend, roles } = value

  const isBackendClasses = clsx({
    'is-backend': isBackend,
    'is-client': isBackend
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
        {isBackend && <span>{formattedRoles}</span>}
        {showIsBackend && (
          <span className={isBackendClasses}>{isBackend ? '(B)' : ' (C)'}</span>
        )}
      </div>
    </Tooltip>
  )
}

export default NodeCell

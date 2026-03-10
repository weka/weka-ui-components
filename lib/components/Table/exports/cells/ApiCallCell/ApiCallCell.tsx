import React, { useEffect, useState } from 'react'

import { EMPTY_STRING } from 'consts'

import SpanTooltip from '../../../../SpanTooltip'
import Spinner from '../../../../Spinner'
import type { ExtendedCell, ExtendedCellProps } from '../../../types'

export interface ApiCallCellOptions<Data, Value> {
  apiCall: (cell: ExtendedCell<Data, Value>) => Promise<string>
  errorText: string
}

export type ApiCallCellValue = never

export const ApiCallCellName = 'ApiCallCell'

function ApiCallCell<Data>({
  cell
}: ExtendedCellProps<Data, ApiCallCellValue>) {
  const cellDef = cell.column.columnDef.meta?.cell
  if (!cellDef || cellDef.type !== ApiCallCellName) {
    throw new Error(
      `${ApiCallCellName}: cell options are missing or the type is incorrect`
    )
  }

  const { apiCall, errorText } = cellDef.options

  const [state, setState] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    function getData(attempt = 0) {
      apiCall(cell)
        .then((res) => {
          setState(res)
          setLoading(false)
        })
        .catch(() => {
          if (attempt < 2) {
            setTimeout(() => getData(attempt + 1), (attempt + 1) * 3000)
          } else {
            setError(errorText)
            setLoading(false)
          }
        })
    }
    getData()
  }, [])

  return isLoading ? (
    <Spinner />
  ) : (
    <SpanTooltip>{error ?? state ?? EMPTY_STRING}</SpanTooltip>
  )
}

export default ApiCallCell

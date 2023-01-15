import React, { useEffect, useState } from 'react'
import SpanTooltip from '../../../SpanTooltip'
import Spinner from '../../../Spinner'
import {CellProps, ColumnInstance, UseRowStateCellProps, UseRowStateLocalState} from 'react-table'

interface ExtendedCellProps<T extends object> extends CellProps<T>, UseRowStateCellProps<T> {
  state: UseRowStateLocalState<T>
}

interface ExtendedColumn extends ColumnInstance {
  apiCall: (value: any) => Promise<{[key: string]: any}>
  propertyKey: string
  errorText: string
}

interface ApiCallCellProps {
  cell: ExtendedCellProps<object>
}

function ApiCallCell({ cell }: ApiCallCellProps) {
  const { value, column, state, setState } = cell
  const { apiCall, propertyKey, errorText } = column as ExtendedColumn
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    function getData(attempt = 0) {
      apiCall(value)
        .then((res: {[key: string]: any}) => {
          setState(res[propertyKey])
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

  return (
    isLoading
      ? <Spinner />
      : (
        <SpanTooltip>
          {error || state}
        </SpanTooltip>
      )
  )
}

export default ApiCallCell

import React, { useEffect, useState } from 'react'
import { SpanTooltip } from '@weka.io/weka-ui-components'
import propTypes from 'prop-types'
import Spinner from '../../../Spinner'

import './apiCallCell.scss'

function ApiCallCell({ cell }) {
  const { value, column: { apiCall, propertyKey, errorText }, state, setState } = cell
  const [error, setError] = useState<string>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    function getData(attempt = 0) {
      apiCall(value)
        .then((res) => {
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

ApiCallCell.propTypes = { cell: propTypes.object.isRequired }

export default ApiCallCell

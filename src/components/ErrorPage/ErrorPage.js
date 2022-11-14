import React from 'react'
import propTypes from 'prop-types'
import { GENERAL_ERROR } from '../../consts'

import './errorPage.scss'

function ErrorPage({ error }) {
  return (
    <div className='error-page-wrapper data-important'>
      <span>
        {error}
      </span>
    </div>
  )
}

ErrorPage.defaultProps = { error: GENERAL_ERROR }

ErrorPage.propTypes = { error: propTypes.oneOfType([propTypes.string, propTypes.element]) }

export default ErrorPage

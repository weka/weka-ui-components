import React from 'react'
import propTypes from 'prop-types'

import './emptyPageMessage.scss'

function EmptyPageMessage({ children }) {
  return (
    <div className='empty-page-message'>
      {children}
    </div>
  )
}

EmptyPageMessage.propTypes = { children: propTypes.any.isRequired }

export default EmptyPageMessage

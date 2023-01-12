import React from 'react'
import propTypes from 'prop-types'

import './encryptedCell.scss'

function IconCell({ cell }) {
  const { value, column: { Icon } } = cell
  return (
    <div className='encrypted-cell'>
      {value && <Icon />}
    </div>
  )
}

IconCell.propTypes = { cell: propTypes.object.isRequired }

export default IconCell

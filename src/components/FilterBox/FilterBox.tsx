import React from 'react'
import { useTranslation } from 'react-i18next'
import propTypes from 'prop-types'
import SVGS from '../../static/svgs'
import { NAMESPACES } from '../../utils/consts'

import './filterBox.scss'

function FilterBox({ name, text, onDelete }) {
  const { t } = useTranslation([NAMESPACES.FILTERBOXES])
  return (
    <div className='box-filter-container' key={name}>
      <span className='filter-headline'>
        {t(`${NAMESPACES.FILTERBOXES}:${name.toUpperCase().replace(/\s/g, '')}`)}
        <SVGS.Close onClick={onDelete} />
      </span>
      <span className='filter-data'>
        {Array.isArray(text) ? text.join(', ') : text}
      </span>
    </div>
  )
}

FilterBox.propTypes = {
  name: propTypes.string.isRequired,
  text: propTypes.oneOfType([propTypes.string, propTypes.array]).isRequired,
  onDelete: propTypes.func.isRequired
}

export default FilterBox

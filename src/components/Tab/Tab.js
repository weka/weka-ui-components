import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { EMPTY_STRING } from '../../consts'

import './tab.scss'

function Tab({ title, subComponent, active, setActive, wrapperClass, disabled, isSideTab }) {
  const cls = classNames({
    'custom-tab': true,
    'custom-tab-side': isSideTab,
    'tab-active': active,
    [wrapperClass]: true,
    disabled
  })
  return (
    <div className={cls} onClick={setActive}>
      <div className='tab-title'>
        {title}
      </div>
      {subComponent}
    </div>
  )
}

Tab.defaultProps = { subComponent: null, wrapperClass: EMPTY_STRING, disabled: false, isSideTab: false }

Tab.propTypes = {
  title: propTypes.oneOfType([propTypes.string, propTypes.element]).isRequired,
  active: propTypes.bool.isRequired,
  disabled: propTypes.bool,
  wrapperClass: propTypes.string,
  setActive: propTypes.func.isRequired,
  subComponent: propTypes.object,
  isSideTab: propTypes.bool
}

export default Tab

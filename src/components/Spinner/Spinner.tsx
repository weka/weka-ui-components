import React from 'react'
import classNames from 'classnames'

import './spinner.scss'

// eslint-disable-next-line react/prop-types
function Spinner({ light }) {
  const cls = classNames({
    light,
    spinner: true,
    center: true
  })
  return (
    <div className={cls}>
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
      <div className='spinner-blade' />
    </div>
  )
}

export default Spinner

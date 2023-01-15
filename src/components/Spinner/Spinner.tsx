import React from 'react'
import classNames from 'classnames'

import './spinner.scss'

interface SpinnerProps {
  light?: string
}
function Spinner({ light }: SpinnerProps) {
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

import React from 'react'
import clsx from 'clsx'
import './loader.scss'

interface LoaderProps {
  extraClass?: string
}

function Loader({ extraClass }: LoaderProps) {
  return (
    <div className={clsx('loader-wrapper', extraClass)}>
      <div className='loading-bar'>
        <div className='fill-bar' />
      </div>
    </div>
  )
}

export default Loader

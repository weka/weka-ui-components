import React from 'react'

import './emptyPageMessage.scss'

interface EmptyPageMessageProps {
  children: any
}
function EmptyPageMessage({ children }: EmptyPageMessageProps) {
  return (
    <div className='empty-page-message'>
      {children}
    </div>
  )
}


export default EmptyPageMessage

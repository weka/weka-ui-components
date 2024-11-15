import React, { ReactNode } from 'react'
import { GENERAL_ERROR } from 'consts'

import './errorPage.scss'

interface ErrorPageProps {
  error?: ReactNode | string
}
function ErrorPage({ error = GENERAL_ERROR }: ErrorPageProps) {
  return (
    <div className='error-page-wrapper data-important'>
      <span>{error}</span>
    </div>
  )
}
export default ErrorPage

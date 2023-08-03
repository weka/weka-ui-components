import React, { ReactElement } from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from '../../consts'
import { Link } from 'react-router-dom'

import './tab.scss'

interface TabProps {
  title: ReactElement | string
  active: boolean
  disabled?: boolean
  wrapperClass?: string
  setActive: () => void
  subComponent?: ReactElement | null
  isSideTab?: boolean
  isSubTab?: boolean
  navigateTo?: string
}

function Tab(props: TabProps) {
  const {
    title,
    subComponent = null,
    active,
    setActive,
    wrapperClass = EMPTY_STRING,
    disabled = false,
    isSideTab = false,
    isSubTab = false,
    navigateTo
  } = props
  const cls = clsx({
    'custom-tab': true,
    'custom-tab-side': isSideTab,
    'custom-tab-sub': isSubTab,
    'tab-active': active,
    [wrapperClass]: true,
    disabled
  })

  const tabContent = (
    <div className={cls} onClick={setActive}>
      <div className='tab-title'>{title}</div>
      {subComponent}
    </div>
  )

  return navigateTo ? (
    <Link to={navigateTo} className='link-tab'>
      {tabContent}
    </Link>
  ) : (
    <>{tabContent}</>
  )
}
export default Tab

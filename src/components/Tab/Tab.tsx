import React, { ReactElement } from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from '../../consts'
import { Link } from 'react-router-dom'
import Tooltip from '../Tooltip'
import { Info } from '../../svgs'

import './tab.scss'

interface TabProps {
  title: ReactElement | string
  active: boolean
  disabled?: boolean
  wrapperClass?: string
  setActive?: () => void
  subComponent?: ReactElement | null
  isSideTab?: boolean
  isSubTab?: boolean
  navigateTo?: string
  info?: string
  hasIncompleteFields?: boolean
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
    navigateTo,
    info,
    hasIncompleteFields
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
      {info && (
        <Tooltip data={info}>
          <Info className='tab-info' />
        </Tooltip>
      )}
      <div className='tab-title'>
        {title}
        {hasIncompleteFields && (
          <span className='required-star tab-title-required-star'>*</span>
        )}
      </div>
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

import React, {ReactElement} from 'react'
import classNames from 'classnames'
import {EMPTY_STRING} from '../../consts'

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
}

function Tab(
    {
        title,
        subComponent = null,
        active,
        setActive,
        wrapperClass = EMPTY_STRING,
        disabled = false,
        isSideTab = false,
        isSubTab = false
    }: TabProps) {
    const cls = classNames({
        'custom-tab': true,
        'custom-tab-side': isSideTab,
        'custom-tab-sub': isSubTab,
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
export default Tab

import React, {ReactElement} from 'react'
import classNames from 'classnames'
import {EMPTY_STRING} from '../../consts'

import './tab.scss'

interface TabProps {
    title: ReactElement | string,
    active: boolean,
    disabled?: boolean,
    wrapperClass?: string,
    setActive: () => void,
    subComponent?: ReactElement | null,
    isSideTab?: boolean
}

function Tab(
    {
        title,
        subComponent = null,
        active,
        setActive,
        wrapperClass = EMPTY_STRING,
        disabled = false,
        isSideTab = false
    }: TabProps) {
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
export default Tab

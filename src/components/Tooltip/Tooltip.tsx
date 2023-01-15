import React, {ReactElement} from 'react'
import {Tooltip as MuiTooltip} from '@mui/material'
import classNames from 'classnames'
import {EMPTY_STRING} from '../../consts'

import './tooltip.scss'

interface TooltipProps {
    children: ReactElement,
    clear?: boolean,
    data?: ReactElement | string,
    extraClass?: string
    [key: string]: any
}

function Tooltip({ children, clear = false, data = EMPTY_STRING, extraClass = EMPTY_STRING, ...rest}: TooltipProps) {
    const classes = classNames({
        'tooltip-wrapper': true,
        'clear-tooltip': clear,
        [extraClass]: true
    })
    return (
        <MuiTooltip
            enterNextDelay={400}
            enterDelay={400}
            title={data}
            classes={{tooltip: classes, arrow: 'tooltip-arrow'}}
            placement='top'
            arrow
            {...rest}
        >
            {children}
        </MuiTooltip>
    )
}
export default Tooltip

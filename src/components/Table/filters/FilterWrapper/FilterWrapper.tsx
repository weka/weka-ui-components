import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import propTypes from 'prop-types'
import { Button, Tooltip } from '@weka.io/weka-ui-components'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import SVGS from '../../../../static/svgs'
import useKeyEvent from '../../../../hooks/useKeyEvent'
import useToggle from '../../../../hooks/useToggle'
import Utils from '../../../../utils/utils'
import { EMPTY_STRING, NAMESPACES } from '../../../../utils/consts'

import './filterWrapper.scss'

function FilterWrapper({ setFilter, value, children, columnTitle }) {
  const [isPopperOpen, togglePopper] = useToggle(false)
  const anchor = useRef(null)
  const ref = useRef(null)
  useKeyEvent(ref, 'Enter', onClick)
  const isDisable = Utils.isEmpty(value) || (Utils.isString(value) && value?.trim().length === 0)
  const { t } = useTranslation([NAMESPACES.GENERAL])

  function onClick() {
    if (!isDisable) {
      setFilter(value)
      togglePopper()
    }
  }

  return (
    <div className='filter-table-wrapper'>
      <Tooltip data={t(`${NAMESPACES.GENERAL}:FILTER_BY`, { filterName: `${columnTitle.charAt(0).toUpperCase()}${columnTitle.slice(1)}` })}>
        <span
          onClick={togglePopper}
          ref={anchor}
        >
          <SVGS.Filter />
        </span>
      </Tooltip>

      {isPopperOpen && (
        <Popper open={isPopperOpen} anchorEl={anchor.current} transition className='popper-wrapper'>
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'center top' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={togglePopper}>
                  <div className='filter-table-wrapper-data'>
                    <div className='filter-table-wrapper-inside-filter' ref={ref}>
                      {children}
                    </div>
                    <div className='filter-table-wrapper-btn'>
                      <Button
                        disable={isDisable}
                        onClick={onClick}
                      >
                        {t(`${NAMESPACES.GENERAL}:FILTER`)}
                      </Button>
                    </div>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </div>
  )
}

FilterWrapper.defaultProps = { value: null, columnTitle: EMPTY_STRING }

FilterWrapper.propTypes = {
  setFilter: propTypes.func.isRequired,
  children: propTypes.element.isRequired,
  value: propTypes.any,
  columnTitle: propTypes.string
}

export default FilterWrapper

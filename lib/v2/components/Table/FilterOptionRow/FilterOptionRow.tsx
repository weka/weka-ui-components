import type { ReactNode } from 'react'

import clsx from 'clsx'

import { highlightText } from '#v2/utils/textUtils'

import { Checkbox } from '../../CheckBox'
import { Tooltip } from '../../Tooltip'

import styles from './filterOptionRow.module.scss'

export interface FilterOptionRowProps {
  label: string
  subLabel?: string
  isSelected: boolean
  isHovered?: boolean
  onChange: (checked: boolean) => void
  chipElement?: ReactNode
  searchQuery?: string
  shouldHighlightMatches?: boolean
  dataOptionIndex?: number
  dataTestId?: string
  disabled?: boolean
}

const HIGHLIGHT_ELEMENT = 'span'

export function FilterOptionRow({
  label,
  subLabel,
  isSelected,
  isHovered = false,
  chipElement,
  onChange,
  searchQuery,
  shouldHighlightMatches = false,
  dataOptionIndex,
  dataTestId,
  disabled = false
}: Readonly<FilterOptionRowProps>) {
  const renderLabel = () => {
    if (shouldHighlightMatches && searchQuery) {
      return highlightText(
        label,
        searchQuery,
        HIGHLIGHT_ELEMENT,
        styles.highlight
      )
    }
    return <span>{label}</span>
  }

  return (
    <div
      data-option-index={dataOptionIndex}
      {...(dataTestId && { 'data-testid': dataTestId })}
      tabIndex={disabled ? -1 : 0}
      className={clsx(styles.filterOptionWrapper, {
        [styles.hovered]: isHovered && !disabled,
        [styles.disabled]: disabled
      })}
      onClick={(e) => {
        e.stopPropagation()
        if (disabled) {
          return
        }
        onChange(isSelected)
      }}
    >
      <Checkbox
        checked={isSelected}
        disabled={disabled}
        onChange={onChange}
      />
      {chipElement ? (
        <div className={styles.checkboxLabel}>{chipElement}</div>
      ) : (
        <>
          <Tooltip
            data={label}
            ellipsis
            ellipsisClass={styles.checkboxLabel}
            extraClass={styles.tooltipContent}
            extraPopperClass={styles.tooltipPopper}
          >
            {renderLabel()}
          </Tooltip>
          {subLabel ? (
            <div className={styles.optionSublabel}>
              <Tooltip
                data={subLabel}
                ellipsis
                extraClass={styles.tooltipContent}
                extraPopperClass={styles.tooltipPopper}
              >
                {subLabel}
              </Tooltip>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

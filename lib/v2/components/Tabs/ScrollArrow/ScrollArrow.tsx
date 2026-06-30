import clsx from 'clsx'

import { CSS_VARS } from '#v2/utils/consts'

import { NavChevronLeftIcon, NavChevronRightIcon } from '../../../icons'
import { SCROLL_DIRECTIONS, type ScrollDirection } from '../tabsConstants'

import styles from '../tabs.module.scss'

const ARROW_SIZE = 18

interface ScrollArrowProps {
  direction: ScrollDirection
  onClick: () => void
  disabled?: boolean
}

export function ScrollArrow({
  direction,
  onClick,
  disabled = false
}: Readonly<ScrollArrowProps>) {
  return (
    <button
      aria-label={`Scroll ${direction}`}
      disabled={disabled}
      onClick={onClick}
      type='button'
      className={clsx(styles.scrollArrowBtn, {
        [styles.disabled]: disabled
      })}
    >
      {direction === SCROLL_DIRECTIONS.LEFT ? (
        <NavChevronLeftIcon
          color={CSS_VARS.GRAY_900_100}
          height={ARROW_SIZE}
          width={ARROW_SIZE}
        />
      ) : (
        <NavChevronRightIcon
          color={CSS_VARS.GRAY_900_100}
          height={ARROW_SIZE}
          width={ARROW_SIZE}
        />
      )}
    </button>
  )
}

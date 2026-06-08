import type { CustomFilters } from '../FilterPopover'
import type { ActiveFilter } from '../filterUtils'
import type { NumRangeFilterType } from '../NumberRange'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import { useWindowResize } from '#v2/hooks'
import { ANY_LABEL, FILTER_TYPES } from '#v2/utils/consts'

import { ARROW_DIRECTIONS, ArrowIcon, CloseRoundedIcon } from '../../../icons'
import { Tooltip } from '../../Tooltip'
import { findColumn, normalizeFilterOptions } from '../filterUtils'
import {
  type FilterValueResult,
  formatDatetimeFilter,
  formatMultiselectFilter,
  PIXELS_PER_CHARACTER,
  SCROLL_AMOUNT
} from './filterChipsUtils'

import styles from './filterChips.module.scss'

const OVERFLOW_CHECK_DELAY_MS = 100
const SCROLL_EPSILON = 1
const NAV_ARROW_SIZE = 16
const EXPAND_ARROW_SIZE = 12

export interface FilterChipsProps {
  activeFilters: readonly ActiveFilter[]
  onRemoveFilter: (columnId: string) => void
  onClearAllFilters: () => void
  customFilters?: CustomFilters
  columns?: readonly unknown[]
}

/**
 * Resolve multiselect values to their option labels so the chip text matches
 * what the dropdown shows (e.g. severity 'critical' -> 'Critical'). Falls back
 * to the raw value when the column has no labeled options.
 */
function resolveMultiselectLabels(
  columns: readonly unknown[] | undefined,
  columnId: string,
  values: string[]
): string[] {
  const column = columns ? findColumn([...columns], columnId) : undefined
  const filterMeta = (column as { meta?: { filter?: unknown } } | undefined)
    ?.meta?.filter
  if (
    !filterMeta ||
    typeof filterMeta !== 'object' ||
    !('options' in filterMeta)
  ) {
    return values
  }
  const labelByValue = new Map(
    normalizeFilterOptions((filterMeta as { options?: unknown[] }).options).map(
      (option) => [option.value, option.label]
    )
  )
  return values.map((value) => labelByValue.get(value) ?? value)
}

function FilterChips({
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
  customFilters,
  columns
}: Readonly<FilterChipsProps>) {
  const [expandedChips, setExpandedChips] = useState<Set<string>>(new Set())
  const [showNavigation, setShowNavigation] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const overlayRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const chipContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const chipsWrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [overlayPositions, setOverlayPositions] = useState<{
    [key: string]: { top: number; left: number; width: number }
  }>({})

  const checkOverflow = () => {
    if (!chipsWrapperRef.current) {
      return
    }

    const wrapper = chipsWrapperRef.current
    const hasOverflow = wrapper.scrollWidth > wrapper.clientWidth

    setShowNavigation(hasOverflow)

    if (hasOverflow) {
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
      setCanScrollLeft(wrapper.scrollLeft > 0)
      setCanScrollRight(wrapper.scrollLeft < maxScroll - SCROLL_EPSILON)
    }
  }

  useWindowResize(checkOverflow, [activeFilters])

  useEffect(() => {
    const wrapper = chipsWrapperRef.current
    if (wrapper) {
      wrapper.addEventListener('scroll', checkOverflow)
    }

    const timer = setTimeout(checkOverflow, OVERFLOW_CHECK_DELAY_MS)

    return () => {
      if (wrapper) {
        wrapper.removeEventListener('scroll', checkOverflow)
      }
      clearTimeout(timer)
    }
  }, [activeFilters])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Array.from(expandedChips).every((chipId) => {
        const overlay = overlayRefs.current[chipId]
        return !overlay?.contains(event.target as Node)
      })

      if (clickedOutside) {
        setExpandedChips(new Set())
      }
    }

    if (expandedChips.size > 0) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [expandedChips])

  useEffect(() => {
    const computePosition = (chipId: string) => {
      const anchor = chipContainerRefs.current[chipId]
      if (!anchor) {
        return
      }
      const rect = anchor.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const width = rect.width
      let left = rect.left + window.scrollX
      const maxLeft =
        window.scrollX + viewportWidth - width - PIXELS_PER_CHARACTER
      if (left > maxLeft) {
        left = Math.max(window.scrollX + PIXELS_PER_CHARACTER, maxLeft)
      }
      setOverlayPositions((prev) => ({
        ...prev,
        [chipId]: { top: rect.bottom + window.scrollY, left, width }
      }))
    }

    const refresh = () => {
      Array.from(expandedChips).forEach((chipId) => computePosition(chipId))
    }
    if (expandedChips.size > 0) {
      refresh()
      window.addEventListener('resize', refresh)
      window.addEventListener('scroll', refresh, true)
      return () => {
        window.removeEventListener('resize', refresh)
        window.removeEventListener('scroll', refresh, true)
      }
    }
  }, [expandedChips])

  const handleScrollLeft = () => {
    if (chipsWrapperRef.current) {
      const wrapper = chipsWrapperRef.current
      const newPosition = Math.max(0, wrapper.scrollLeft - SCROLL_AMOUNT)
      wrapper.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }

  const handleScrollRight = () => {
    if (chipsWrapperRef.current) {
      const wrapper = chipsWrapperRef.current
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
      const newPosition = Math.min(
        maxScroll,
        wrapper.scrollLeft + SCROLL_AMOUNT
      )
      wrapper.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }

  if (activeFilters.length === 0) {
    return null
  }

  const getNumRangeChip = (filter: ActiveFilter): string => {
    const { min, max } = filter.value as NumRangeFilterType
    const minStr = min !== null && !Number.isNaN(min) ? `${min}` : ANY_LABEL
    const maxStr = max !== null && !Number.isNaN(max) ? `${max}` : ANY_LABEL
    return `${minStr} - ${maxStr}`
  }

  const formatFilterValue = (filter: ActiveFilter): FilterValueResult => {
    const custom = customFilters?.[filter.type]
    if (custom?.formatChip) {
      const chip = custom.formatChip(filter.value, filter.modeLabels)
      return { compact: false, display: chip.display, customLabel: chip.label }
    }
    switch (filter.type) {
      case FILTER_TYPES.MULTISELECT:
        return formatMultiselectFilter(
          resolveMultiselectLabels(
            columns,
            filter.columnId,
            filter.value as string[]
          )
        )
      case FILTER_TYPES.DATETIME:
        return formatDatetimeFilter(
          filter.value as { from?: string; to?: string }
        )
      case FILTER_TYPES.NUM_RANGE:
        return { compact: false, display: getNumRangeChip(filter) }
      default:
        return { compact: false, display: filter.value as string }
    }
  }

  const toggleExpanded = (chipId: string) => {
    setExpandedChips((prev: Set<string>) => {
      const newSet = new Set(prev)
      if (newSet.has(chipId)) {
        newSet.delete(chipId)
        setOverlayPositions((prevPositions) => {
          const newPositions = { ...prevPositions }
          delete newPositions[chipId]
          return newPositions
        })
      } else {
        newSet.add(chipId)
      }
      return newSet
    })
  }

  return (
    <div
      ref={containerRef}
      className={styles.chipsContainer}
    >
      {showNavigation ? (
        <button
          className={styles.navigationButton}
          disabled={!canScrollLeft}
          onClick={handleScrollLeft}
          type='button'
        >
          <ArrowIcon
            direction={ARROW_DIRECTIONS.LEFT}
            size={NAV_ARROW_SIZE}
          />
        </button>
      ) : null}
      <div
        ref={chipsWrapperRef}
        data-testid='filter-chips-wrapper'
        className={clsx(
          styles.chipsWrapper,
          !showNavigation && styles.chipsWrapperNoOverflow
        )}
      >
        {activeFilters.map((filter) => {
          const formattedValue = formatFilterValue(filter)
          if (!formattedValue.display) {
            return null
          }

          const isExpanded = expandedChips.has(filter.columnId)

          return (
            <div
              key={filter.columnId}
              ref={(el) => {
                if (el) {
                  chipContainerRefs.current[filter.columnId] = el
                }
              }}
              className={styles.chipContainer}
              data-testid={`filter-chip-${filter.columnId}`}
            >
              <div
                className={clsx(styles.chip, { [styles.expanded]: isExpanded })}
              >
                <span className={clsx(styles.chipLabel, 'capitalizedText')}>
                  {formattedValue.customLabel || filter.label}:
                </span>
                <Tooltip
                  data={formattedValue.display}
                  ellipsis
                  ellipsisClass={styles.chipValue}
                  extraClass={styles.tooltipContent}
                  extraPopperClass={styles.tooltipPopper}
                >
                  {formattedValue.display}
                </Tooltip>
                {formattedValue.compact ? (
                  <>
                    <span className={styles.chipMore}>
                      +{formattedValue.values?.length}
                    </span>
                    <button
                      className={styles.chipExpand}
                      onClick={() => toggleExpanded(filter.columnId)}
                      title={`${
                        isExpanded ? 'Collapse' : 'Expand'
                      } filter values`}
                    >
                      <ArrowIcon
                        size={EXPAND_ARROW_SIZE}
                        direction={
                          isExpanded
                            ? ARROW_DIRECTIONS.DOWN
                            : ARROW_DIRECTIONS.UP
                        }
                      />
                    </button>
                  </>
                ) : null}
                <button
                  className={styles.chipRemove}
                  onClick={() => onRemoveFilter(filter.columnId)}
                  title={`Remove ${filter.label} filter`}
                >
                  <CloseRoundedIcon />
                </button>
              </div>
              {formattedValue.compact && isExpanded
                ? createPortal(
                    <div
                      ref={(el) => {
                        if (el) {
                          overlayRefs.current[filter.columnId] = el
                        }
                      }}
                      className={styles.chipOverlay}
                      style={{
                        top: overlayPositions[filter.columnId]?.top,
                        left: overlayPositions[filter.columnId]?.left,
                        width: overlayPositions[filter.columnId]?.width
                      }}
                    >
                      <div className={styles.overlayContent}>
                        {(formattedValue.values || []).map((value, index) => (
                          <div
                            key={index}
                            className={styles.overlayItem}
                          >
                            <span className={styles.overlayLabel}>
                              {filter.label}:
                            </span>
                            <Tooltip
                              data={value}
                              ellipsis
                              ellipsisClass={styles.overlayValue}
                              extraClass={styles.tooltipContent}
                              extraPopperClass={styles.tooltipPopper}
                            >
                              {value}
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </div>,
                    document.body
                  )
                : null}
            </div>
          )
        })}
      </div>
      {activeFilters.length > 0 && (
        <button
          className={styles.clearAllButton}
          data-testid='clear-all-filters-button'
          onClick={onClearAllFilters}
          title='Clear all filters'
        >
          Clear Filters
        </button>
      )}
      {showNavigation ? (
        <button
          className={styles.navigationButton}
          disabled={!canScrollRight}
          onClick={handleScrollRight}
          type='button'
        >
          <ArrowIcon
            direction={ARROW_DIRECTIONS.RIGHT}
            size={NAV_ARROW_SIZE}
          />
        </button>
      ) : null}
    </div>
  )
}

export { FilterChips }

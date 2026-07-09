import clsx from 'clsx'

import { TOOLTIP_PLACEMENTS } from '#v2/utils/consts'

import { Checkbox } from '../../CheckBox'
import { Tooltip } from '../../Tooltip'
import { SERIES_TYPES, type SeriesConfig } from '../chartTypes'

import styles from './legendDrawer.module.scss'

interface LegendItemProps {
  item: SeriesConfig
  isHidden: boolean
  isTotal?: boolean
  clickable: boolean
  showCheckboxes: boolean
  showValues: boolean
  onToggle: () => void
}

export function LegendItem({
  item,
  isHidden,
  isTotal = false,
  clickable,
  showCheckboxes,
  showValues,
  onToggle
}: Readonly<LegendItemProps>) {
  const isLine = item.type === SERIES_TYPES.LINE

  return (
    <div
      onClick={onToggle}
      className={clsx(styles.legendItem, {
        [styles.hidden]: isHidden,
        [styles.totalItem]: isTotal,
        [styles.clickable]: clickable,
        [styles.withValue]: showValues
      })}
    >
      <div className={styles.legendItemLeft}>
        {showCheckboxes ? (
          <Checkbox
            checked={!isHidden}
            onChange={onToggle}
          />
        ) : null}
        <div
          className={clsx(styles.legendDot, { [styles.line]: isLine })}
          data-color={item.color}
          title={`Color: ${item.color}`}
          style={{
            backgroundColor: isLine ? 'transparent' : item.color,
            borderColor: isLine ? item.color : 'transparent'
          }}
        />
        <Tooltip
          data={item.name}
          placement={TOOLTIP_PLACEMENTS.TOP}
        >
          <div className={styles.legendLabelWrapper}>
            {item.href ? (
              <a
                className={styles.legendLabel}
                href={item.href}
                onClick={(e) => e.stopPropagation()}
              >
                {item.name}
              </a>
            ) : (
              <span className={styles.legendLabel}>{item.name}</span>
            )}
          </div>
        </Tooltip>
      </div>
      {showValues && item.formattedValue ? (
        <Tooltip
          data={item.formattedValue}
          placement={TOOLTIP_PLACEMENTS.TOP}
        >
          <div className={styles.legendValueWrapper}>
            {item.valueHref ? (
              <a
                className={styles.legendValue}
                href={item.valueHref}
                onClick={(e) => e.stopPropagation()}
              >
                {item.formattedValue}
              </a>
            ) : (
              <span className={styles.legendValue}>{item.formattedValue}</span>
            )}
          </div>
        </Tooltip>
      ) : null}
    </div>
  )
}

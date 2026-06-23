import { Fragment } from 'react'
import clsx from 'clsx'

import { ICON_VARIANTS, PERCENTAGE } from '#v2/utils/consts'

import {
  DriversIcon,
  FileSystemIcon,
  S3BucketsIcon,
  ServersIcon
} from '../../../icons'

import styles from './inventoryCard.module.scss'

const ICON_SIZE = 36

export interface InventoryItem {
  id: string
  title: string
  subtitle: string
  value: string
  description: string
  percentage?: number
}

export interface InventoryCardProps {
  data: InventoryItem[]
}

export function InventoryCard({ data }: Readonly<InventoryCardProps>) {
  const getIcon = (item: InventoryItem) => {
    const iconProps = {
      variant: ICON_VARIANTS.CONTAINER,
      width: ICON_SIZE,
      height: ICON_SIZE
    }

    switch (item.id) {
      case 'servers':
        return <ServersIcon {...iconProps} />
      case 'drivers':
        return <DriversIcon {...iconProps} />
      case 'filesystems':
        return <FileSystemIcon {...iconProps} />
      case 's3buckets':
        return <S3BucketsIcon {...iconProps} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      {data.map((item, index) => (
        <Fragment key={item.id}>
          <div
            className={styles.inventoryItem}
            data-testid={`inventory-item-${item.id}`}
          >
            <div className={styles.leftSection}>
              <div className={styles.iconContainer}>{getIcon(item)}</div>
              <div className={styles.textSection}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.subtitle}>{item.subtitle}</div>
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.value}>{item.value}</div>
              <div
                className={clsx(
                  styles.description,
                  item.percentage !== undefined &&
                    item.percentage < PERCENTAGE.FULL &&
                    styles.warningText
                )}
              >
                {item.description}
              </div>
            </div>
          </div>
          {index < data.length - 1 && <div className={styles.separator} />}
        </Fragment>
      ))}
    </div>
  )
}

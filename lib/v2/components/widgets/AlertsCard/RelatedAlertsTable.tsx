import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import {
  ExpandableText,
  ExpandableTextProvider,
  SimpleTable
} from '../../SimpleTable'

import styles from './alertDetails.module.scss'

export interface GroupedAlert {
  title?: string
  content?: string
  timestamp: string
}

const MIN_GROUPED_ALERTS = 2
const TIMESTAMP_COLUMN_WIDTH = '160px'

interface RelatedAlertsTableProps {
  groupedAlerts?: GroupedAlert[]
  label: string
  formatTimestamp: (timestamp: string) => string
}

export function RelatedAlertsTable({
  groupedAlerts,
  label,
  formatTimestamp
}: Readonly<RelatedAlertsTableProps>) {
  if (!groupedAlerts || groupedAlerts.length < MIN_GROUPED_ALERTS) {
    return null
  }

  return (
    <div>
      <div className={clsx(styles.sectionTitle, styles.groupedAlertsTitle)}>
        {label} [{groupedAlerts.length}]
      </div>
      <ExpandableTextProvider>
        <SimpleTable
          data={groupedAlerts}
          extraClass={styles.groupedTable}
          rowClassName={styles.groupedRow}
          columns={[
            {
              key: 'desc',
              render: (groupedAlert: GroupedAlert) => (
                <ExpandableText
                  text={
                    groupedAlert.content || groupedAlert.title || EMPTY_STRING
                  }
                />
              )
            },
            {
              key: 'ts',
              width: TIMESTAMP_COLUMN_WIDTH,
              render: (groupedAlert: GroupedAlert) =>
                formatTimestamp(groupedAlert.timestamp)
            }
          ]}
        />
      </ExpandableTextProvider>
    </div>
  )
}

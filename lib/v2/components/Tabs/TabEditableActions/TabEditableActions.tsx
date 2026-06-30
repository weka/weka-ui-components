import type { Tab } from '../tabsConstants'
import type { MouseEvent } from 'react'

import { ICON_SIZES } from '#v2/utils/consts'

import { CloseWithBgIcon, EditIcon, RestoreIcon } from '../../../icons'

import styles from '../tabs.module.scss'

interface TabEditableActionsProps {
  canDelete: boolean
  onDelete: (e: MouseEvent, tabId: string) => void
  onRestore?: (e: MouseEvent, tabId: string) => void
  onStartEdit: (e: MouseEvent, tabId: string, currentName: string) => void
  tab: Tab
}

export function TabEditableActions({
  canDelete,
  onDelete,
  onRestore,
  onStartEdit,
  tab
}: Readonly<TabEditableActionsProps>) {
  return (
    <>
      {onRestore ? (
        <button
          className={styles.tabActionBtn}
          data-testid={`tab-${tab.id}-restore-button`}
          onClick={(e) => onRestore(e, tab.id)}
          title='Restore template'
          type='button'
        >
          <RestoreIcon
            height={ICON_SIZES.SM}
            width={ICON_SIZES.SM}
          />
        </button>
      ) : null}
      {!tab.isLocked && (
        <button
          className={styles.tabActionBtn}
          data-testid={`tab-${tab.id}-rename-button`}
          onClick={(e) => onStartEdit(e, tab.id, tab.label)}
          title='Rename'
          type='button'
        >
          <EditIcon
            height={ICON_SIZES.SM}
            width={ICON_SIZES.SM}
          />
        </button>
      )}
      {!tab.isLocked && canDelete ? (
        <button
          className={styles.tabCloseBtn}
          data-testid={`tab-${tab.id}-delete-button`}
          onClick={(e) => onDelete(e, tab.id)}
          title='Delete'
          type='button'
        >
          <CloseWithBgIcon
            color='var(--gray-900-100)'
            height={ICON_SIZES.SM}
            width={ICON_SIZES.SM}
          />
        </button>
      ) : null}
    </>
  )
}

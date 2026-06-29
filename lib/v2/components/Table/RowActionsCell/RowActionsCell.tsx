import type { RowAction } from '../Table'
import type { CellContext } from '@tanstack/react-table'
import type { MouseEvent, RefObject } from 'react'

import { useRef, useState } from 'react'
import clsx from 'clsx'

import { ThreeDotsMenuIcon } from '../../../icons'
import { IconButton } from '../../IconButton'
import { MENU_POPOVER_STYLES, MenuPopover } from '../../MenuPopover'
import { Tooltip } from '../../Tooltip'

import styles from './rowActionsCell.module.scss'

interface RowActionsCellMeta<TData> {
  rowActions: RowAction<TData>[]
}

function resolveDisabledTooltip<TData>(
  tooltip: string | ((row: TData) => string),
  row: TData
): string {
  return typeof tooltip === 'function' ? tooltip(row) : tooltip
}

export function RowActionsCell<TData>({
  column,
  row
}: Readonly<CellContext<TData, unknown>>) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const meta = column.columnDef.meta as RowActionsCellMeta<TData> | undefined
  const rowActions = meta?.rowActions ?? []

  const visibleActions = rowActions.filter(
    (action) => !action.hideAction?.(row.original)
  )
  const hasVisibleActions = visibleActions.length > 0

  if (!hasVisibleActions) {
    if (open) {
      setOpen(false)
    }
    return null
  }

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    setOpen((isOpen) => !isOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const stopRowActivation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      ref={anchorRef}
      className={styles.cellWrapper}
      onClick={stopRowActivation}
    >
      <IconButton
        ariaLabel='Row actions'
        dataTestId='row-actions-button'
        extraClass={open ? styles.kebabActive : undefined}
        onClick={handleToggle}
        small
      >
        <ThreeDotsMenuIcon size={14} />
      </IconButton>
      <MenuPopover
        anchorRef={anchorRef as RefObject<HTMLElement>}
        extraClass={styles.menu}
        onClose={handleClose}
        open={open}
      >
        {visibleActions.map((action) => {
          const body = action.content ? (
            action.content(row.original)
          ) : (
            <>
              {action.icon}
              {action.text}
            </>
          )

          if (action.header) {
            return (
              <div
                key={action.key}
                data-testid={`row-action-${action.key}`}
                className={clsx(
                  MENU_POPOVER_STYLES.menuHeader,
                  action.extraClass
                )}
              >
                {body}
              </div>
            )
          }

          const isDisabled = action.disabled?.(row.original) ?? false
          const disabledTooltip =
            isDisabled && action.disabledTooltip
              ? resolveDisabledTooltip(action.disabledTooltip, row.original)
              : undefined

          const button = (
            <button
              key={action.key}
              data-testid={`row-action-${action.key}`}
              disabled={isDisabled}
              type='button'
              className={clsx(
                MENU_POPOVER_STYLES.menuItem,
                action.indent && MENU_POPOVER_STYLES.menuItemIndent,
                action.extraClass
              )}
              onClick={(e) => {
                e.stopPropagation()
                action.action?.(row.original)
                handleClose()
              }}
            >
              {body}
            </button>
          )

          return disabledTooltip ? (
            <Tooltip
              key={action.key}
              data={disabledTooltip}
            >
              {button}
            </Tooltip>
          ) : (
            button
          )
        })}
      </MenuPopover>
    </div>
  )
}

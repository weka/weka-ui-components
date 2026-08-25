import type { ReactNode } from 'react'

import clsx from 'clsx'

import styles from './table.module.scss'

const DRAWER_GAP = 24

interface RenderTableBodyArgs {
  readonly drawer: ReactNode
  readonly drawerOpen: boolean
  readonly drawerWidth: number
  readonly framed: boolean
  readonly tableContainerContent: ReactNode
  readonly footer: ReactNode
  /** True when a `filterBar` row precedes this container, so it should skip its own top border/radius and continue that row's instead. */
  readonly afterFilterBar?: boolean
}

/**
 * Renders the table body — plain, or framed inside `.tableBodyArea` (top gap +
 * bg) when a `drawer` is provided or `framed` is set. The drawer slides in
 * beside the body, which gets a matching right margin while it's open.
 */
export function renderTableBody({
  drawer,
  drawerOpen,
  drawerWidth,
  framed,
  tableContainerContent,
  footer,
  afterFilterBar = false
}: RenderTableBodyArgs) {
  const tableContainer = (
    <div
      className={clsx(
        styles.tableContainer,
        afterFilterBar && styles.tableContainerAfterFilterBar
      )}
    >
      {tableContainerContent}
    </div>
  )

  if (!drawer && !framed) {
    return (
      <>
        {tableContainer}
        {footer}
      </>
    )
  }

  const bodyMainStyle = {
    marginRight: drawer && drawerOpen ? `${drawerWidth + DRAWER_GAP}px` : '0px',
    transition: 'margin-right 0.15s ease'
  }

  return (
    <div className={styles.tableBodyArea}>
      <div
        className={styles.tableBodyMain}
        style={bodyMainStyle}
      >
        {tableContainer}
        {footer}
      </div>
      {drawer}
    </div>
  )
}

import type { MouseEvent } from 'react'

import { useCallback, useState } from 'react'

import { TableDrawer } from '../../TableDrawer'
import { Table } from './Table'

interface Cluster {
  id: number
  name: string
  region: string
  status: string
}

const REGIONS = ['us-east-1', 'us-west-2', 'eu-central-1']
const STATUSES = ['Healthy', 'Degraded', 'Offline']

const DEMO_DATA: Cluster[] = Array.from({ length: 40 }, (_unused, index) => ({
  id: index + 1,
  name: `cluster-${index + 1}`,
  region: REGIONS[index % REGIONS.length],
  status: STATUSES[index % STATUSES.length]
}))

const DEMO_COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'status', header: 'Status' }
]

const DRAWER_DEFAULT_WIDTH = 340
const DRAWER_MIN_WIDTH = 220
const DRAWER_MAX_WIDTH = 600

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)',
  height: 520
}

export function TableWithDrawerDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Cluster | null>(null)

  const handleRowClick = useCallback((row: Cluster) => {
    setSelectedRow(row)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleResizeStart = useCallback(
    (e: MouseEvent) => {
      setIsResizing(true)
      const startX = e.clientX
      const startWidth = drawerWidth

      const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const delta = startX - moveEvent.clientX
        const newWidth = Math.min(
          DRAWER_MAX_WIDTH,
          Math.max(DRAWER_MIN_WIDTH, startWidth + delta)
        )
        setDrawerWidth(newWidth)
      }

      const onMouseUp = () => {
        setIsResizing(false)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [drawerWidth]
  )

  return (
    <div style={CONTAINER_STYLE}>
      <Table
        columns={DEMO_COLUMNS}
        data={DEMO_DATA}
        drawerOpen={isOpen}
        drawerWidth={drawerWidth}
        onRowClick={handleRowClick}
        showSearch
        title='Click a row to open the drawer (toolbar stays full-width)'
        drawer={
          <TableDrawer
            isOpen={isOpen}
            isResizing={isResizing}
            onClose={handleClose}
            onResizeStart={handleResizeStart}
            title={selectedRow ? `Details: ${selectedRow.name}` : 'Details'}
            width={drawerWidth}
          >
            {selectedRow ? (
              <div>
                <p>
                  <strong>Name:</strong> {selectedRow.name}
                </p>
                <p>
                  <strong>Region:</strong> {selectedRow.region}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRow.status}
                </p>
              </div>
            ) : null}
          </TableDrawer>
        }
      />
    </div>
  )
}

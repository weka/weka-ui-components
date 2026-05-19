import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { DOM_EVENTS } from '../../utils/consts'
import { Button } from '../Button'

import { TableDrawer } from './TableDrawer'

const CONTAINER_STYLE: CSSProperties = {
  position: 'relative',
  width: '900px',
  height: '480px',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-light)',
  borderRadius: '4px',
  overflow: 'hidden'
}

const TOOLBAR_STYLE: CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--border-light)'
}

const DETAILS_STYLE: CSSProperties = {
  padding: '16px 4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  color: 'var(--text-primary)'
}

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 600
}

const LABEL_STYLE: CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase'
}

const VALUE_STYLE: CSSProperties = {
  fontSize: '14px'
}

const INITIAL_WIDTH = 480
const MIN_WIDTH = 320
const MAX_WIDTH = 800

function TableDrawerDemo() {
  const [isOpen, setIsOpen] = useState(true)
  const [width, setWidth] = useState(INITIAL_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(width)

  const handleResizeStart = useCallback(
    (e: ReactMouseEvent) => {
      startXRef.current = e.clientX
      startWidthRef.current = width
      setIsResizing(true)
    },
    [width]
  )

  useEffect(() => {
    if (!isResizing) {
      return
    }
    const handleMove = (e: MouseEvent) => {
      const delta = startXRef.current - e.clientX
      const next = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startWidthRef.current + delta)
      )
      setWidth(next)
    }
    const handleUp = () => setIsResizing(false)
    window.addEventListener(DOM_EVENTS.MOUSEMOVE, handleMove)
    window.addEventListener(DOM_EVENTS.MOUSEUP, handleUp)
    return () => {
      window.removeEventListener(DOM_EVENTS.MOUSEMOVE, handleMove)
      window.removeEventListener(DOM_EVENTS.MOUSEUP, handleUp)
    }
  }, [isResizing])

  return (
    <div style={CONTAINER_STYLE}>
      <div style={TOOLBAR_STYLE}>
        <Button onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? 'Close drawer' : 'Open drawer'}
        </Button>
      </div>
      <TableDrawer
        isOpen={isOpen}
        isResizing={isResizing}
        onClose={() => setIsOpen(false)}
        onResizeStart={handleResizeStart}
        title={<h3 style={TITLE_STYLE}>Cluster details</h3>}
        width={width}
      >
        <div style={DETAILS_STYLE}>
          <div>
            <div style={LABEL_STYLE}>Name</div>
            <div style={VALUE_STYLE}>cluster-prod-1</div>
          </div>
          <div>
            <div style={LABEL_STYLE}>Status</div>
            <div style={VALUE_STYLE}>OK</div>
          </div>
          <div>
            <div style={LABEL_STYLE}>Version</div>
            <div style={VALUE_STYLE}>4.4.7</div>
          </div>
          <div>
            <div style={LABEL_STYLE}>Drag the left edge to resize</div>
            <div style={VALUE_STYLE}>Current width: {width}px</div>
          </div>
        </div>
      </TableDrawer>
    </div>
  )
}

const meta: Meta<typeof TableDrawerDemo> = {
  title: 'V2/TableDrawer',
  component: TableDrawerDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}

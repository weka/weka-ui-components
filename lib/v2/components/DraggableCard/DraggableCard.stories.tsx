import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { DraggableCard } from './DraggableCard'

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  padding: '16px',
  width: '720px'
}

const CARD_STYLE: CSSProperties = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center',
  color: 'var(--text-primary)',
  userSelect: 'none'
}

const CAPTION_STYLE: CSSProperties = {
  marginTop: '8px',
  fontSize: '12px',
  color: 'var(--text-secondary)'
}

const INFO_STYLE: CSSProperties = {
  padding: '12px 16px',
  fontSize: '13px',
  color: 'var(--text-secondary)'
}

interface CardItem {
  id: string
  label: string
}

const INITIAL_CARDS: readonly CardItem[] = [
  { id: 'card-1', label: 'Memory' },
  { id: 'card-2', label: 'CPU' },
  { id: 'card-3', label: 'Network' },
  { id: 'card-4', label: 'Disk I/O' },
  { id: 'card-5', label: 'Latency' },
  { id: 'card-6', label: 'Throughput' }
] as const

function reorder(
  list: readonly CardItem[],
  draggedId: string,
  targetId: string
): CardItem[] {
  const result = [...list]
  const fromIndex = result.findIndex((item) => item.id === draggedId)
  const toIndex = result.findIndex((item) => item.id === targetId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return result
  }
  const [moved] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, moved)
  return result
}

function DraggableGrid() {
  const [cards, setCards] = useState<readonly CardItem[]>(INITIAL_CARDS)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  return (
    <div>
      <div style={INFO_STYLE}>
        Hover the card edges (within 20px) to grab. Drag onto another card to
        reorder.
      </div>
      <div style={GRID_STYLE}>
        {cards.map((item) => (
          <DraggableCard
            key={item.id}
            id={item.id}
            isDragging={draggingId === item.id}
            isDropTarget={dropTargetId === item.id}
            onDragOver={(id) => setDropTargetId(id)}
            onDragStart={(id) => setDraggingId(id)}
            onDragEnd={() => {
              setDraggingId(null)
              setDropTargetId(null)
            }}
            onDrop={(targetId) => {
              if (draggingId) {
                setCards((prev) => reorder(prev, draggingId, targetId))
              }
            }}
          >
            <div style={CARD_STYLE}>
              <strong>{item.label}</strong>
              <div style={CAPTION_STYLE}>id: {item.id}</div>
            </div>
          </DraggableCard>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: 'V2/DraggableCard',
  component: DraggableCard,
  parameters: { layout: 'centered' }
} satisfies Meta<typeof DraggableCard>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  args: {
    id: 'interactive-grid',
    children: null
  },
  render: () => <DraggableGrid />
}

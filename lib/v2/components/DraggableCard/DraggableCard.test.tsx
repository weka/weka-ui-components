import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_EDGE_THRESHOLD,
  DRAG_START_THRESHOLD,
  DRAGGING_CARD_CLASS
} from './consts'
import { DraggableCard } from './DraggableCard'

const CARD_CONTENT_TEXT = 'Card Content'
const CUSTOM_CLASS = 'custom-class'
const TEST_ID = 'my-card'
const CARD_ID = 'card-1'
const NEAR_EDGE_CLASS = 'nearEdge'
const DRAGGING_CLASS = 'dragging'
const DROP_TARGET_CLASS = 'dropTarget'

const MOCK_BOUNDING_RECT: DOMRect = {
  left: 100,
  right: 300,
  top: 100,
  bottom: 300,
  width: 200,
  height: 200,
  x: 100,
  y: 100,
  toJSON: () => ({})
}

const NEAR_LEFT_EDGE_X = 105
const NEAR_RIGHT_EDGE_X = 295
const CENTER_X = 200
const CENTER_Y = 200

const createProps = (overrides = {}) => ({
  id: CARD_ID,
  children: <div>{CARD_CONTENT_TEXT}</div>,
  ...overrides
})

function hasClassContaining(element: Element, classSubstring: string): boolean {
  return Array.from(element.classList).some((cls) =>
    cls.toLowerCase().includes(classSubstring.toLowerCase())
  )
}

function getCard(): HTMLElement {
  return screen.getByText(CARD_CONTENT_TEXT).parentElement!
}

function renderCardWithMockedBounds(props = {}): HTMLElement {
  render(<DraggableCard {...createProps(props)} />)
  const card = getCard()
  vi.spyOn(card, 'getBoundingClientRect').mockReturnValue(MOCK_BOUNDING_RECT)
  return card
}

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
  document.documentElement.classList.remove(DRAGGING_CARD_CLASS)
  document.body.classList.remove(DRAGGING_CARD_CLASS)
})

describe('DraggableCard - Rendering', () => {
  it('renders children content', () => {
    render(<DraggableCard {...createProps()} />)
    expect(screen.getByText(CARD_CONTENT_TEXT)).toBeInTheDocument()
  })

  it('sets data-draggable-id attribute', () => {
    render(<DraggableCard {...createProps({ id: 'test-card' })} />)
    expect(getCard()).toHaveAttribute('data-draggable-id', 'test-card')
  })

  it('applies data-testid when provided', () => {
    render(<DraggableCard {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
  })

  it('applies extraClass when provided', () => {
    render(<DraggableCard {...createProps({ extraClass: CUSTOM_CLASS })} />)
    expect(getCard()).toHaveClass(CUSTOM_CLASS)
  })

  it('applies style when provided', () => {
    render(
      <DraggableCard {...createProps({ style: { backgroundColor: 'red' } })} />
    )
    expect(getCard()).toHaveStyle({ backgroundColor: 'red' })
  })
})

describe('DraggableCard - Drag State Classes', () => {
  it('applies dragging class when isDragging prop is true', () => {
    render(<DraggableCard {...createProps({ isDragging: true })} />)
    expect(hasClassContaining(getCard(), DRAGGING_CLASS)).toBe(true)
  })

  it('applies dropTarget class when isDropTarget prop is true', () => {
    render(<DraggableCard {...createProps({ isDropTarget: true })} />)
    expect(hasClassContaining(getCard(), DROP_TARGET_CLASS)).toBe(true)
  })

  it('does not apply dragging class by default', () => {
    render(<DraggableCard {...createProps()} />)
    expect(hasClassContaining(getCard(), DRAGGING_CLASS)).toBe(false)
  })
})

describe('DraggableCard - Edge Detection', () => {
  it('applies nearEdge class when mouse is near left edge', () => {
    const card = renderCardWithMockedBounds()
    fireEvent.mouseMove(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    expect(hasClassContaining(card, NEAR_EDGE_CLASS)).toBe(true)
  })

  it('applies nearEdge class when mouse is near right edge', () => {
    const card = renderCardWithMockedBounds()
    fireEvent.mouseMove(card, { clientX: NEAR_RIGHT_EDGE_X, clientY: CENTER_Y })
    expect(hasClassContaining(card, NEAR_EDGE_CLASS)).toBe(true)
  })

  it('removes nearEdge class when mouse leaves card', () => {
    const card = renderCardWithMockedBounds()
    fireEvent.mouseMove(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    expect(hasClassContaining(card, NEAR_EDGE_CLASS)).toBe(true)

    fireEvent.mouseLeave(card)
    expect(hasClassContaining(card, NEAR_EDGE_CLASS)).toBe(false)
  })

  it('does not apply nearEdge class when mouse is in center', () => {
    const card = renderCardWithMockedBounds()
    fireEvent.mouseMove(card, { clientX: CENTER_X, clientY: CENTER_Y })
    expect(hasClassContaining(card, NEAR_EDGE_CLASS)).toBe(false)
  })

  it('respects custom edgeThreshold', () => {
    const customThreshold = 50
    const card = renderCardWithMockedBounds({ edgeThreshold: customThreshold })
    fireEvent.mouseMove(card, { clientX: 140, clientY: CENTER_Y })
    expect(hasClassContaining(card, NEAR_EDGE_CLASS)).toBe(true)
  })
})

describe('DraggableCard - Mouse Down Behavior', () => {
  it('does not start drag when mouse is not near edge', () => {
    const onDragStart = vi.fn()
    const card = renderCardWithMockedBounds({ onDragStart })

    fireEvent.mouseMove(card, { clientX: CENTER_X, clientY: CENTER_Y })
    fireEvent.mouseDown(card, { clientX: CENTER_X, clientY: CENTER_Y })
    fireEvent.mouseMove(window, { clientX: 250, clientY: 250 })

    expect(onDragStart).not.toHaveBeenCalled()
  })

  it('adds dragging classes to document when mousedown near edge', () => {
    const card = renderCardWithMockedBounds()

    fireEvent.mouseMove(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    fireEvent.mouseDown(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })

    expect(document.documentElement).toHaveClass(DRAGGING_CARD_CLASS)
    expect(document.body).toHaveClass(DRAGGING_CARD_CLASS)
  })
})

describe('DraggableCard - Drag Operations', () => {
  it('calls onDragStart when drag threshold is exceeded', () => {
    const onDragStart = vi.fn()
    const card = renderCardWithMockedBounds({ onDragStart })

    fireEvent.mouseMove(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    fireEvent.mouseDown(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    fireEvent.mouseMove(window, {
      clientX: NEAR_LEFT_EDGE_X + DRAG_START_THRESHOLD + 1,
      clientY: CENTER_Y
    })

    expect(onDragStart).toHaveBeenCalledTimes(1)
    expect(onDragStart).toHaveBeenCalledWith(CARD_ID, expect.any(Object))
  })

  it('calls onDragEnd when drag ends', () => {
    const onDragEnd = vi.fn()
    const card = renderCardWithMockedBounds({ onDragEnd })

    fireEvent.mouseMove(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    fireEvent.mouseDown(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    fireEvent.mouseMove(window, {
      clientX: NEAR_LEFT_EDGE_X + DRAG_START_THRESHOLD + 1,
      clientY: CENTER_Y
    })
    fireEvent.mouseUp(window)

    expect(onDragEnd).toHaveBeenCalledTimes(1)
  })

  it('cleans up dragging classes on mouseup', () => {
    const card = renderCardWithMockedBounds()

    fireEvent.mouseMove(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    fireEvent.mouseDown(card, { clientX: NEAR_LEFT_EDGE_X, clientY: CENTER_Y })
    expect(document.documentElement).toHaveClass(DRAGGING_CARD_CLASS)

    fireEvent.mouseUp(window)
    expect(document.documentElement).not.toHaveClass(DRAGGING_CARD_CLASS)
  })
})

const EXPECTED_EDGE_THRESHOLD = 20
const EXPECTED_DRAG_START_THRESHOLD = 5

describe('DraggableCard - Default Constants', () => {
  it('uses default edgeThreshold of 20', () => {
    expect(DEFAULT_EDGE_THRESHOLD).toBe(EXPECTED_EDGE_THRESHOLD)
  })

  it('uses drag start threshold of 5', () => {
    expect(DRAG_START_THRESHOLD).toBe(EXPECTED_DRAG_START_THRESHOLD)
  })
})

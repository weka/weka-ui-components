import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TableDrawer } from './TableDrawer'

const DRAWER_TEST_ID = 'table-drawer'
const RESIZE_HANDLE_TEST_ID = 'table-drawer-resize-handle'
const TITLE_TEXT = 'Test Title'
const CONTENT_TEXT = 'Test Content'
const INITIAL_WIDTH = 500
const UPDATED_WIDTH = 700
const ALTERNATE_WIDTH = 600
const RESIZING_CLASS = 'resizing'

const createProps = (overrides = {}) => ({
  isOpen: true,
  isResizing: false,
  width: INITIAL_WIDTH,
  title: <h3>{TITLE_TEXT}</h3>,
  onClose: vi.fn(),
  onResizeStart: vi.fn(),
  children: <div>{CONTENT_TEXT}</div>,
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('TableDrawer - Rendering', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <TableDrawer {...createProps({ isOpen: false })} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders drawer with title and content when isOpen is true', () => {
    render(<TableDrawer {...createProps()} />)

    expect(
      screen.getByRole('heading', { name: TITLE_TEXT })
    ).toBeInTheDocument()
    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<TableDrawer {...createProps()} />)
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})

describe('TableDrawer - Width behavior', () => {
  it('applies initial width correctly', () => {
    render(<TableDrawer {...createProps({ width: ALTERNATE_WIDTH })} />)
    expect(screen.getByTestId(DRAWER_TEST_ID).style.width).toBe(
      `${ALTERNATE_WIDTH}px`
    )
  })

  it('updates width when prop changes', () => {
    const props = createProps({ width: INITIAL_WIDTH })
    const { rerender } = render(<TableDrawer {...props} />)
    expect(screen.getByTestId(DRAWER_TEST_ID).style.width).toBe(
      `${INITIAL_WIDTH}px`
    )

    rerender(
      <TableDrawer
        {...props}
        width={UPDATED_WIDTH}
      />
    )
    expect(screen.getByTestId(DRAWER_TEST_ID).style.width).toBe(
      `${UPDATED_WIDTH}px`
    )
  })
})

describe('TableDrawer - User Interactions', () => {
  it('calls onClose when user clicks close button', () => {
    const onClose = vi.fn()
    render(<TableDrawer {...createProps({ onClose })} />)

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onResizeStart when user starts resizing', () => {
    const onResizeStart = vi.fn()
    render(<TableDrawer {...createProps({ onResizeStart })} />)

    fireEvent.mouseDown(screen.getByTestId(RESIZE_HANDLE_TEST_ID))

    expect(onResizeStart).toHaveBeenCalledTimes(1)
  })
})

describe('TableDrawer - Resizing visual feedback', () => {
  it('shows normal state when not resizing', () => {
    render(<TableDrawer {...createProps({ isResizing: false })} />)
    expect(screen.getByTestId(DRAWER_TEST_ID).className).not.toContain(
      RESIZING_CLASS
    )
  })

  it('shows resizing state when actively resizing', () => {
    render(<TableDrawer {...createProps({ isResizing: true })} />)
    expect(screen.getByTestId(DRAWER_TEST_ID).className).toContain(
      RESIZING_CLASS
    )
  })
})

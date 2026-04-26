import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KEYBOARD_KEYS } from '../../utils/consts'

import { Popup } from './Popup'

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('Popup - Rendering', () => {
  it('renders nothing when open is false', () => {
    render(
      <Popup
        onClose={vi.fn()}
        open={false}
        title='Test Title'
      >
        Content
      </Popup>
    )
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders title and content when open is true', () => {
    render(
      <Popup
        onClose={vi.fn()}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders close button with aria-label', () => {
    render(
      <Popup
        onClose={vi.fn()}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    render(
      <Popup
        actions={<button>Submit</button>}
        onClose={vi.fn()}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('applies dataTestId to modal', () => {
    render(
      <Popup
        dataTestId='test-popup'
        onClose={vi.fn()}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )
    expect(screen.getByTestId('test-popup')).toBeInTheDocument()
  })

  it('applies dataTestId to close button', () => {
    render(
      <Popup
        dataTestId='test-popup'
        onClose={vi.fn()}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )
    expect(screen.getByTestId('test-popup-close')).toBeInTheDocument()
  })
})

describe('Popup - Content Overflow', () => {
  it.each([
    { contentOverflow: 'auto' as const },
    { contentOverflow: 'visible' as const },
    { contentOverflow: 'hidden' as const },
    { contentOverflow: 'scroll' as const }
  ])('sets contentOverflow to $contentOverflow', ({ contentOverflow }) => {
    render(
      <Popup
        contentOverflow={contentOverflow}
        onClose={vi.fn()}
        open
        title='Test Title'
      >
        <span data-testid='content'>Content</span>
      </Popup>
    )
    const contentContainer = screen.getByTestId('content').parentElement
    expect(contentContainer).toHaveStyle({ overflow: contentOverflow })
  })
})

describe('Popup - User Interactions', () => {
  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Popup
        onClose={handleClose}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Popup
        onClose={handleClose}
        open
        title='Test Title'
      >
        <div data-testid='inner-content'>Inner Content</div>
      </Popup>
    )

    fireEvent.click(screen.getByTestId('inner-content'))

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <Popup
        onClose={handleClose}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )

    fireEvent.keyDown(document, { key: KEYBOARD_KEYS.ESCAPE })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when other keys are pressed', () => {
    const handleClose = vi.fn()
    render(
      <Popup
        onClose={handleClose}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )

    fireEvent.keyDown(document, { key: KEYBOARD_KEYS.ENTER })

    expect(handleClose).not.toHaveBeenCalled()
  })
})

describe('Popup - Overlay Click Behavior', () => {
  it('calls onClose when overlay is clicked with closeOnOverlayClick enabled', () => {
    const handleClose = vi.fn()
    render(
      <Popup
        closeOnOverlayClick
        dataTestId='popup'
        onClose={handleClose}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )

    const modal = screen.getByTestId('popup')
    const overlay = modal.parentElement
    if (overlay) {
      fireEvent.click(overlay)
    }

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when overlay is clicked with closeOnOverlayClick disabled', () => {
    const handleClose = vi.fn()
    render(
      <Popup
        closeOnOverlayClick={false}
        dataTestId='popup'
        onClose={handleClose}
        open
        title='Test Title'
      >
        Content
      </Popup>
    )

    const modal = screen.getByTestId('popup')
    const overlay = modal.parentElement
    if (overlay) {
      fireEvent.click(overlay)
    }

    expect(handleClose).not.toHaveBeenCalled()
  })
})

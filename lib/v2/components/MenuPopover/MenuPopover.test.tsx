import { type ReactNode, type RefObject, useRef } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useClickOutside, usePopoverPosition } from '#v2/hooks'

import { MenuPopover, POPOVER_ALIGN } from './MenuPopover'

vi.mock('#v2/hooks', () => ({
  useClickOutside: vi.fn(),
  usePopoverPosition: vi.fn(() => ({ position: { position: 'fixed' } })),
  POPOVER_ALIGN: { LEFT: 'left', RIGHT: 'right', CENTER: 'center' }
}))

const MENU_CONTENT = 'Menu Content'
const POPOVER_CLASS_SELECTOR = '[class*="popover"]'

function createMockAnchorRef() {
  const mockElement = document.createElement('button')
  mockElement.getBoundingClientRect = vi.fn(() => ({
    bottom: 100,
    right: 200,
    top: 50,
    left: 100,
    width: 100,
    height: 50,
    x: 100,
    y: 50,
    toJSON: () => ({})
  }))
  return { current: mockElement }
}

interface TestWrapperProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

function TestWrapper({ open, onClose, children }: Readonly<TestWrapperProps>) {
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button ref={anchorRef}>Anchor</button>
      <MenuPopover
        anchorRef={anchorRef as RefObject<HTMLElement>}
        onClose={onClose}
        open={open}
      >
        {children}
      </MenuPopover>
    </>
  )
}

describe('MenuPopover', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Visibility', () => {
    it('renders children when open is true', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      expect(screen.getByText(MENU_CONTENT)).toBeInTheDocument()
    })

    it('returns null when open is false', () => {
      const anchorRef = createMockAnchorRef()
      const { container } = render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open={false}
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      expect(container.firstChild).toBeNull()
    })

    it('hides content when open changes to false', () => {
      const anchorRef = createMockAnchorRef()
      const { rerender } = render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      expect(screen.getByText(MENU_CONTENT)).toBeInTheDocument()

      rerender(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open={false}
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      expect(screen.queryByText(MENU_CONTENT)).not.toBeInTheDocument()
    })
  })

  describe('Positioning', () => {
    it('applies fixed position style', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )

      const popover = document.body.querySelector(POPOVER_CLASS_SELECTOR)
      expect(popover).toHaveStyle({ position: 'fixed' })
    })
  })

  describe('Children', () => {
    it('renders multiple children', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <button type='button'>Option 1</button>
          <button type='button'>Option 2</button>
          <button type='button'>Option 3</button>
        </MenuPopover>
      )

      expect(
        screen.getByRole('button', { name: 'Option 1' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Option 2' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Option 3' })
      ).toBeInTheDocument()
    })
  })

  describe('Compact variant', () => {
    it('applies the compact modifier class when compact is true', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          compact
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      const popover = document.body.querySelector(POPOVER_CLASS_SELECTOR)
      expect(popover?.className).toMatch(/compact/)
    })

    it('does not apply the compact modifier class by default', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      const popover = document.body.querySelector(POPOVER_CLASS_SELECTOR)
      expect(popover?.className).not.toMatch(/compact/)
    })
  })

  describe('Alignment', () => {
    it('forwards right alignment to the positioning hook by default', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      expect(usePopoverPosition).toHaveBeenLastCalledWith(
        true,
        expect.anything(),
        expect.any(Function),
        expect.objectContaining({ align: POPOVER_ALIGN.RIGHT })
      )
    })

    it('forwards a left alignment to the positioning hook', () => {
      const anchorRef = createMockAnchorRef()
      render(
        <MenuPopover
          align={POPOVER_ALIGN.LEFT}
          anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
          onClose={vi.fn()}
          open
        >
          <div>{MENU_CONTENT}</div>
        </MenuPopover>
      )
      expect(usePopoverPosition).toHaveBeenLastCalledWith(
        true,
        expect.anything(),
        expect.any(Function),
        expect.objectContaining({ align: POPOVER_ALIGN.LEFT })
      )
    })
  })

  describe('Integration with TestWrapper', () => {
    it('works with real ref', () => {
      render(
        <TestWrapper
          onClose={vi.fn()}
          open
        >
          <div>Popover Content</div>
        </TestWrapper>
      )

      expect(screen.getByText('Popover Content')).toBeInTheDocument()
    })
  })
})

describe('MenuPopover portal click passthrough', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('forwards ignoreClickSelectors to the click-outside hook', () => {
    const anchorRef = createMockAnchorRef()
    const selectors = ['.MuiModal-root', '[data-weka-popup]']
    render(
      <MenuPopover
        anchorRef={anchorRef as unknown as RefObject<HTMLElement>}
        ignoreClickSelectors={selectors}
        onClose={vi.fn()}
        open
      >
        <div>{MENU_CONTENT}</div>
      </MenuPopover>
    )
    expect(useClickOutside).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.any(Function),
      expect.objectContaining({ additionalSelectors: selectors })
    )
  })
})

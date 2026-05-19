import type { ReactElement } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ExpandableText } from './ExpandableText'
import { ExpandableTextProvider } from './ExpandableTextContext'

const HELLO_TEXT = 'Hello World'
const SAMPLE_TEXT = 'Some text'
const TEST_TEXT = 'Test'
const TEST_CONTENT = 'Test content'

const renderWithProvider = (ui: ReactElement) =>
  render(<ExpandableTextProvider>{ui}</ExpandableTextProvider>)

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('ExpandableText - Rendering', () => {
  it('renders text content', () => {
    renderWithProvider(<ExpandableText text={HELLO_TEXT} />)

    expect(screen.getByText(HELLO_TEXT)).toBeInTheDocument()
  })

  it('renders with expandable container class', () => {
    const { container } = renderWithProvider(
      <ExpandableText text={SAMPLE_TEXT} />
    )

    expect(
      container.querySelector('[class*="expandableContainer"]')
    ).toBeInTheDocument()
  })

  it('renders with expandable text class', () => {
    const { container } = renderWithProvider(
      <ExpandableText
        maxLines={3}
        text={SAMPLE_TEXT}
      />
    )

    expect(
      container.querySelector('[class*="expandableText"]')
    ).toBeInTheDocument()
  })
})

describe('ExpandableText - Context integration', () => {
  it('throws error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<ExpandableText text={TEST_TEXT} />)).toThrow(
      'useExpandableTextContext must be used within an ExpandableTextProvider'
    )

    consoleSpy.mockRestore()
  })
})

describe('ExpandableText - Structure', () => {
  it('renders text in a div element', () => {
    renderWithProvider(<ExpandableText text={TEST_CONTENT} />)

    expect(screen.getByText(TEST_CONTENT).tagName).toBe('DIV')
  })

  it('accepts different maxLines prop values', () => {
    const { rerender } = renderWithProvider(
      <ExpandableText
        maxLines={1}
        text={TEST_TEXT}
      />
    )

    expect(screen.getByText(TEST_TEXT)).toBeInTheDocument()

    rerender(
      <ExpandableTextProvider>
        <ExpandableText
          maxLines={5}
          text={TEST_TEXT}
        />
      </ExpandableTextProvider>
    )

    expect(screen.getByText(TEST_TEXT)).toBeInTheDocument()
  })
})

describe('ExpandableText - Cleanup', () => {
  it('unmounts without errors', () => {
    const { unmount } = renderWithProvider(<ExpandableText text='Test text' />)

    expect(() => unmount()).not.toThrow()
  })
})

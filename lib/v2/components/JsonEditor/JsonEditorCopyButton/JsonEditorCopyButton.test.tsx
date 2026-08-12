import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { JsonEditorCopyButton } from './JsonEditorCopyButton'

const SAMPLE_TEXT = '{ "a": 1 }'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText }
  })
  return writeText
}

describe('JsonEditorCopyButton', () => {
  it('renders a copy button', () => {
    render(<JsonEditorCopyButton getText={() => SAMPLE_TEXT} />)

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
  })

  it('writes the provided text to the clipboard on click', () => {
    const writeText = mockClipboard()
    render(<JsonEditorCopyButton getText={() => SAMPLE_TEXT} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(writeText).toHaveBeenCalledWith(SAMPLE_TEXT)
  })

  it('switches to a copied state after copying', () => {
    mockClipboard()
    render(<JsonEditorCopyButton getText={() => SAMPLE_TEXT} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('reads the text lazily at click time', () => {
    const writeText = mockClipboard()
    let current = 'first'
    render(<JsonEditorCopyButton getText={() => current} />)

    current = 'second'
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(writeText).toHaveBeenCalledWith('second')
  })
})

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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
  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(navigator, 'clipboard')
    Reflect.deleteProperty(document, 'execCommand')
  })

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

  it('switches to a copied state after copying', async () => {
    mockClipboard()
    render(<JsonEditorCopyButton getText={() => SAMPLE_TEXT} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(
      await screen.findByRole('button', { name: 'Copied' })
    ).toBeInTheDocument()
  })

  it('stays in the copy state when the text cannot be copied', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('NotAllowedError'))
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: () => false
    })
    const prompt = vi.fn()
    vi.stubGlobal('prompt', prompt)
    render(<JsonEditorCopyButton getText={() => SAMPLE_TEXT} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    await waitFor(() => expect(prompt).toHaveBeenCalled())
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { copyToClipboard } from '#v2/utils/clipboard'

const TEXT = 'secret-token'

function mockClipboardApi(writeText?: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined
  })
}

function mockExecCommand(implementation: () => boolean) {
  const execCommand = vi.fn(implementation)
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: execCommand
  })
  return execCommand
}

const rejectingWriteText = () =>
  vi.fn().mockRejectedValue(new Error('NotAllowedError'))

describe('copyToClipboard', () => {
  const prompt = vi.fn()

  beforeEach(() => {
    prompt.mockReset()
    vi.stubGlobal('prompt', prompt)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(navigator, 'clipboard')
    Reflect.deleteProperty(document, 'execCommand')
  })

  it('writes the text with the Clipboard API when it is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboardApi(writeText)
    const execCommand = mockExecCommand(() => true)

    await expect(copyToClipboard(TEXT)).resolves.toBe(true)

    expect(writeText).toHaveBeenCalledWith(TEXT)
    expect(execCommand).not.toHaveBeenCalled()
    expect(prompt).not.toHaveBeenCalled()
  })

  it('falls back to execCommand when the Clipboard API is unavailable', async () => {
    mockClipboardApi()
    let selectedText: string | undefined
    const execCommand = mockExecCommand(() => {
      selectedText = document.getSelection()?.toString()
      return true
    })

    await expect(copyToClipboard(TEXT)).resolves.toBe(true)

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(selectedText).toBe(TEXT)
    expect(prompt).not.toHaveBeenCalled()
  })

  it('falls back to execCommand when the Clipboard API rejects', async () => {
    mockClipboardApi(rejectingWriteText())
    const execCommand = mockExecCommand(() => true)

    await expect(copyToClipboard(TEXT)).resolves.toBe(true)

    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('offers the text for manual copy when execCommand throws', async () => {
    mockClipboardApi()
    mockExecCommand(() => {
      throw new Error('unsupported')
    })

    await expect(copyToClipboard(TEXT)).resolves.toBe(false)

    expect(prompt).toHaveBeenCalledWith(expect.any(String), TEXT)
  })

  it('offers the text for manual copy when the Clipboard API rejects and execCommand fails', async () => {
    mockClipboardApi(rejectingWriteText())
    mockExecCommand(() => false)

    await expect(copyToClipboard(TEXT)).resolves.toBe(false)

    expect(prompt).toHaveBeenCalledWith(expect.any(String), TEXT)
  })

  it.each([
    ['succeeds', () => true],
    [
      'throws',
      () => {
        throw new Error('unsupported')
      }
    ]
  ])(
    'removes the helper element and restores the selection when execCommand %s',
    async (_outcome, implementation) => {
      mockClipboardApi()
      mockExecCommand(implementation)
      const anchor = document.createElement('p')
      anchor.textContent = 'previously selected'
      document.body.appendChild(anchor)
      const previousRange = document.createRange()
      previousRange.selectNodeContents(anchor)
      document.getSelection()?.addRange(previousRange)
      const childCount = document.body.childElementCount

      await copyToClipboard(TEXT)

      expect(document.body.childElementCount).toBe(childCount)
      expect(document.getSelection()?.toString()).toBe('previously selected')
      anchor.remove()
    }
  )
})

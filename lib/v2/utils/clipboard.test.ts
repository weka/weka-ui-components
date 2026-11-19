import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { copyToClipboard } from '#v2/utils/clipboard'

const TEXT = 'secret-token'
const FIELD_SELECTION_END = 5

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

  it('copies the text, not a focused field selection, and gives the field its focus and selection back', async () => {
    mockClipboardApi()
    const field = document.createElement('textarea')
    field.value = 'typed by the user'
    document.body.appendChild(field)
    field.focus()
    field.setSelectionRange(0, FIELD_SELECTION_END)
    let focusedDuringCopy: Element | null = null
    let selectedText: string | undefined
    mockExecCommand(() => {
      focusedDuringCopy = document.activeElement
      selectedText = document.getSelection()?.toString()
      return true
    })

    await copyToClipboard(TEXT)

    expect(focusedDuringCopy).not.toBe(field)
    expect(selectedText).toBe(TEXT)
    expect(document.activeElement).toBe(field)
    expect([field.selectionStart, field.selectionEnd]).toEqual([
      0,
      FIELD_SELECTION_END
    ])
    field.remove()
  })

  it('leaves a focused input without a text selection focused', async () => {
    mockClipboardApi()
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    document.body.appendChild(checkbox)
    checkbox.focus()
    const onBlur = vi.fn()
    checkbox.addEventListener('blur', onBlur)
    mockExecCommand(() => true)

    await expect(copyToClipboard(TEXT)).resolves.toBe(true)

    expect(onBlur).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(checkbox)
    checkbox.remove()
  })

  it('blurs a focused contenteditable for the copy and focuses it again', async () => {
    mockClipboardApi()
    const editor = document.createElement('div')
    editor.tabIndex = 0
    Object.defineProperty(editor, 'isContentEditable', { value: true })
    document.body.appendChild(editor)
    editor.focus()
    let focusedDuringCopy: Element | null = null
    let selectedText: string | undefined
    mockExecCommand(() => {
      focusedDuringCopy = document.activeElement
      selectedText = document.getSelection()?.toString()
      return true
    })

    await copyToClipboard(TEXT)

    expect(focusedDuringCopy).not.toBe(editor)
    expect(selectedText).toBe(TEXT)
    expect(document.activeElement).toBe(editor)
    editor.remove()
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

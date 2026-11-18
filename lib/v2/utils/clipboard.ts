import { DOM_EVENTS } from '#v2/utils/consts'

const COPY_COMMAND = 'copy'

/**
 * Selects a detached span instead of focusing a textarea: focus traps (MUI
 * dialogs) would steal focus back and clear the selection before the copy.
 */
const copyWithExecCommand = (text: string): boolean => {
  const span = document.createElement('span')
  span.textContent = text
  Object.assign(span.style, {
    position: 'fixed',
    top: '0',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'pre',
    userSelect: 'text'
  })
  span.addEventListener(DOM_EVENTS.COPY, (event) => {
    event.stopPropagation()
    if (event.clipboardData) {
      event.preventDefault()
      event.clipboardData.setData('text/plain', text)
    }
  })

  const selection = document.getSelection()
  const previousRanges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index)
      )
    : []

  document.body.appendChild(span)
  try {
    const range = document.createRange()
    range.selectNodeContents(span)
    selection?.removeAllRanges()
    selection?.addRange(range)
    // eslint-disable-next-line sonarjs/deprecation -- the Clipboard API is unavailable outside secure contexts (clusters served over plain HTTP)
    return document.execCommand(COPY_COMMAND)
  } catch {
    return false
  } finally {
    selection?.removeAllRanges()
    previousRanges.forEach((range) => selection?.addRange(range))
    span.remove()
  }
}

const copyWithClipboardApi = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return copyWithExecCommand(text)
  }
}

const getManualCopyMessage = () => {
  const shortcut = /mac|iphone|ipad/i.test(navigator.userAgent)
    ? '⌘+C'
    : 'Ctrl+C'
  return `Copy to clipboard: ${shortcut}, Enter`
}

/**
 * Writes plain text to the clipboard via the Clipboard API, falling back to
 * `execCommand` where the API is unavailable (non-secure contexts) or rejects.
 * When both fail, shows the text in a `window.prompt()` so the user can copy
 * it by hand. Resolves to whether the text reached the clipboard.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  const hasClipboardApi = Boolean(navigator.clipboard?.writeText)
  const isCopied = hasClipboardApi
    ? await copyWithClipboardApi(text)
    : copyWithExecCommand(text)
  if (!isCopied) {
    window.prompt(getManualCopyMessage(), text)
  }
  return isCopied
}

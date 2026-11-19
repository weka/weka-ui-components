import { createRef } from 'react'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { JsonEditor } from './JsonEditor'
import { type JsonEditorHandle } from './types'

const SEVERITY_TOKEN = '{{severity}}'
const SAMPLE_JSON = `{\n  "severity": "${SEVERITY_TOKEN}"\n}`
const TOKEN_CLASS = 'template-token'
const CONTENT_SELECTOR = '.cm-content'
/** Longer than the 300 ms JSON lint delay, so a lint pass would have run. */
const LINT_SETTLE_MS = 400

afterEach(cleanup)

function getContentText(container: HTMLElement): string {
  return container.querySelector(CONTENT_SELECTOR)?.textContent ?? EMPTY_STRING
}

describe('JsonEditor - rendering', () => {
  it('renders the value in the editor', () => {
    const { container } = render(
      <JsonEditor
        onChange={vi.fn()}
        value={SAMPLE_JSON}
      />
    )
    expect(getContentText(container)).toContain('"severity"')
  })

  it('renders a CodeMirror editor with the test id', () => {
    const { getByTestId } = render(
      <JsonEditor
        dataTestId='json-editor'
        onChange={vi.fn()}
        value='{}'
      />
    )
    expect(getByTestId('json-editor').querySelector('.cm-editor')).toBeTruthy()
  })

  it('makes content non-editable when readOnly', () => {
    const { container } = render(
      <JsonEditor
        readOnly
        value={SAMPLE_JSON}
      />
    )
    expect(
      container.querySelector(CONTENT_SELECTOR)?.getAttribute('contenteditable')
    ).toBe('false')
  })
})

describe('JsonEditor - value sync', () => {
  it('reflects an updated value prop', () => {
    const { container, rerender } = render(
      <JsonEditor
        onChange={vi.fn()}
        value='{}'
      />
    )
    rerender(
      <JsonEditor
        onChange={vi.fn()}
        value='{"a":1}'
      />
    )
    expect(getContentText(container)).toContain('"a"')
  })

  it('does not fire onChange when the value prop is synced in', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <JsonEditor
        onChange={onChange}
        value='{}'
      />
    )
    rerender(
      <JsonEditor
        onChange={onChange}
        value='{"a":1}'
      />
    )
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('JsonEditor - decorations', () => {
  it('applies the caller className to matched text', () => {
    const { container } = render(
      <JsonEditor
        decorations={[{ pattern: /\{\{\w+\}\}/g, className: TOKEN_CLASS }]}
        onChange={vi.fn()}
        value={SAMPLE_JSON}
      />
    )
    expect(container.querySelector(`.${TOKEN_CLASS}`)?.textContent).toBe(
      SEVERITY_TOKEN
    )
  })
})

describe('JsonEditor - reactive layout props', () => {
  it('toggles the line-number gutter when showLineNumbers changes', () => {
    const { container, rerender } = render(
      <JsonEditor
        onChange={vi.fn()}
        showLineNumbers
        value='{}'
      />
    )
    expect(container.querySelector('.cm-lineNumbers')).toBeTruthy()

    rerender(
      <JsonEditor
        onChange={vi.fn()}
        showLineNumbers={false}
        value='{}'
      />
    )
    expect(container.querySelector('.cm-lineNumbers')).toBeFalsy()
  })
})

describe('JsonEditor - imperative handle', () => {
  it('inserts text and reports it through onChange', () => {
    const onChange = vi.fn()
    const ref = createRef<JsonEditorHandle>()
    render(
      <JsonEditor
        ref={ref}
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    ref.current?.insert(SEVERITY_TOKEN)
    expect(onChange).toHaveBeenCalledWith(SEVERITY_TOKEN)
  })

  it('positions the caret inside the inserted text via cursorOffsetFromEnd', () => {
    const onChange = vi.fn()
    const ref = createRef<JsonEditorHandle>()
    render(
      <JsonEditor
        ref={ref}
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    ref.current?.insert('""', { cursorOffsetFromEnd: 1 })
    ref.current?.insert('X')
    expect(onChange).toHaveBeenLastCalledWith('"X"')
  })
})

describe('JsonEditor - validation', () => {
  it('reports JSON parse errors through onValidate', async () => {
    const onValidate = vi.fn()
    render(
      <JsonEditor
        onChange={vi.fn()}
        onValidate={onValidate}
        value='{ "a": }'
      />
    )

    await waitFor(() => {
      expect(onValidate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            text: expect.any(String),
            row: expect.any(Number)
          })
        ])
      )
    })
  })

  it('reports no errors through onValidate for valid JSON', async () => {
    const onValidate = vi.fn()
    render(
      <JsonEditor
        onChange={vi.fn()}
        onValidate={onValidate}
        value='{ "a": 1 }'
      />
    )

    await waitFor(() => {
      expect(onValidate).toHaveBeenCalledWith([])
    })
  })

  it('reports no errors through onValidate for an empty document', async () => {
    const onValidate = vi.fn()
    render(
      <JsonEditor
        onChange={vi.fn()}
        onValidate={onValidate}
        value={EMPTY_STRING}
      />
    )

    await waitFor(() => {
      expect(onValidate).toHaveBeenCalledWith([])
    })
    expect(onValidate).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.anything()])
    )
  })
})

describe('JsonEditor - copy button', () => {
  it('does not render a copy button by default', () => {
    const { queryByRole } = render(
      <JsonEditor
        readOnly
        value={SAMPLE_JSON}
      />
    )
    expect(queryByRole('button', { name: 'Copy' })).toBeNull()
  })

  it('copies the editor content to the clipboard on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    const { findByRole, getByRole } = render(
      <JsonEditor
        allowCopy
        readOnly
        value={SAMPLE_JSON}
      />
    )

    fireEvent.click(getByRole('button', { name: 'Copy' }))

    expect(writeText).toHaveBeenCalledWith(SAMPLE_JSON)
    expect(await findByRole('button', { name: 'Copied' })).toBeTruthy()
  })
})

describe('JsonEditor - text language', () => {
  const SLACK_TEMPLATE = ':bell: *Cluster:* {{cluster}}\n{{details'

  it('does not report JSON parse errors for plain text', async () => {
    const onValidate = vi.fn()
    render(
      <JsonEditor
        language='text'
        onValidate={onValidate}
        value={SLACK_TEMPLATE}
      />
    )
    await new Promise((resolve) => {
      setTimeout(resolve, LINT_SETTLE_MS)
    })
    expect(onValidate).not.toHaveBeenCalled()
  })

  it('reports JSON parse errors in the default language', async () => {
    const onValidate = vi.fn()
    render(
      <JsonEditor
        onValidate={onValidate}
        value={SLACK_TEMPLATE}
      />
    )
    await waitFor(() => {
      expect(onValidate).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ row: 0 })])
      )
    })
  })

  it('wraps long lines in text mode', () => {
    const { container } = render(
      <JsonEditor
        language='text'
        value={SLACK_TEMPLATE}
      />
    )
    expect(
      container
        .querySelector(CONTENT_SELECTOR)
        ?.classList.contains('cm-lineWrapping')
    ).toBe(true)
  })

  it('still decorates template variables in text mode', () => {
    const { container } = render(
      <JsonEditor
        decorations={[{ pattern: /\{\{\w+\}\}/g, className: TOKEN_CLASS }]}
        language='text'
        value={SLACK_TEMPLATE}
      />
    )
    expect(container.querySelector(`.${TOKEN_CLASS}`)?.textContent).toBe(
      '{{cluster}}'
    )
  })
})

describe('JsonEditor - Escape inside a dialog', () => {
  function pressEscape(
    container: HTMLElement,
    { handled }: { handled: boolean }
  ) {
    const content = container.querySelector(CONTENT_SELECTOR) as HTMLElement
    const markHandled = (event: Event) => event.preventDefault()
    if (handled) {
      // Stands in for CodeMirror's keymap, which consumes Escape to close completion.
      content.addEventListener('keydown', markHandled)
    }
    content.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      })
    )
    content.removeEventListener('keydown', markHandled)
  }

  it('keeps an Escape the editor handled from reaching the dialog', () => {
    const onDialogKeyDown = vi.fn()
    const { container } = render(
      <div onKeyDown={onDialogKeyDown}>
        <JsonEditor value='{}' />
      </div>
    )
    pressEscape(container, { handled: true })
    expect(onDialogKeyDown).not.toHaveBeenCalled()
  })

  it('lets an unhandled Escape reach the dialog', () => {
    const onDialogKeyDown = vi.fn()
    const { container } = render(
      <div onKeyDown={onDialogKeyDown}>
        <JsonEditor value='{}' />
      </div>
    )
    pressEscape(container, { handled: false })
    expect(onDialogKeyDown).toHaveBeenCalledTimes(1)
  })
})

import type { ParsedData } from './hooks'

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import TextEditorFull from './TextEditorFull'

vi.mock('react-ace', () => ({
  default: ({ value }: { value: string }) => (
    <pre data-testid='ace-value'>{value}</pre>
  )
}))
vi.mock('ace-builds/src-noconflict/mode-json', () => ({}))
vi.mock('ace-builds/src-noconflict/ext-searchbox', () => ({}))

const ONLY_MATCHING_LABEL = 'Show only matching lines'
const SEARCH_LABEL = 'Search for'
const MATCHING_KEY = 'alpha'
const OTHER_KEY = 'beta'
const DATA = { [MATCHING_KEY]: 1, [OTHER_KEY]: 2 }
const VALUE = JSON.stringify(DATA, null, 2)
const VALUE_FOR_MATCHED: ParsedData = Object.entries(DATA)

async function getEditorText() {
  return (await screen.findByTestId('ace-value')).textContent
}

function renderEditor(valueForMatched?: ParsedData) {
  return render(
    <TextEditorFull
      allowSearch
      readOnly
      value={VALUE}
      valueForMatched={valueForMatched}
    />
  )
}

async function enableOnlyMatching() {
  fireEvent.change(screen.getByLabelText(SEARCH_LABEL), {
    target: { value: MATCHING_KEY }
  })
  fireEvent.click(screen.getByLabelText(ONLY_MATCHING_LABEL))
  await waitFor(async () => {
    expect(await getEditorText()).not.toContain(OTHER_KEY)
  })
}

describe('TextEditorFull only matching lines', () => {
  beforeAll(() => {
    Object.assign(window, { ace: { config: { setModuleUrl: vi.fn() } } })
  })

  afterEach(cleanup)

  it('hides the toggle when there is no data to match against', async () => {
    renderEditor()

    await getEditorText()
    expect(screen.queryByLabelText(ONLY_MATCHING_LABEL)).toBeNull()
  })

  it('shows only matching entries when the toggle is checked', async () => {
    renderEditor(VALUE_FOR_MATCHED)

    await enableOnlyMatching()

    expect(await getEditorText()).toContain(MATCHING_KEY)
  })

  it('restores the full value and unchecks the toggle when search is closed', async () => {
    renderEditor(VALUE_FOR_MATCHED)
    await enableOnlyMatching()

    fireEvent.keyDown(screen.getByLabelText(SEARCH_LABEL), { key: 'Escape' })

    await waitFor(async () => {
      expect(await getEditorText()).toContain(OTHER_KEY)
    })
    expect(screen.queryByLabelText(ONLY_MATCHING_LABEL)).toBeNull()
  })

  it('restores the full value when the matched data goes away', async () => {
    const { rerender } = renderEditor(VALUE_FOR_MATCHED)
    await enableOnlyMatching()

    rerender(
      <TextEditorFull
        allowSearch
        readOnly
        value={VALUE}
      />
    )

    await waitFor(async () => {
      expect(await getEditorText()).toContain(OTHER_KEY)
    })
  })
})

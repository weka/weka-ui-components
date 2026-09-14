import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import Select from './Select'

const AMSTERDAM_LABEL = 'Europe/Amsterdam'
const AMSTERDAM_SUB_LABEL = '(GMT+2:00) Amsterdam, Berlin, Bern, Rome'
const TOKYO_LABEL = 'Asia/Tokyo'
const TOKYO_SUB_LABEL = '(GMT+9:00) Osaka, Sapporo, Tokyo'
const HONOLULU_LABEL = 'Pacific/Honolulu'
const HONOLULU_SUB_LABEL = '(GMT-10:00) Hawaii'
const NO_OPTIONS_TEXT = 'No options'
const MENU_SIZE = 300

const timeZoneOptions: Option[] = [
  {
    label: AMSTERDAM_LABEL,
    value: AMSTERDAM_LABEL,
    subLabel: AMSTERDAM_SUB_LABEL
  },
  { label: TOKYO_LABEL, value: TOKYO_LABEL, subLabel: TOKYO_SUB_LABEL },
  {
    label: HONOLULU_LABEL,
    value: HONOLULU_LABEL,
    subLabel: HONOLULU_SUB_LABEL
  }
]

const createProps = (overrides = {}) => ({
  options: timeZoneOptions,
  value: EMPTY_STRING,
  onChange: vi.fn(),
  ...overrides
})

function search(query: string) {
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: query }
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
  // The virtualised menu renders nothing unless its scroll container reports a
  // non-zero offset size, which happy-dom never does.
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(
    MENU_SIZE
  )
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(
    MENU_SIZE
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Select - Search functionality', () => {
  it('shows an option whose subLabel matches the search text', () => {
    render(<Select {...createProps()} />)

    search('Berlin')

    expect(screen.getByText(AMSTERDAM_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(TOKYO_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(HONOLULU_LABEL)).not.toBeInTheDocument()
  })

  it('shows an option whose label matches the search text', () => {
    render(<Select {...createProps()} />)

    search('Tokyo')

    expect(screen.getByText(TOKYO_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(HONOLULU_LABEL)).not.toBeInTheDocument()
  })

  it('matches subLabel text case-insensitively', () => {
    render(<Select {...createProps()} />)

    search('berlin')

    expect(screen.getByText(AMSTERDAM_LABEL)).toBeInTheDocument()
  })

  it('shows no options when the search text matches neither label nor subLabel', () => {
    render(<Select {...createProps()} />)

    search('zzzzz')

    expect(screen.getByText(NO_OPTIONS_TEXT)).toBeInTheDocument()
    expect(screen.queryByText(AMSTERDAM_LABEL)).not.toBeInTheDocument()
  })
})

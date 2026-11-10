import type { ChunkSearchBoxProps } from './ChunkSearchBox'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import ChunkSearchBox from './ChunkSearchBox'

const ONLY_MATCHING_LABEL = 'Show only matching lines'

function renderSearchBox(props: Partial<ChunkSearchBoxProps> = {}) {
  return render(
    <ChunkSearchBox
      currentMatch={0}
      isCaseSensitive={false}
      isRegex={false}
      isWholeWord={false}
      onCaseSensitiveChange={vi.fn()}
      onNext={vi.fn()}
      onPrev={vi.fn()}
      onRegexChange={vi.fn()}
      onSearchTermChange={vi.fn()}
      onWholeWordChange={vi.fn()}
      searchTerm={EMPTY_STRING}
      totalMatches={0}
      {...props}
    />
  )
}

describe('ChunkSearchBox only matching lines toggle', () => {
  afterEach(cleanup)

  it('is not rendered without a change handler', () => {
    renderSearchBox()

    expect(screen.queryByText(ONLY_MATCHING_LABEL)).toBeNull()
  })

  it('is rendered when a change handler is provided', () => {
    renderSearchBox({ onOnlyMatchingChange: vi.fn() })

    expect(screen.getByLabelText(ONLY_MATCHING_LABEL)).toBeTruthy()
  })

  it('reports the new checked state when clicked', () => {
    const onOnlyMatchingChange = vi.fn()
    renderSearchBox({ onOnlyMatchingChange, onlyMatching: false })

    fireEvent.click(screen.getByRole('checkbox'))

    expect(onOnlyMatchingChange).toHaveBeenCalledWith(true)
  })

  it('shows a spinner instead of the checkbox while loading', () => {
    renderSearchBox({
      isOnlyMatchingLoading: true,
      onOnlyMatchingChange: vi.fn()
    })

    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByRole('progressbar')).toBeTruthy()
    expect(
      screen.getByText(ONLY_MATCHING_LABEL).closest('label')?.getAttribute('aria-busy')
    ).toBe('true')
  })
})

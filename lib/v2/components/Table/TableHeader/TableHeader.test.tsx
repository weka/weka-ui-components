import type { ActiveFilter } from '../filterUtils'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import { TableHeader } from './TableHeader'

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' }
]
const SAMPLE_DATA = [{ name: 'a', region: 'us-east-1' }]
const ACTIVE_FILTERS: ActiveFilter[] = [
  {
    columnId: 'region',
    type: FILTER_TYPES.MULTISELECT,
    value: ['us-east-1'],
    label: 'Region'
  }
]

afterEach(() => {
  cleanup()
})

describe('TableHeader', () => {
  it('renders the title and count', () => {
    render(
      <TableHeader
        count={7}
        title='Clusters'
      />
    )
    expect(screen.getByTestId('table-header-title')).toHaveTextContent(
      'Clusters'
    )
    expect(screen.getByText('(7)')).toBeInTheDocument()
  })

  it('disables download with no data and enables it with data', () => {
    const { rerender } = render(
      <TableHeader
        columns={COLUMNS}
        data={[]}
        title='Clusters'
      />
    )
    expect(screen.getByTestId('table-download-button')).toBeDisabled()
    rerender(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        title='Clusters'
      />
    )
    expect(screen.getByTestId('table-download-button')).not.toBeDisabled()
  })

  it('opens the settings menu with a row per column', () => {
    render(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        title='Clusters'
      />
    )
    fireEvent.click(screen.getByTestId('table-settings-button'))
    expect(screen.getByTestId('table-settings-menu')).toBeInTheDocument()
    expect(
      screen.getByTestId('table-settings-column-option-name')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('table-settings-column-option-region')
    ).toBeInTheDocument()
  })

  it('renders filter chips for active filters', () => {
    render(
      <TableHeader
        activeFilters={ACTIVE_FILTERS}
        onClearAllFilters={vi.fn()}
        onRemoveFilter={vi.fn()}
        title='Clusters'
      />
    )
    expect(screen.getByTestId('filter-chip-region')).toBeInTheDocument()
  })
})

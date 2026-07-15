import type { ActiveFilter } from '../filterUtils'
import type { ComponentProps } from 'react'

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NOP } from '#consts'
import { FILTER_TYPES } from '#v2/utils/consts'

import { TableHeader } from './TableHeader'

type MockTable = ComponentProps<typeof TableHeader>['table']

const createTableMock = (
  columnVisibility: Record<string, boolean>,
  setColumnVisibility = vi.fn()
): MockTable =>
  ({
    getState: () => ({ columnVisibility }),
    getFilteredRowModel: () => ({ rows: [] }),
    setColumnVisibility
  } as unknown as MockTable)

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' }
]
const SAMPLE_DATA = [{ name: 'a', region: 'us-east-1' }]
const SETTINGS_BUTTON_TESTID = 'table-settings-button'
const DOWNLOAD_BUTTON_TESTID = 'table-download-button'
const TABLE_TITLE = 'Clusters'
const NAME_OPTION_TESTID = 'table-settings-column-option-name'
const REGION_OPTION_TESTID = 'table-settings-column-option-region'
const CHECKBOX_TESTID = 'custom-checkbox'
const ARIA_DISABLED = 'aria-disabled'
const ARIA_DISABLED_FALSE = 'false'
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
        title={TABLE_TITLE}
      />
    )
    expect(screen.getByTestId('table-header-title')).toHaveTextContent(
      TABLE_TITLE
    )
    expect(screen.getByText('(7)')).toBeInTheDocument()
  })

  it('disables download with no data and enables it with data', () => {
    const { rerender } = render(
      <TableHeader
        columns={COLUMNS}
        data={[]}
        title={TABLE_TITLE}
      />
    )
    expect(screen.getByTestId(DOWNLOAD_BUTTON_TESTID)).toBeDisabled()
    rerender(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        title={TABLE_TITLE}
      />
    )
    expect(screen.getByTestId(DOWNLOAD_BUTTON_TESTID)).not.toBeDisabled()
  })

  it('hides the csv download button when showCsvDownload is false', () => {
    render(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        showCsvDownload={false}
        title='Volumes'
      />
    )
    expect(screen.queryByTestId(DOWNLOAD_BUTTON_TESTID)).not.toBeInTheDocument()
  })

  it.each([
    {
      description: 'slugifies the title and appends a UTC timestamp',
      title: TABLE_TITLE,
      expectedFilename: 'clusters_2026-07-14T00-03-09Z.csv'
    },
    {
      description: 'strips a trailing .csv, forbidden and control characters',
      title: '  Weird\u007F: Name?.CSV ',
      expectedFilename: 'weird_name_2026-07-14T00-03-09Z.csv'
    },
    {
      description: 'falls back to a generic slug when nothing usable remains',
      title: '<>:"/\\|?*',
      expectedFilename: 'export_2026-07-14T00-03-09Z.csv'
    }
  ])('$description when naming the downloaded csv', ({
    title,
    expectedFilename
  }) => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2026-07-14T00:03:09.123Z'))
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(NOP)
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(NOP)

      render(
        <TableHeader
          columns={COLUMNS}
          data={SAMPLE_DATA}
          title={title}
        />
      )
      fireEvent.click(screen.getByTestId(DOWNLOAD_BUTTON_TESTID))

      const link = clickSpy.mock.contexts[0] as HTMLAnchorElement
      expect(link.getAttribute('download')).toBe(expectedFilename)
    } finally {
      vi.restoreAllMocks()
      vi.useRealTimers()
    }
  })

  it('opens the settings menu with a row per column', () => {
    render(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        title={TABLE_TITLE}
      />
    )
    fireEvent.click(screen.getByTestId(SETTINGS_BUTTON_TESTID))
    expect(screen.getByTestId('table-settings-menu')).toBeInTheDocument()
    expect(screen.getByTestId(NAME_OPTION_TESTID)).toBeInTheDocument()
    expect(screen.getByTestId(REGION_OPTION_TESTID)).toBeInTheDocument()
  })

  it('disables the toggle for the only remaining visible column', () => {
    render(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        table={createTableMock({ region: false })}
        title={TABLE_TITLE}
      />
    )
    fireEvent.click(screen.getByTestId(SETTINGS_BUTTON_TESTID))

    const nameOption = screen.getByTestId(NAME_OPTION_TESTID)
    const regionOption = screen.getByTestId(REGION_OPTION_TESTID)
    expect(within(nameOption).getByTestId(CHECKBOX_TESTID)).toHaveAttribute(
      ARIA_DISABLED,
      'true'
    )
    expect(within(regionOption).getByTestId(CHECKBOX_TESTID)).toHaveAttribute(
      ARIA_DISABLED,
      ARIA_DISABLED_FALSE
    )
  })

  it('does not hide the last visible column when its disabled toggle is clicked', () => {
    const setColumnVisibility = vi.fn()
    render(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        table={createTableMock({ region: false }, setColumnVisibility)}
        title={TABLE_TITLE}
      />
    )
    fireEvent.click(screen.getByTestId(SETTINGS_BUTTON_TESTID))

    const nameOption = screen.getByTestId(NAME_OPTION_TESTID)
    fireEvent.click(within(nameOption).getByTestId(CHECKBOX_TESTID))

    expect(setColumnVisibility).not.toHaveBeenCalled()
  })

  it('keeps both toggles enabled while more than one column is visible', () => {
    render(
      <TableHeader
        columns={COLUMNS}
        data={SAMPLE_DATA}
        table={createTableMock({})}
        title={TABLE_TITLE}
      />
    )
    fireEvent.click(screen.getByTestId(SETTINGS_BUTTON_TESTID))

    const nameOption = screen.getByTestId(NAME_OPTION_TESTID)
    const regionOption = screen.getByTestId(REGION_OPTION_TESTID)
    expect(within(nameOption).getByTestId(CHECKBOX_TESTID)).toHaveAttribute(
      ARIA_DISABLED,
      ARIA_DISABLED_FALSE
    )
    expect(within(regionOption).getByTestId(CHECKBOX_TESTID)).toHaveAttribute(
      ARIA_DISABLED,
      ARIA_DISABLED_FALSE
    )
  })

  it('renders filter chips for active filters', () => {
    render(
      <TableHeader
        activeFilters={ACTIVE_FILTERS}
        onClearAllFilters={vi.fn()}
        onRemoveFilter={vi.fn()}
        title={TABLE_TITLE}
      />
    )
    expect(screen.getByTestId('filter-chip-region')).toBeInTheDocument()
  })
})

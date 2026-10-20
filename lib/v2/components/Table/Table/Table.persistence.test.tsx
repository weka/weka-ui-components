import type { ColumnDef } from '@tanstack/react-table'

import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Table } from './Table'

interface Item {
  id: number
  name: string
  region: string
}

const NAME_COLUMN_SIZE = 200

const COLUMNS: ColumnDef<Item>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID', size: 100 },
  { id: 'name', accessorKey: 'name', header: 'Name', size: NAME_COLUMN_SIZE },
  { id: 'region', accessorKey: 'region', header: 'Region', size: 150 }
]

const DATA: Item[] = [
  { id: 1, name: 'Item 1', region: 'us' },
  { id: 2, name: 'Item 2', region: 'eu' }
]

const SETTINGS_BUTTON_TESTID = 'table-settings-button'
const RESET_DEFAULTS_TESTID = 'table-settings-reset-defaults'
const DEFAULT_SECTION_TESTID = 'table-settings-default-columns'
const MORE_SECTION_TESTID = 'table-settings-more-columns'
const NAME_RESIZER_TESTID = 'column-resizer-name'
const REGION_OPTION_TESTID = 'table-settings-column-option-region'
const NAME_OPTION_TESTID = 'table-settings-column-option-name'
const RESIZE_DELTA = 80
const RESET_COLUMN_RESIZING_TEXT = 'Reset Column Resizing'

const findHeaderCell = (label: string) =>
  Array.from(document.querySelectorAll('thead th')).find((cell) =>
    cell.textContent?.includes(label)
  ) as HTMLElement | undefined

const getHeaderWidth = (label: string) => findHeaderCell(label)?.style.width

const openSettingsMenu = () => {
  fireEvent.click(screen.getByTestId(SETTINGS_BUTTON_TESTID))
}

const dragResizer = (testId: string, deltaX: number) => {
  const resizer = screen.getByTestId(testId)
  fireEvent.mouseDown(resizer, { clientX: 0 })
  fireEvent.mouseMove(document, { clientX: deltaX / 2 })
  fireEvent.mouseMove(document, { clientX: deltaX })
  fireEvent.mouseUp(document, { clientX: deltaX })
}

describe('Table persisted customizations', () => {
  describe('initialColumnSizing', () => {
    it('renders the seeded widths on first paint', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          initialColumnSizing={{ name: 320 }}
        />
      )
      expect(getHeaderWidth('Name')).toBe('320px')
      expect(getHeaderWidth('ID')).toBe('100px')
    })
  })

  describe('onColumnSizingChange', () => {
    it('does not fire on mount', () => {
      const onColumnSizingChange = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onColumnSizingChange={onColumnSizingChange}
        />
      )
      expect(onColumnSizingChange).not.toHaveBeenCalled()
    })

    it('does not fire while a resize is in progress', () => {
      const onColumnSizingChange = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onColumnSizingChange={onColumnSizingChange}
        />
      )
      fireEvent.mouseDown(screen.getByTestId(NAME_RESIZER_TESTID), {
        clientX: 0
      })
      fireEvent.mouseMove(document, { clientX: 40 })
      fireEvent.mouseMove(document, { clientX: 80 })
      expect(onColumnSizingChange).not.toHaveBeenCalled()
      fireEvent.mouseUp(document, { clientX: 80 })
    })

    it('fires once with the resulting widths when the resize ends', () => {
      const onColumnSizingChange = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onColumnSizingChange={onColumnSizingChange}
        />
      )
      dragResizer(NAME_RESIZER_TESTID, RESIZE_DELTA)
      expect(onColumnSizingChange).toHaveBeenCalledTimes(1)
      expect(onColumnSizingChange).toHaveBeenCalledWith({
        name: NAME_COLUMN_SIZE + RESIZE_DELTA
      })
    })
  })

  describe('reset column resizing without onResetToDefaults', () => {
    it('restores column definition sizes even when initialColumnSizing was given', () => {
      const onResetColumnSizing = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          initialColumnSizing={{ name: 320 }}
          onResetColumnSizing={onResetColumnSizing}
        />
      )
      openSettingsMenu()
      fireEvent.click(screen.getByText(RESET_COLUMN_RESIZING_TEXT))
      expect(getHeaderWidth('Name')).toBe('200px')
      expect(onResetColumnSizing).toHaveBeenCalledTimes(1)
    })

    it('keeps the legacy reset item and no defaults item', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
        />
      )
      openSettingsMenu()
      expect(screen.getByText(RESET_COLUMN_RESIZING_TEXT)).toBeInTheDocument()
      expect(
        screen.queryByTestId(RESET_DEFAULTS_TESTID)
      ).not.toBeInTheDocument()
    })
  })
})

describe('Table settings menu persistence', () => {
  describe('settings menu grouping', () => {
    it('stays flat without defaultColumnVisibility', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
        />
      )
      openSettingsMenu()
      expect(
        screen.queryByTestId(DEFAULT_SECTION_TESTID)
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId(MORE_SECTION_TESTID)).not.toBeInTheDocument()
      expect(screen.getByTestId(REGION_OPTION_TESTID)).toBeInTheDocument()
    })

    it('splits columns into default and more sections', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          defaultColumnVisibility={{ region: false }}
        />
      )
      openSettingsMenu()
      const defaults = screen.getByTestId(DEFAULT_SECTION_TESTID)
      const more = screen.getByTestId(MORE_SECTION_TESTID)
      expect(defaults).toHaveTextContent('Default columns')
      expect(more).toHaveTextContent('More columns')
      expect(defaults).toContainElement(screen.getByTestId(NAME_OPTION_TESTID))
      expect(defaults).not.toContainElement(
        screen.getByTestId(REGION_OPTION_TESTID)
      )
      expect(more).toContainElement(screen.getByTestId(REGION_OPTION_TESTID))
    })

    it('still toggles visibility from the grouped rows', () => {
      const onColumnVisibilityChange = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          defaultColumnVisibility={{ region: false }}
          initialColumnVisibility={{ region: false }}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />
      )
      openSettingsMenu()
      fireEvent.click(screen.getByTestId(REGION_OPTION_TESTID))
      expect(onColumnVisibilityChange).toHaveBeenCalledWith(
        expect.objectContaining({ region: true })
      )
    })

    it('uses overridden section labels', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          defaultColumnVisibility={{ region: false }}
          labels={{ defaultColumns: 'Standard', moreColumns: 'Extras' }}
        />
      )
      openSettingsMenu()
      expect(screen.getByTestId(DEFAULT_SECTION_TESTID)).toHaveTextContent(
        'Standard'
      )
      expect(screen.getByTestId(MORE_SECTION_TESTID)).toHaveTextContent(
        'Extras'
      )
    })
  })
})

describe('Table onResetToDefaults', () => {
  describe('onResetToDefaults', () => {
    it('shows "Reset to defaults" instead of the legacy item', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onResetToDefaults={vi.fn()}
        />
      )
      openSettingsMenu()
      expect(screen.getByTestId(RESET_DEFAULTS_TESTID)).toHaveTextContent(
        'Reset to defaults'
      )
      expect(
        screen.queryByText(RESET_COLUMN_RESIZING_TEXT)
      ).not.toBeInTheDocument()
    })

    it('uses the overridden reset label', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          labels={{ resetToDefaults: 'Restore' }}
          onResetToDefaults={vi.fn()}
        />
      )
      openSettingsMenu()
      expect(screen.getByTestId(RESET_DEFAULTS_TESTID)).toHaveTextContent(
        'Restore'
      )
    })

    it('restores widths, visibility and sort, then calls the callback', () => {
      const onResetToDefaults = vi.fn()
      const onColumnVisibilityChange = vi.fn()
      const onExternalSortingChange = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          defaultColumnVisibility={{ region: false }}
          defaultSortColumn='id'
          defaultSortDirection='asc'
          initialColumnSizing={{ name: 320 }}
          initialColumnVisibility={{ region: true, id: false }}
          onColumnVisibilityChange={onColumnVisibilityChange}
          onExternalSortingChange={onExternalSortingChange}
          onResetToDefaults={onResetToDefaults}
        />
      )
      act(() => {
        findHeaderCell('Name')?.querySelector('button')?.click()
      })
      expect(onExternalSortingChange).toHaveBeenLastCalledWith([
        { id: 'name', desc: false }
      ])
      openSettingsMenu()
      fireEvent.click(screen.getByTestId(RESET_DEFAULTS_TESTID))

      expect(getHeaderWidth('Name')).toBe('200px')
      expect(findHeaderCell('Region')).toBeUndefined()
      expect(findHeaderCell('ID')).toBeDefined()
      expect(onColumnVisibilityChange).toHaveBeenLastCalledWith({
        region: false
      })
      expect(onExternalSortingChange).toHaveBeenLastCalledWith([
        { id: 'id', desc: false }
      ])
      expect(onResetToDefaults).toHaveBeenCalledTimes(1)
    })

    it('calls onResetToDefaults once, after the reset notifications', () => {
      const calls: string[] = []
      const onResetToDefaults = vi.fn(() => calls.push('reset'))
      const onColumnVisibilityChange = vi.fn(() => calls.push('visibility'))
      const onExternalSortingChange = vi.fn(() => calls.push('sorting'))
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          defaultColumnVisibility={{ region: false }}
          defaultSortColumn='id'
          defaultSortDirection='asc'
          initialColumnVisibility={{ region: true }}
          onColumnVisibilityChange={onColumnVisibilityChange}
          onExternalSortingChange={onExternalSortingChange}
          onResetToDefaults={onResetToDefaults}
        />
      )
      act(() => {
        findHeaderCell('Name')?.querySelector('button')?.click()
      })
      calls.length = 0
      openSettingsMenu()
      fireEvent.click(screen.getByTestId(RESET_DEFAULTS_TESTID))

      expect(calls).toEqual(['visibility', 'sorting', 'reset'])
    })

    it('still calls onResetToDefaults once when nothing was changed', () => {
      const onResetToDefaults = vi.fn()
      const onColumnVisibilityChange = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onColumnVisibilityChange={onColumnVisibilityChange}
          onResetToDefaults={onResetToDefaults}
        />
      )
      openSettingsMenu()
      fireEvent.click(screen.getByTestId(RESET_DEFAULTS_TESTID))

      expect(onResetToDefaults).toHaveBeenCalledTimes(1)
      expect(onColumnVisibilityChange.mock.invocationCallOrder[0]).toBeLessThan(
        onResetToDefaults.mock.invocationCallOrder[0]
      )
    })

    it('derives default visibility from meta.defaultHidden when defaultColumnVisibility is absent', () => {
      const columns: ColumnDef<Item>[] = [
        COLUMNS[0],
        COLUMNS[1],
        { ...COLUMNS[2], meta: { defaultHidden: true } }
      ]
      render(
        <Table
          columns={columns}
          data={DATA}
          initialColumnVisibility={{ id: true, name: true, region: true }}
          onResetToDefaults={vi.fn()}
        />
      )
      expect(findHeaderCell('Region')).toBeDefined()
      openSettingsMenu()
      fireEvent.click(screen.getByTestId(RESET_DEFAULTS_TESTID))
      expect(findHeaderCell('Region')).toBeUndefined()
    })
  })
})

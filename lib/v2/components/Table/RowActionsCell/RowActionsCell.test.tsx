import type { RowAction } from '../Table'
import type { CellContext } from '@tanstack/react-table'

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RowActionsCell } from './RowActionsCell'

interface TestRow {
  id: string
  name: string
}

const SAMPLE_ROW: TestRow = { id: 'r1', name: 'Item 1' }

const ROW_ACTIONS_BUTTON_TESTID = 'row-actions-button'
const EDIT_ACTION_TESTID = 'row-action-edit'
const EDIT_TEXT = 'Edit'

function buildCellContext(
  rowActions: RowAction<TestRow>[] | undefined
): CellContext<TestRow, unknown> {
  return {
    row: { original: SAMPLE_ROW },
    column: { columnDef: { meta: rowActions ? { rowActions } : undefined } }
  } as unknown as CellContext<TestRow, unknown>
}

function renderCell(rowActions?: RowAction<TestRow>[]) {
  return render(<RowActionsCell {...buildCellContext(rowActions)} />)
}

afterEach(() => {
  cleanup()
})

describe('RowActionsCell', () => {
  it('renders nothing when no rowActions meta is provided', () => {
    const { container } = renderCell()
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when every action is hidden for the row', () => {
    renderCell([
      { key: 'edit', text: EDIT_TEXT, action: vi.fn(), hideAction: () => true }
    ])
    expect(
      screen.queryByTestId(ROW_ACTIONS_BUTTON_TESTID)
    ).not.toBeInTheDocument()
  })

  it('renders the kebab button when there is at least one visible action', () => {
    renderCell([{ key: 'edit', text: EDIT_TEXT, action: vi.fn() }])
    expect(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID)).toBeInTheDocument()
  })

  it('opens the menu and shows visible actions on click', () => {
    renderCell([
      { key: 'edit', text: EDIT_TEXT, action: vi.fn() },
      { key: 'delete', text: 'Delete', action: vi.fn() }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(screen.getByTestId(EDIT_ACTION_TESTID)).toBeInTheDocument()
    expect(screen.getByTestId('row-action-delete')).toBeInTheDocument()
  })

  it('closes the menu when the kebab button is clicked again', () => {
    renderCell([{ key: 'edit', text: EDIT_TEXT, action: vi.fn() }])
    const button = screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID)
    fireEvent.click(button)
    expect(screen.getByTestId(EDIT_ACTION_TESTID)).toBeInTheDocument()
    fireEvent.click(button)
    expect(screen.queryByTestId(EDIT_ACTION_TESTID)).not.toBeInTheDocument()
  })

  it('does not reopen the menu when actions become hidden then visible again', () => {
    const visible: RowAction<TestRow>[] = [
      { key: 'edit', text: EDIT_TEXT, action: vi.fn(), hideAction: () => false }
    ]
    const hidden: RowAction<TestRow>[] = [
      { key: 'edit', text: EDIT_TEXT, action: vi.fn(), hideAction: () => true }
    ]
    const { rerender } = render(
      <RowActionsCell {...buildCellContext(visible)} />
    )

    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(screen.getByTestId(EDIT_ACTION_TESTID)).toBeInTheDocument()

    rerender(<RowActionsCell {...buildCellContext(hidden)} />)
    expect(
      screen.queryByTestId(ROW_ACTIONS_BUTTON_TESTID)
    ).not.toBeInTheDocument()

    rerender(<RowActionsCell {...buildCellContext(visible)} />)
    expect(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID)).toBeInTheDocument()
    expect(screen.queryByTestId(EDIT_ACTION_TESTID)).not.toBeInTheDocument()
  })

  it('does not render actions whose hideAction returns true', () => {
    renderCell([
      { key: 'edit', text: EDIT_TEXT, action: vi.fn() },
      {
        key: 'archive',
        text: 'Archive',
        action: vi.fn(),
        hideAction: () => true
      }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(screen.getByTestId(EDIT_ACTION_TESTID)).toBeInTheDocument()
    expect(screen.queryByTestId('row-action-archive')).not.toBeInTheDocument()
  })

  it('renders an action as disabled when disabled returns true', () => {
    renderCell([
      { key: 'delete', text: 'Delete', action: vi.fn(), disabled: () => true }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(screen.getByTestId('row-action-delete')).toBeDisabled()
  })

  it('calls the action with the row data when a menu item is clicked', () => {
    const editAction = vi.fn()
    renderCell([{ key: 'edit', text: EDIT_TEXT, action: editAction }])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    fireEvent.click(screen.getByTestId(EDIT_ACTION_TESTID))
    expect(editAction).toHaveBeenCalledWith(SAMPLE_ROW)
  })

  it('passes the row to hideAction and disabled predicates', () => {
    const hideAction = vi.fn(() => false)
    const disabled = vi.fn(() => false)
    renderCell([
      { key: 'edit', text: EDIT_TEXT, action: vi.fn(), hideAction, disabled }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(hideAction).toHaveBeenCalledWith(SAMPLE_ROW)
    expect(disabled).toHaveBeenCalledWith(SAMPLE_ROW)
  })

  it('renders custom content when an action provides it', () => {
    const CUSTOM_CONTENT = 'custom-action-content'
    renderCell([
      {
        key: 'custom',
        action: vi.fn(),
        content: () => <span>{CUSTOM_CONTENT}</span>
      }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(screen.getByText(CUSTOM_CONTENT)).toBeInTheDocument()
  })

  it('does not propagate the kebab click to a parent handler', () => {
    const onParentClick = vi.fn()
    render(
      <div onClick={onParentClick}>
        <RowActionsCell
          {...buildCellContext([
            { key: 'edit', text: EDIT_TEXT, action: vi.fn() }
          ])}
        />
      </div>
    )
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    expect(onParentClick).not.toHaveBeenCalled()
  })

  it('does not propagate a header-action click to a parent handler', () => {
    const onParentClick = vi.fn()
    render(
      <div onClick={onParentClick}>
        <RowActionsCell
          {...buildCellContext([
            { key: 'section', text: 'Section', header: true },
            { key: 'edit', text: EDIT_TEXT, action: vi.fn() }
          ])}
        />
      </div>
    )
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    fireEvent.click(screen.getByTestId('row-action-section'))
    expect(onParentClick).not.toHaveBeenCalled()
  })

  it('does not propagate a menu item click to a parent handler', () => {
    const onParentClick = vi.fn()
    render(
      <div onClick={onParentClick}>
        <RowActionsCell
          {...buildCellContext([
            { key: 'edit', text: EDIT_TEXT, action: vi.fn() }
          ])}
        />
      </div>
    )
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    fireEvent.click(screen.getByTestId(EDIT_ACTION_TESTID))
    expect(onParentClick).not.toHaveBeenCalled()
  })
})

const SYNC_ACTION_TESTID = 'row-action-sync'

describe('RowActionsCell - disabledTooltip', () => {
  it('shows the disabled-reason tooltip on hover when disabled', async () => {
    renderCell([
      {
        key: 'sync',
        text: 'Sync',
        action: vi.fn(),
        disabled: () => true,
        disabledTooltip: 'No local Object Store bucket attached'
      }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    const item = screen.getByTestId(SYNC_ACTION_TESTID)
    expect(item).toBeDisabled()

    fireEvent.mouseOver(item)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(
        screen.getByText('No local Object Store bucket attached')
      ).toBeInTheDocument()
    })
  })

  it('resolves a function-form disabledTooltip with the row', async () => {
    const disabledTooltip = vi.fn(() => 'reason for r1')
    renderCell([
      {
        key: 'sync',
        text: 'Sync',
        action: vi.fn(),
        disabled: () => true,
        disabledTooltip
      }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    fireEvent.mouseOver(screen.getByTestId(SYNC_ACTION_TESTID))
    await waitFor(() => {
      expect(screen.getByText('reason for r1')).toBeInTheDocument()
    })
    expect(disabledTooltip).toHaveBeenCalledWith(SAMPLE_ROW)
  })

  it('does not wrap an enabled action in a tooltip even if disabledTooltip is set', () => {
    renderCell([
      {
        key: 'sync',
        text: 'Sync',
        action: vi.fn(),
        disabled: () => false,
        disabledTooltip: 'should not show'
      }
    ])
    fireEvent.click(screen.getByTestId(ROW_ACTIONS_BUTTON_TESTID))
    const item = screen.getByTestId(SYNC_ACTION_TESTID)
    expect(item).not.toBeDisabled()
    fireEvent.mouseOver(item)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})

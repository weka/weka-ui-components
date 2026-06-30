import type { Tab } from '../tabsConstants'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TabEditableActions } from './TabEditableActions'

const TAB_ID = 'tab-1'
const baseTab: Tab = { id: TAB_ID, label: 'Tab 1' }

const createProps = (overrides = {}) => ({
  canDelete: true,
  onDelete: vi.fn(),
  onStartEdit: vi.fn(),
  tab: baseTab,
  ...overrides
})

describe('TabEditableActions', () => {
  it('renders rename and delete buttons', () => {
    render(<TabEditableActions {...createProps()} />)

    expect(screen.getByTitle('Rename')).toBeInTheDocument()
    expect(screen.getByTitle('Delete')).toBeInTheDocument()
  })

  it('does not render the delete button when canDelete is false', () => {
    render(<TabEditableActions {...createProps({ canDelete: false })} />)

    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
  })

  it('hides rename and delete for a locked tab', () => {
    render(
      <TabEditableActions
        {...createProps({ tab: { ...baseTab, isLocked: true } })}
      />
    )

    expect(screen.queryByTitle('Rename')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
  })

  it('renders the restore button only when onRestore is provided', () => {
    const onRestore = vi.fn()
    render(<TabEditableActions {...createProps({ onRestore })} />)

    fireEvent.click(screen.getByTitle('Restore template'))

    expect(onRestore).toHaveBeenCalledWith(expect.anything(), TAB_ID)
  })

  it('calls onStartEdit and onDelete with the tab id', () => {
    const onStartEdit = vi.fn()
    const onDelete = vi.fn()
    render(<TabEditableActions {...createProps({ onStartEdit, onDelete })} />)

    fireEvent.click(screen.getByTitle('Rename'))
    expect(onStartEdit).toHaveBeenCalledWith(expect.anything(), TAB_ID, 'Tab 1')

    fireEvent.click(screen.getByTitle('Delete'))
    expect(onDelete).toHaveBeenCalledWith(expect.anything(), TAB_ID)
  })
})

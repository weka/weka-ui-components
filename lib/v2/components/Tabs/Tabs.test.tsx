import type { Tab } from './tabsConstants'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Tabs } from './Tabs'
import { TAB_VARIANTS } from './tabsConstants'

const TAB_ONE_LABEL = 'Tab 1'
const TAB_ONE_ID = 'tab-1'
const RENAME_TITLE = 'Rename'
const DELETE_TITLE = 'Delete'
const ADD_BUTTON_TESTID = 'tab-add-button'

const createTab = (overrides: Partial<Tab> = {}): Tab => ({
  id: TAB_ONE_ID,
  label: TAB_ONE_LABEL,
  ...overrides
})

const createProps = (overrides = {}) => ({
  tabs: [
    createTab({ id: TAB_ONE_ID, label: TAB_ONE_LABEL }),
    createTab({ id: 'tab-2', label: 'Tab 2' }),
    createTab({ id: 'tab-3', label: 'Tab 3' })
  ],
  activeTab: TAB_ONE_ID,
  onTabChange: vi.fn(),
  ...overrides
})

const getContainerClassName = () =>
  screen.getByText(TAB_ONE_LABEL).closest('[class*="tabsContainer"]')?.className

const editableProps = () => ({
  ...createProps(),
  variant: TAB_VARIANTS.EDITABLE,
  onAddTab: vi.fn(),
  onDeleteTab: vi.fn(),
  onRenameTab: vi.fn()
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Tabs - Rendering', () => {
  it('renders all tabs', () => {
    render(<Tabs {...createProps()} />)

    expect(screen.getByText(TAB_ONE_LABEL)).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('renders with primary variant by default', () => {
    render(<Tabs {...createProps()} />)

    expect(getContainerClassName()).toMatch(/primary/)
  })

  it('renders with underline variant', () => {
    render(<Tabs {...createProps({ variant: TAB_VARIANTS.UNDERLINE })} />)

    expect(getContainerClassName()).toMatch(/underline/)
  })

  it('applies extraClass when provided', () => {
    render(<Tabs {...createProps({ extraClass: 'custom-class' })} />)

    expect(getContainerClassName()).toContain('custom-class')
  })

  it('renders tab count when provided', () => {
    render(
      <Tabs
        {...createProps({
          tabs: [createTab({ id: TAB_ONE_ID, label: TAB_ONE_LABEL, count: 42 })]
        })}
      />
    )

    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders count in parentheses for underline variant', () => {
    render(
      <Tabs
        {...createProps({
          variant: TAB_VARIANTS.UNDERLINE,
          tabs: [createTab({ id: TAB_ONE_ID, label: TAB_ONE_LABEL, count: 42 })]
        })}
      />
    )

    expect(screen.getByText('(42)')).toBeInTheDocument()
  })
})

describe('Tabs - Tab Selection', () => {
  it('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn()
    render(<Tabs {...createProps({ onTabChange })} />)

    fireEvent.click(screen.getByText('Tab 2'))

    expect(onTabChange).toHaveBeenCalledWith('tab-2', undefined)
  })

  it('passes subTab to onTabChange when provided', () => {
    const onTabChange = vi.fn()
    render(
      <Tabs
        {...createProps({
          onTabChange,
          tabs: [
            createTab({
              id: TAB_ONE_ID,
              label: TAB_ONE_LABEL,
              subTab: 'details'
            })
          ]
        })}
      />
    )

    fireEvent.click(screen.getByText(TAB_ONE_LABEL))

    expect(onTabChange).toHaveBeenCalledWith(TAB_ONE_ID, 'details')
  })

  it('marks active tab with data-active attribute', () => {
    render(<Tabs {...createProps({ activeTab: 'tab-2' })} />)

    expect(screen.getByTestId('tab-tab-2')).toHaveAttribute(
      'data-active',
      'true'
    )
  })
})

describe('Tabs - Editable Variant', () => {
  it('renders add button when onAddTab is provided', () => {
    render(<Tabs {...editableProps()} />)

    expect(screen.getByTestId(ADD_BUTTON_TESTID)).toBeInTheDocument()
  })

  it('calls onAddTab when add button is clicked', () => {
    const onAddTab = vi.fn()
    render(
      <Tabs
        {...editableProps()}
        onAddTab={onAddTab}
      />
    )

    fireEvent.click(screen.getByTestId(ADD_BUTTON_TESTID))

    expect(onAddTab).toHaveBeenCalled()
  })

  it('does not render add button when maxTabs is reached', () => {
    render(
      <Tabs
        {...editableProps()}
        maxTabs={3}
      />
    )

    expect(screen.queryByTestId(ADD_BUTTON_TESTID)).not.toBeInTheDocument()
  })

  it('renders delete button on tabs', () => {
    render(<Tabs {...editableProps()} />)

    expect(screen.getAllByTitle(DELETE_TITLE).length).toBeGreaterThan(0)
  })

  it('does not allow delete when at minTabs', () => {
    render(
      <Tabs
        {...editableProps()}
        minTabs={3}
      />
    )

    expect(screen.queryAllByTitle(DELETE_TITLE).length).toBe(0)
  })

  it('renders rename button on tabs', () => {
    render(<Tabs {...editableProps()} />)

    expect(screen.getAllByTitle(RENAME_TITLE).length).toBeGreaterThan(0)
  })

  it('enters edit mode and renames a tab on Enter', () => {
    const onRenameTab = vi.fn()
    render(
      <Tabs
        {...editableProps()}
        onRenameTab={onRenameTab}
      />
    )

    fireEvent.click(screen.getAllByTitle(RENAME_TITLE)[0])
    const input = screen.getByTestId('tab-tab-1-name-input')
    fireEvent.change(input, { target: { value: 'Renamed' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onRenameTab).toHaveBeenCalledWith(TAB_ONE_ID, 'Renamed')
  })

  it('calls onDeleteTab when delete button is clicked', () => {
    const onDeleteTab = vi.fn()
    render(
      <Tabs
        {...editableProps()}
        onDeleteTab={onDeleteTab}
      />
    )

    fireEvent.click(screen.getAllByTitle(DELETE_TITLE)[0])

    expect(onDeleteTab).toHaveBeenCalledWith(TAB_ONE_ID)
  })
})

function MockIcon() {
  return <svg data-testid='mock-icon' />
}

describe('Tabs - Tab Icons', () => {
  it('renders tab icon when Icon component is provided', () => {
    render(
      <Tabs
        {...createProps({
          tabs: [
            createTab({ id: TAB_ONE_ID, label: TAB_ONE_LABEL, Icon: MockIcon })
          ]
        })}
      />
    )

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('renders tab icon when icon ReactNode is provided', () => {
    render(
      <Tabs
        {...createProps({
          tabs: [
            createTab({
              id: TAB_ONE_ID,
              label: TAB_ONE_LABEL,
              icon: <span data-testid='icon-node'>Icon</span>
            })
          ]
        })}
      />
    )

    expect(screen.getByTestId('icon-node')).toBeInTheDocument()
  })
})

describe('Tabs - Data Attributes', () => {
  it('sets data-testid on each tab', () => {
    render(<Tabs {...createProps()} />)

    expect(screen.getByTestId('tab-tab-1')).toBeInTheDocument()
    expect(screen.getByTestId('tab-tab-2')).toBeInTheDocument()
    expect(screen.getByTestId('tab-tab-3')).toBeInTheDocument()
  })

  it('sets data-tab-id on each tab', () => {
    render(<Tabs {...createProps()} />)

    expect(screen.getByTestId('tab-tab-1')).toHaveAttribute(
      'data-tab-id',
      TAB_ONE_ID
    )
  })
})

describe('Tabs - Tab Count Edge Cases', () => {
  it('renders a single tab correctly', () => {
    render(
      <Tabs {...createProps({ tabs: [createTab()], activeTab: TAB_ONE_ID })} />
    )

    expect(screen.getByText(TAB_ONE_LABEL)).toBeInTheDocument()
  })

  it('renders many tabs', () => {
    const manyTabs = Array.from({ length: 10 }, (_, i) =>
      createTab({ id: `tab-${i}`, label: `Tab ${i}` })
    )

    render(<Tabs {...createProps({ tabs: manyTabs })} />)

    expect(screen.getByText('Tab 0')).toBeInTheDocument()
    expect(screen.getByText('Tab 9')).toBeInTheDocument()
  })
})

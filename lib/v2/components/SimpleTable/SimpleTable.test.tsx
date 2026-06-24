import type { SimpleTableColumn } from './SimpleTable'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SimpleTable } from './SimpleTable'

interface TestItem {
  id: string
  name: string
  value: number
}

interface TestItemWithoutId {
  name: string
  value: number
}

const ITEM_1 = 'Item 1'
const ITEM_2 = 'Item 2'
const ITEM_3 = 'Item 3'
const DEFAULT_EMPTY_LABEL = 'No data'
const CUSTOM_EMPTY_LABEL = 'Nothing to display'
const CUSTOM_CLASS = 'custom-class'
const MAX_HEIGHT = '500px'
const COLUMN_WIDTH = '200px'
const NAME_COLUMN_CLASS = 'name-column'
const HEADER_CLASS = 'red-header'

const TAB_1_ID = 'tab1'
const TAB_2_ID = 'tab2'
const TAB_1_LABEL = 'Tab 1'
const TAB_2_LABEL = 'Tab 2'

const VALUE_100 = 100
const VALUE_200 = 200
const VALUE_300 = 300
const VALUE_10 = 10
const VALUE_20 = 20
const EXPECTED_ROW_COUNT = 3
const EXPECTED_CALL_COUNT = 3

const createColumns = (): SimpleTableColumn<TestItem>[] => [
  { key: 'name', render: (row) => row.name },
  { key: 'value', render: (row) => row.value }
]

const createData = (): TestItem[] => [
  { id: '1', name: ITEM_1, value: VALUE_100 },
  { id: '2', name: ITEM_2, value: VALUE_200 },
  { id: '3', name: ITEM_3, value: VALUE_300 }
]

const TABS = [
  { id: TAB_1_ID, label: TAB_1_LABEL },
  { id: TAB_2_ID, label: TAB_2_LABEL }
]

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('SimpleTable - Rendering', () => {
  it('renders data rows with columns', () => {
    render(
      <SimpleTable
        columns={createColumns()}
        data={createData()}
      />
    )

    expect(screen.getByText(ITEM_1)).toBeInTheDocument()
    expect(screen.getByText(ITEM_2)).toBeInTheDocument()
    expect(screen.getByText(ITEM_3)).toBeInTheDocument()
    expect(screen.getByText(String(VALUE_100))).toBeInTheDocument()
    expect(screen.getByText(String(VALUE_200))).toBeInTheDocument()
    expect(screen.getByText(String(VALUE_300))).toBeInTheDocument()
  })

  it('renders empty message when data is empty', () => {
    render(
      <SimpleTable
        columns={createColumns()}
        data={[]}
      />
    )

    expect(screen.getByText(DEFAULT_EMPTY_LABEL)).toBeInTheDocument()
  })

  it('renders custom empty message', () => {
    render(
      <SimpleTable
        columns={createColumns()}
        data={[]}
        emptyMessage={CUSTOM_EMPTY_LABEL}
      />
    )

    expect(screen.getByText(CUSTOM_EMPTY_LABEL)).toBeInTheDocument()
  })

  it('applies extraClass to container', () => {
    const { container } = render(
      <SimpleTable
        columns={createColumns()}
        data={createData()}
        extraClass={CUSTOM_CLASS}
      />
    )

    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument()
  })

  it('applies maxHeight style', () => {
    const { container } = render(
      <SimpleTable
        columns={createColumns()}
        data={createData()}
        maxHeight={MAX_HEIGHT}
      />
    )

    expect(container.firstChild).toHaveStyle({ maxHeight: MAX_HEIGHT })
  })
})

describe('SimpleTable - Row Keys', () => {
  it('uses row.id as key when available', () => {
    const { container } = render(
      <SimpleTable
        columns={createColumns()}
        data={createData()}
      />
    )

    expect(container.querySelectorAll('[class*="row"]')).toHaveLength(
      EXPECTED_ROW_COUNT
    )
  })

  it('uses custom rowKey function when provided', () => {
    const data = createData()
    const rowKey = vi.fn((row: TestItem) => `custom-${row.id}`)

    render(
      <SimpleTable
        columns={createColumns()}
        data={data}
        rowKey={rowKey}
      />
    )

    expect(rowKey).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT)
    expect(rowKey).toHaveBeenCalledWith(data[0], 0)
    expect(rowKey).toHaveBeenCalledWith(data[1], 1)
    expect(rowKey).toHaveBeenCalledWith(data[2], 2)
  })

  it('uses index as key when row has no id and no rowKey provided', () => {
    const dataWithoutId: TestItemWithoutId[] = [
      { name: 'Item A', value: VALUE_10 },
      { name: 'Item B', value: VALUE_20 }
    ]
    const columns: SimpleTableColumn<TestItemWithoutId>[] = [
      { key: 'name', render: (row) => row.name }
    ]

    render(
      <SimpleTable
        columns={columns}
        data={dataWithoutId}
      />
    )

    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })
})

describe('SimpleTable - Tabs', () => {
  it('renders tabs when provided', () => {
    render(
      <SimpleTable
        activeTab={TAB_1_ID}
        columns={createColumns()}
        data={createData()}
        tabs={TABS}
      />
    )

    expect(screen.getByText(TAB_1_LABEL)).toBeInTheDocument()
    expect(screen.getByText(TAB_2_LABEL)).toBeInTheDocument()
  })

  it('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn()

    render(
      <SimpleTable
        activeTab={TAB_1_ID}
        columns={createColumns()}
        data={createData()}
        onTabChange={onTabChange}
        tabs={TABS}
      />
    )

    fireEvent.click(screen.getByTestId(`table-tab-${TAB_2_ID}`))

    expect(onTabChange).toHaveBeenCalledWith(TAB_2_ID)
  })

  it('does not render tabs when array is empty', () => {
    render(
      <SimpleTable
        activeTab={TAB_1_ID}
        columns={createColumns()}
        data={createData()}
        tabs={[]}
      />
    )

    expect(
      screen.queryByTestId(`table-tab-${TAB_1_ID}`)
    ).not.toBeInTheDocument()
  })
})

describe('SimpleTable - Row Click', () => {
  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn()
    const data = createData()

    render(
      <SimpleTable
        columns={createColumns()}
        data={data}
        onRowClick={onRowClick}
      />
    )

    fireEvent.click(screen.getByText(ITEM_1))

    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('does not throw when onRowClick is not provided', () => {
    render(
      <SimpleTable
        columns={createColumns()}
        data={createData()}
      />
    )

    expect(() => fireEvent.click(screen.getByText(ITEM_1))).not.toThrow()
  })
})

describe('SimpleTable - Column Configuration', () => {
  it('applies string column width when specified', () => {
    const columns: SimpleTableColumn<TestItem>[] = [
      { key: 'name', width: COLUMN_WIDTH, render: (row) => row.name },
      { key: 'value', render: (row) => row.value }
    ]

    const { container } = render(
      <SimpleTable
        columns={columns}
        data={createData()}
      />
    )

    const cells = container.querySelectorAll('[class*="cell"]')
    expect(cells[0]).toHaveStyle({ flex: `0 0 ${COLUMN_WIDTH}` })
  })

  it('appends px to numeric column width', () => {
    const NUMERIC_WIDTH = 140
    const columns: SimpleTableColumn<TestItem>[] = [
      { key: 'name', width: NUMERIC_WIDTH, render: (row) => row.name },
      { key: 'value', render: (row) => row.value }
    ]

    const { container } = render(
      <SimpleTable
        columns={columns}
        data={createData()}
      />
    )

    const cells = container.querySelectorAll('[class*="cell"]')
    expect(cells[0]).toHaveStyle({ flex: `0 0 ${NUMERIC_WIDTH}px` })
  })

  it('applies column className when specified', () => {
    const columns: SimpleTableColumn<TestItem>[] = [
      {
        key: 'name',
        className: NAME_COLUMN_CLASS,
        render: (row) => row.name
      }
    ]

    const { container } = render(
      <SimpleTable
        columns={columns}
        data={createData()}
      />
    )

    expect(container.querySelector(`.${NAME_COLUMN_CLASS}`)).toBeInTheDocument()
  })

  it('applies headerClassName to header cells when headers are present', () => {
    const HEADER_LABEL = 'Name'
    const columns: SimpleTableColumn<TestItem>[] = [
      { key: 'name', header: HEADER_LABEL, render: (row) => row.name }
    ]

    const { container } = render(
      <SimpleTable
        columns={columns}
        data={createData()}
        headerClassName={HEADER_CLASS}
      />
    )

    const headerCell = container.querySelector(`.${HEADER_CLASS}`)
    expect(headerCell).toBeInTheDocument()
    expect(headerCell).toHaveTextContent(HEADER_LABEL)
  })

  it('exposes the header label as a tooltip for truncation', () => {
    const HEADER_LABEL = 'Throughput'
    const columns: SimpleTableColumn<TestItem>[] = [
      { key: 'value', header: HEADER_LABEL, render: (row) => row.value }
    ]

    render(
      <SimpleTable
        columns={columns}
        data={createData()}
      />
    )

    expect(screen.getByLabelText(HEADER_LABEL)).toBeInTheDocument()
  })
})

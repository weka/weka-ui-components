import React from 'react'
import { Meta, StoryFn, Decorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Table, { TableProps } from './Table'
import { ExtendedColumnDef, RowAction } from './types'

import { BrowserRouter as Router } from 'react-router-dom'

const RouterDecorator: Decorator = (Story) => (
  <Router>
    <Story />
  </Router>
)

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [RouterDecorator]
} as Meta<typeof Table>

interface SampleData {
  id: number
  name: string
  age: number
  status: string
}

const data: SampleData[] = [
  { id: 1, name: 'John Doe', age: 28, status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 34, status: 'Inactive' },
  { id: 3, name: 'Sam Johnson', age: 45, status: 'Active' }
]

const columns: ExtendedColumnDef<SampleData, keyof SampleData>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id'
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name'
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age'
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status'
  }
]

const Template: StoryFn<TableProps<SampleData, keyof SampleData>> = (args) => (
  <Table {...args} />
)

Template.args = {
  columns,
  data,
  filterCategory: 'name'
}

const handleEdit = action('Edit row')
const handleDelete = action('Delete row')

export const Default = Template.bind({})
Default.args = {
  columns,
  data,
  filterCategory: 'exampleCategory',
  title: 'Table Title',
  emptyMessage: 'No data available',
  loading: false,
  rowActions: [
    {
      text: 'Edit',
      action: (row: SampleData) => handleEdit(`Editing row ${row.id}`)
    },
    {
      text: 'Delete',
      action: (row: SampleData) => handleDelete(`Deleting row ${row.id}`)
    }
  ] as unknown as RowAction<SampleData>[],
  tableActions: [],
  maxRows: 10
}

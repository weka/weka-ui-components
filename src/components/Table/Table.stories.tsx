import React from 'react'
import { default as TableComponent } from './Table'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import SelectFilter from './filters/SelectFilter'

export default {
  component: TableComponent
} as ComponentMeta<typeof TableComponent>

const Template: ComponentStory<typeof TableComponent> = (args) => {
  return <TableComponent {...args} />
}

export const Table = Template.bind({})
Table.args = {
  title: 'Events',
  filterCategory: 'events',
  columns: [
    {
      Header: 'name',
      accessor: 'permission',
      disableSort: true
    },
    {
      Header: 'Group',
      accessor: 'group',
      Filter: SelectFilter
    },
    {
      Header: 'Timestamp',
      accessor: 'timestamp'
    }
  ],
  data: new Array(10).fill('').map((i, index) => ({
    permission: 'permission' + index,
    group: 'group' + (index % 2 ? 0 : 1),
    timestamp: 'time' + index
  }))
}

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'

import { MiniPagination } from './MiniPagination'

const meta: Meta<typeof MiniPagination> = {
  title: 'v2/MiniPagination',
  component: MiniPagination,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof MiniPagination>

export const Interactive: Story = {
  render: function InteractivePagination() {
    const [page, setPage] = useState(0)
    const totalPages = 5
    return (
      <MiniPagination
        currentPage={page}
        onNextPage={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
        onPrevPage={() => setPage((p) => Math.max(p - 1, 0))}
        totalPages={totalPages}
      />
    )
  }
}

export const Default: Story = {
  args: {
    currentPage: 2,
    totalPages: 10,
    onPrevPage: NOOP,
    onNextPage: NOOP
  }
}

export const FirstPage: Story = {
  args: {
    currentPage: 0,
    totalPages: 10,
    onPrevPage: NOOP,
    onNextPage: NOOP
  }
}

export const LastPage: Story = {
  args: {
    currentPage: 9,
    totalPages: 10,
    onPrevPage: NOOP,
    onNextPage: NOOP
  }
}

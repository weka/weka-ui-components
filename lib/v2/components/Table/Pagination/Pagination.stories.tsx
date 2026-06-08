import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'v2/Table/Pagination'
}

export default meta
type Story = StoryObj<typeof Pagination>

const CONTAINER_STYLE = {
  padding: '32px',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '24px'
}

const LABEL_STYLE = {
  fontSize: '12px',
  color: 'var(--text-secondary)'
}

const SMALL_TOTAL_PAGES = 4
const LARGE_TOTAL_PAGES = 12
const INITIAL_PAGE_SMALL = 1
const INITIAL_PAGE_LARGE = 5
const DISABLED_PAGE = 4

function InteractiveDemo() {
  const [smallPage, setSmallPage] = useState(INITIAL_PAGE_SMALL)
  const [largePage, setLargePage] = useState(INITIAL_PAGE_LARGE)
  const [pageWithDisabled, setPageWithDisabled] = useState(INITIAL_PAGE_SMALL)

  return (
    <div style={CONTAINER_STYLE}>
      <div>
        <div style={LABEL_STYLE}>
          Few pages — no ellipsis ({SMALL_TOTAL_PAGES} total)
        </div>
        <Pagination
          currentPage={smallPage}
          onPageChange={setSmallPage}
          totalPages={SMALL_TOTAL_PAGES}
        />
      </div>
      <div>
        <div style={LABEL_STYLE}>
          Many pages — ellipsis around the active window ({LARGE_TOTAL_PAGES}{' '}
          total)
        </div>
        <Pagination
          currentPage={largePage}
          onPageChange={setLargePage}
          totalPages={LARGE_TOTAL_PAGES}
        />
      </div>
      <div>
        <div style={LABEL_STYLE}>
          isPageEnabled disables page {DISABLED_PAGE}
        </div>
        <Pagination
          currentPage={pageWithDisabled}
          isPageEnabled={(page) => page !== DISABLED_PAGE}
          onPageChange={setPageWithDisabled}
          totalPages={SMALL_TOTAL_PAGES + 2}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />
}

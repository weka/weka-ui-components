import { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING, SEARCH_PLACEHOLDER } from '../../utils/consts'

import type { ExpandableSearchProps } from './ExpandableSearch'
import { ExpandableSearch } from './ExpandableSearch'

const STATUS_TEXT_STYLE = { fontSize: '12px' }
const CONTAINER_STYLE = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px'
}
const DEMO_TEST_ID = 'demo-search'

type DemoProps = Omit<
  ExpandableSearchProps,
  'onSearch' | 'onClear' | 'onSubmit'
> & {
  autoExpand?: boolean
}

function ExpandableSearchDemo({
  showSubmitButton,
  autoExpand = false,
  ...rest
}: Readonly<DemoProps>) {
  const [searchValue, setSearchValue] = useState(EMPTY_STRING)
  const [submitted, setSubmitted] = useState(EMPTY_STRING)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoExpand) {
      return
    }
    const openButton = containerRef.current?.querySelector<HTMLButtonElement>(
      `[data-testid="${DEMO_TEST_ID}-open"]`
    )
    openButton?.click()
  }, [autoExpand])

  return (
    <div
      ref={containerRef}
      style={CONTAINER_STYLE}
    >
      <ExpandableSearch
        {...rest}
        dataTestId={DEMO_TEST_ID}
        onSearch={setSearchValue}
        onSubmit={setSubmitted}
        showSubmitButton={showSubmitButton}
        onClear={() => {
          setSearchValue(EMPTY_STRING)
          setSubmitted(EMPTY_STRING)
        }}
      />
      <p style={STATUS_TEXT_STYLE}>
        Current search: {searchValue || '(empty)'}
      </p>
      {showSubmitButton ? (
        <p style={STATUS_TEXT_STYLE}>Last submitted: {submitted || '(none)'}</p>
      ) : null}
    </div>
  )
}

const meta: Meta<typeof ExpandableSearchDemo> = {
  title: 'v2/ExpandableSearch',
  component: ExpandableSearchDemo,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ExpandableSearchDemo>

export const Default: Story = {
  args: {
    placeholder: SEARCH_PLACEHOLDER
  }
}

export const SubmitOnEnter: Story = {
  args: {
    placeholder: 'Type and press Enter to submit',
    showSubmitButton: true,
    autoExpand: true
  }
}

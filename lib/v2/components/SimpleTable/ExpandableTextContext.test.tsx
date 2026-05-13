/* eslint-disable react/no-multi-comp -- Test file contains multiple consumer components for exercising the context. */
import { act, cleanup, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ExpandableTextProvider,
  useExpandableTextContext
} from './ExpandableTextContext'

const HAS_EXPANDABLE_ID = 'has-expandable'
const REGISTER_TRUE_ID = 'register-true'
const REGISTER_FALSE_ID = 'register-false'
const UNREGISTER_ID = 'unregister'
const CHILD_ID = 'child'
const CONSUMER_1_ID = 'consumer-1'
const CONSUMER_2_ID = 'consumer-2'
const TRIGGER_REGISTER_ID = 'trigger-register'
const REGISTER_SAME_TRUE_ID = 'register-same-true'
const REGISTER_SAME_FALSE_ID = 'register-same-false'

const ITEM_NEEDS_EXPANSION_ID = 'test-1'
const ITEM_NO_EXPANSION_ID = 'test-2'
const SHARED_ITEM_ID = 'same-id'
const SOURCE_ITEM_ID = 'from-2'

const TRUE_TEXT = 'true'
const FALSE_TEXT = 'false'

function TestConsumer() {
  const { hasExpandableContent, registerExpandable, unregisterExpandable } =
    useExpandableTextContext()

  return (
    <div>
      <span data-testid={HAS_EXPANDABLE_ID}>
        {hasExpandableContent ? TRUE_TEXT : FALSE_TEXT}
      </span>
      <button
        data-testid={REGISTER_TRUE_ID}
        onClick={() => registerExpandable(ITEM_NEEDS_EXPANSION_ID, true)}
      >
        Register True
      </button>
      <button
        data-testid={REGISTER_FALSE_ID}
        onClick={() => registerExpandable(ITEM_NO_EXPANSION_ID, false)}
      >
        Register False
      </button>
      <button
        data-testid={UNREGISTER_ID}
        onClick={() => unregisterExpandable(ITEM_NEEDS_EXPANSION_ID)}
      >
        Unregister
      </button>
    </div>
  )
}

function UpdateTestConsumer() {
  const { hasExpandableContent, registerExpandable } =
    useExpandableTextContext()

  return (
    <div>
      <span data-testid={HAS_EXPANDABLE_ID}>
        {hasExpandableContent ? TRUE_TEXT : FALSE_TEXT}
      </span>
      <button
        data-testid={REGISTER_SAME_TRUE_ID}
        onClick={() => registerExpandable(SHARED_ITEM_ID, true)}
      >
        Register Same True
      </button>
      <button
        data-testid={REGISTER_SAME_FALSE_ID}
        onClick={() => registerExpandable(SHARED_ITEM_ID, false)}
      >
        Register Same False
      </button>
    </div>
  )
}

function ReadOnlyConsumer() {
  const { hasExpandableContent } = useExpandableTextContext()
  return (
    <span data-testid={CONSUMER_1_ID}>
      {hasExpandableContent ? TRUE_TEXT : FALSE_TEXT}
    </span>
  )
}

function RegisteringConsumer() {
  const { hasExpandableContent, registerExpandable } =
    useExpandableTextContext()
  return (
    <div>
      <span data-testid={CONSUMER_2_ID}>
        {hasExpandableContent ? TRUE_TEXT : FALSE_TEXT}
      </span>
      <button
        data-testid={TRIGGER_REGISTER_ID}
        onClick={() => registerExpandable(SOURCE_ITEM_ID, true)}
      >
        Register
      </button>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('ExpandableTextProvider', () => {
  it('renders children', () => {
    render(
      <ExpandableTextProvider>
        <div data-testid={CHILD_ID}>Child content</div>
      </ExpandableTextProvider>
    )

    expect(screen.getByTestId(CHILD_ID)).toBeInTheDocument()
  })

  it('provides context values to consumers', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(FALSE_TEXT)
    expect(screen.getByTestId(REGISTER_TRUE_ID)).toBeInTheDocument()
    expect(screen.getByTestId(UNREGISTER_ID)).toBeInTheDocument()
  })
})

describe('useExpandableTextContext', () => {
  it('throws error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      'useExpandableTextContext must be used within an ExpandableTextProvider'
    )

    consoleSpy.mockRestore()
  })
})

describe('hasExpandableContent', () => {
  it('returns false when no expandable items registered', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(FALSE_TEXT)
  })

  it('returns true when at least one item needs expansion', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    act(() => {
      screen.getByTestId(REGISTER_TRUE_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(TRUE_TEXT)
  })

  it('returns false when registered items do not need expansion', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    act(() => {
      screen.getByTestId(REGISTER_FALSE_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(FALSE_TEXT)
  })
})

describe('registerExpandable', () => {
  it('adds new expandable item', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(FALSE_TEXT)

    act(() => {
      screen.getByTestId(REGISTER_TRUE_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(TRUE_TEXT)
  })

  it('updates existing expandable item', () => {
    render(
      <ExpandableTextProvider>
        <UpdateTestConsumer />
      </ExpandableTextProvider>
    )

    act(() => {
      screen.getByTestId(REGISTER_SAME_TRUE_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(TRUE_TEXT)

    act(() => {
      screen.getByTestId(REGISTER_SAME_FALSE_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(FALSE_TEXT)
  })
})

describe('unregisterExpandable', () => {
  it('removes expandable item', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    act(() => {
      screen.getByTestId(REGISTER_TRUE_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(TRUE_TEXT)

    act(() => {
      screen.getByTestId(UNREGISTER_ID).click()
    })

    expect(screen.getByTestId(HAS_EXPANDABLE_ID)).toHaveTextContent(FALSE_TEXT)
  })

  it('handles unregistering non-existent item gracefully', () => {
    render(
      <ExpandableTextProvider>
        <TestConsumer />
      </ExpandableTextProvider>
    )

    expect(() =>
      act(() => {
        screen.getByTestId(UNREGISTER_ID).click()
      })
    ).not.toThrow()
  })
})

describe('Multiple consumers', () => {
  it('all consumers see the same state', () => {
    render(
      <ExpandableTextProvider>
        <ReadOnlyConsumer />
        <RegisteringConsumer />
      </ExpandableTextProvider>
    )

    expect(screen.getByTestId(CONSUMER_1_ID)).toHaveTextContent(FALSE_TEXT)
    expect(screen.getByTestId(CONSUMER_2_ID)).toHaveTextContent(FALSE_TEXT)

    act(() => {
      screen.getByTestId(TRIGGER_REGISTER_ID).click()
    })

    expect(screen.getByTestId(CONSUMER_1_ID)).toHaveTextContent(TRUE_TEXT)
    expect(screen.getByTestId(CONSUMER_2_ID)).toHaveTextContent(TRUE_TEXT)
  })
})

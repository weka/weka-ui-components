import type { SideBlockProps } from './SideBlock'

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SideBlock from './SideBlock'

const BLOCK_NAME = 'policy_a'
const DUPLICATE_TEXT = 'Duplicate'
const EDIT_TEXT = 'Edit'
const DELETE_TEXT = 'Delete'
const DELETE_ICON_TEXT = 'delete-icon'
const MENU_OPEN_CLASS = 'side-block-actions-menu-open'

const createActions = (onDuplicate = vi.fn()) => [
  { text: DUPLICATE_TEXT, onClick: onDuplicate, Icon: null },
  { text: EDIT_TEXT, onClick: vi.fn(), Icon: null }
]

function renderSideBlock(actions: SideBlockProps['actions'] = createActions()) {
  return render(
    <SideBlock
      actions={actions}
      name={BLOCK_NAME}
      onSelect={vi.fn()}
    >
      <div />
    </SideBlock>
  )
}

function getKebabButton() {
  return screen.getByRole('button')
}

function isMenuMarkedOpen() {
  return getKebabButton().parentElement?.classList.contains(MENU_OPEN_CLASS)
}

async function flushClickAwayActivation() {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0)
    })
  })
}

describe('SideBlock', () => {
  afterEach(() => {
    cleanup()
  })

  it('opens the actions menu when the kebab button is clicked', () => {
    renderSideBlock()

    fireEvent.click(getKebabButton())

    expect(isMenuMarkedOpen()).toBe(true)
    expect(screen.getByText(DUPLICATE_TEXT)).toBeInTheDocument()
  })

  it('closes the actions menu when the kebab button is clicked again', () => {
    renderSideBlock()

    fireEvent.click(getKebabButton())
    fireEvent.click(getKebabButton())

    expect(isMenuMarkedOpen()).toBe(false)
  })

  it('runs the item action and closes the menu when a menu item is clicked', () => {
    const onDuplicate = vi.fn()
    renderSideBlock(createActions(onDuplicate))

    fireEvent.click(getKebabButton())
    fireEvent.click(screen.getByText(DUPLICATE_TEXT))

    expect(onDuplicate).toHaveBeenCalledOnce()
    expect(isMenuMarkedOpen()).toBe(false)
  })

  it('closes the actions menu on a click outside it', async () => {
    renderSideBlock()

    fireEvent.click(getKebabButton())
    await flushClickAwayActivation()
    fireEvent.click(document.body)

    expect(isMenuMarkedOpen()).toBe(false)
  })

  it('keeps the menu closed when an outside click lands during its close transition', async () => {
    renderSideBlock()

    fireEvent.click(getKebabButton())
    await flushClickAwayActivation()
    fireEvent.click(screen.getByText(DUPLICATE_TEXT))
    fireEvent.click(document.body)

    expect(isMenuMarkedOpen()).toBe(false)
  })

  it('renders actions as icon buttons instead of a menu when every action has an icon', () => {
    renderSideBlock([
      {
        text: DELETE_TEXT,
        onClick: vi.fn(),
        Icon: <span>{DELETE_ICON_TEXT}</span>
      }
    ])

    expect(screen.getByText(DELETE_ICON_TEXT)).toBeInTheDocument()
    expect(screen.queryByText(DELETE_TEXT)).not.toBeInTheDocument()
  })
})

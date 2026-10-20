import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './Select'
const CONTROL_WIDTH = 240
const OPTIONS = [
  { value: 'a', label: 'A' },
  {
    value: 'b',
    label: 'A very long interface group name that would widen the menu'
  }
]

const mockControlRect = () =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: CONTROL_WIDTH,
    height: 40,
    top: 100,
    bottom: 140,
    left: 0,
    right: CONTROL_WIDTH,
    x: 0,
    y: 100,
    toJSON: () => ({})
  })

const openMenu = async () => {
  fireEvent.mouseDown(screen.getByRole('combobox'))
  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
  return screen.getByRole('listbox').closest('.MuiPaper-root')
}

describe('Select - menu width', () => {
  it('sizes the menu to the control when asked to, instead of its longest option', async () => {
    mockControlRect()
    render(
      <Select
        menuWidth='control'
        onChange={vi.fn()}
        options={OPTIONS}
      />
    )

    const paper = await openMenu()
    expect(paper).toHaveStyle({ width: `${CONTROL_WIDTH}px` })
  })

  it('lets the menu grow with its options by default', async () => {
    mockControlRect()
    render(
      <Select
        onChange={vi.fn()}
        options={OPTIONS}
      />
    )

    const paper = await openMenu()
    expect(paper).not.toHaveStyle({ width: `${CONTROL_WIDTH}px` })
  })
})

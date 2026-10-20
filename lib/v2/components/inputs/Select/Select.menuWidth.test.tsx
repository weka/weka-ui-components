import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './Select'
describe('Select - menu width', () => {
  it('sizes the menu to the control instead of its longest option', async () => {
    const CONTROL_WIDTH = 240
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
    render(
      <Select
        onChange={vi.fn()}
        options={[
          { value: 'a', label: 'A' },
          {
            value: 'b',
            label: 'A very long interface group name that would widen the menu'
          }
        ]}
      />
    )

    fireEvent.mouseDown(screen.getByRole('combobox'))

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    const paper = screen.getByRole('listbox').closest('.MuiPaper-root')
    expect(paper).toHaveStyle({ width: `${CONTROL_WIDTH}px` })
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AddTabButton } from './AddTabButton'

describe('AddTabButton', () => {
  it('renders an add button', () => {
    render(<AddTabButton onClick={vi.fn()} />)

    expect(screen.getByTestId('tab-add-button')).toBeInTheDocument()
    expect(screen.getByTitle('Add Tab')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<AddTabButton onClick={onClick} />)

    fireEvent.click(screen.getByTestId('tab-add-button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

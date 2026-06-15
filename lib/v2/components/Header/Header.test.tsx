import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Header } from './Header'

describe('Header', () => {
  it('renders content in the left and right regions', () => {
    render(
      <Header
        leftContent={<span>Cluster meta</span>}
        rightContent={<button type='button'>Action</button>}
      />
    )
    expect(screen.getByText('Cluster meta')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('omits the centre region when no centre content is provided', () => {
    const { container } = render(<Header leftContent={<span>Left</span>} />)
    const regions = container.querySelectorAll('header > div')
    expect(regions).toHaveLength(2)
  })

  it('renders the centre region when centre content is provided', () => {
    render(<Header centerContent={<span>Carousel</span>} />)
    expect(screen.getByText('Carousel')).toBeInTheDocument()
  })
})

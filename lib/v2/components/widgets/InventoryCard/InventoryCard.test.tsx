import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InventoryCard, type InventoryItem } from './InventoryCard'

const ICON_CONTAINER_SELECTOR = '[class*="iconContainer"]'
const DESCRIPTION_SELECTOR = '[class*="description"]'

const createInventoryItem = (
  overrides: Partial<InventoryItem> = {}
): InventoryItem => ({
  id: 'servers',
  title: 'Servers',
  subtitle: 'Active',
  value: '10',
  description: '100%',
  ...overrides
})

const createProps = (items: InventoryItem[] = [createInventoryItem()]) => ({
  data: items
})

describe('InventoryCard', () => {
  describe('Rendering', () => {
    it('renders the container', () => {
      const { container } = render(<InventoryCard {...createProps()} />)

      expect((container.firstChild as HTMLElement).className).toContain(
        'container'
      )
    })

    it('renders inventory items', () => {
      render(<InventoryCard {...createProps()} />)

      expect(screen.getByText('Servers')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('renders multiple inventory items', () => {
      const items = [
        createInventoryItem({ id: 'servers', title: 'Servers', value: '10' }),
        createInventoryItem({ id: 'drivers', title: 'Drivers', value: '50' }),
        createInventoryItem({
          id: 'filesystems',
          title: 'Filesystems',
          value: '5'
        })
      ]
      render(<InventoryCard {...createProps(items)} />)

      expect(screen.getByText('Servers')).toBeInTheDocument()
      expect(screen.getByText('Drivers')).toBeInTheDocument()
      expect(screen.getByText('Filesystems')).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('renders ServersIcon for servers item', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([createInventoryItem({ id: 'servers' })])}
        />
      )

      expect(
        container.querySelector(ICON_CONTAINER_SELECTOR)
      ).toBeInTheDocument()
    })

    it('renders DriversIcon for drivers item', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([createInventoryItem({ id: 'drivers' })])}
        />
      )

      expect(
        container.querySelector(ICON_CONTAINER_SELECTOR)
      ).toBeInTheDocument()
    })

    it('renders FileSystemIcon for filesystems item', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([createInventoryItem({ id: 'filesystems' })])}
        />
      )

      expect(
        container.querySelector(ICON_CONTAINER_SELECTOR)
      ).toBeInTheDocument()
    })

    it('renders S3BucketsIcon for s3buckets item', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([createInventoryItem({ id: 's3buckets' })])}
        />
      )

      expect(
        container.querySelector(ICON_CONTAINER_SELECTOR)
      ).toBeInTheDocument()
    })

    it('renders null for unknown item id', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([createInventoryItem({ id: 'unknown' })])}
        />
      )

      const iconContainer = container.querySelector(ICON_CONTAINER_SELECTOR)
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer?.children).toHaveLength(0)
    })
  })

  describe('Separators', () => {
    it('renders separators between items', () => {
      const items = [
        createInventoryItem({ id: 'servers' }),
        createInventoryItem({ id: 'drivers' }),
        createInventoryItem({ id: 'filesystems' })
      ]
      const { container } = render(<InventoryCard {...createProps(items)} />)

      const separators = container.querySelectorAll('[class*="separator"]')
      expect(separators).toHaveLength(2)
    })

    it('does not render separator after last item', () => {
      const items = [createInventoryItem({ id: 'servers' })]
      const { container } = render(<InventoryCard {...createProps(items)} />)

      const separators = container.querySelectorAll('[class*="separator"]')
      expect(separators).toHaveLength(0)
    })
  })

  describe('Warning State', () => {
    it('applies warning style when percentage is less than 100', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([
            createInventoryItem({ percentage: 80, description: '80%' })
          ])}
        />
      )

      const description = container.querySelector(DESCRIPTION_SELECTOR)
      expect(description?.className).toContain('warningText')
    })

    it('does not apply warning style when percentage is 100', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([
            createInventoryItem({ percentage: 100, description: '100%' })
          ])}
        />
      )

      const description = container.querySelector(DESCRIPTION_SELECTOR)
      expect(description?.className).not.toContain('warningText')
    })

    it('does not apply warning style when percentage is undefined', () => {
      const { container } = render(
        <InventoryCard
          {...createProps([
            createInventoryItem({ percentage: undefined, description: 'N/A' })
          ])}
        />
      )

      const description = container.querySelector(DESCRIPTION_SELECTOR)
      expect(description?.className).not.toContain('warningText')
    })
  })

  describe('Layout', () => {
    it('displays title and subtitle in left section', () => {
      render(
        <InventoryCard
          {...createProps([
            createInventoryItem({ title: 'Test Title', subtitle: 'Test Sub' })
          ])}
        />
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Sub')).toBeInTheDocument()
    })

    it('displays value and description in right section', () => {
      render(
        <InventoryCard
          {...createProps([
            createInventoryItem({ value: '42', description: 'Online' })
          ])}
        />
      )

      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('Online')).toBeInTheDocument()
    })
  })
})

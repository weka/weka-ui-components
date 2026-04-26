import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SEVERITY_TYPES } from '../../utils/consts'

import { SeverityChip } from './SeverityChip'
import { getFilterSeverityChips, getSeverityChip } from './severityChipUtils'

describe('SeverityChip - Severity Types', () => {
  it.each([
    SEVERITY_TYPES.CRITICAL,
    SEVERITY_TYPES.MAJOR,
    SEVERITY_TYPES.MINOR,
    SEVERITY_TYPES.WARNING,
    SEVERITY_TYPES.INFO,
    SEVERITY_TYPES.DEBUG,
    SEVERITY_TYPES.DEFAULT
  ])('renders %s severity label', (severity) => {
    render(<SeverityChip severity={severity} />)
    expect(screen.getByText(severity)).toBeInTheDocument()
  })

  it('handles uppercase severity by converting to lowercase', () => {
    render(<SeverityChip severity={'CRITICAL' as 'critical'} />)
    expect(screen.getByText(SEVERITY_TYPES.CRITICAL)).toBeInTheDocument()
  })

  it('falls back to info when severity is null', () => {
    render(<SeverityChip severity={null as unknown as 'info'} />)
    expect(screen.getByText(SEVERITY_TYPES.INFO)).toBeInTheDocument()
  })
})

describe('SeverityChip - Closable', () => {
  it('does not render close button when closable is false', () => {
    render(<SeverityChip severity={SEVERITY_TYPES.WARNING} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders close button when closable is true', () => {
    render(
      <SeverityChip
        closable
        severity={SEVERITY_TYPES.WARNING}
      />
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <SeverityChip
        closable
        onClose={onClose}
        severity={SEVERITY_TYPES.WARNING}
      />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('SeverityChip - CSS Classes', () => {
  it('applies severity-specific class', () => {
    const { container } = render(
      <SeverityChip severity={SEVERITY_TYPES.CRITICAL} />
    )
    const chip = container.firstChild as HTMLElement
    expect(chip.className).toContain('critical')
  })
})

describe('severityChipUtils', () => {
  describe('getSeverityChip', () => {
    it('returns a SeverityChip element', () => {
      const chip = getSeverityChip(SEVERITY_TYPES.WARNING)
      expect(chip.type).toBe(SeverityChip)
    })

    it('passes severity prop correctly', () => {
      const chip = getSeverityChip(SEVERITY_TYPES.CRITICAL)
      const props = chip.props as { severity: string }
      expect(props.severity).toBe(SEVERITY_TYPES.CRITICAL)
    })
  })

  describe('getFilterSeverityChips', () => {
    it('returns an object with chip elements for each option', () => {
      const result = getFilterSeverityChips([
        SEVERITY_TYPES.CRITICAL,
        SEVERITY_TYPES.MAJOR,
        SEVERITY_TYPES.WARNING
      ])

      expect(result[SEVERITY_TYPES.CRITICAL].type).toBe(SeverityChip)
      expect(result[SEVERITY_TYPES.MAJOR].type).toBe(SeverityChip)
      expect(result[SEVERITY_TYPES.WARNING].type).toBe(SeverityChip)
    })

    it('returns empty object for empty options', () => {
      const result = getFilterSeverityChips([])
      expect(Object.keys(result)).toHaveLength(0)
    })
  })
})

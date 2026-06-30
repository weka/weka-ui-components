import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TAB_VARIANTS } from '../tabsConstants'
import { useTabsDerivedState } from './useTabsDerivedState'

const createProps = (overrides = {}) => ({
  variant: TAB_VARIANTS.EDITABLE,
  tabsCount: 3,
  minTabs: 1,
  hasLeftOverflow: false,
  hasRightOverflow: false,
  localDraggingId: null,
  localDragOverId: null,
  ...overrides
})

describe('useTabsDerivedState', () => {
  it('marks editable variant as editable', () => {
    const { result } = renderHook(() => useTabsDerivedState(createProps()))

    expect(result.current.isEditable).toBe(true)
  })

  it('allows delete only above minTabs', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(createProps({ tabsCount: 1, minTabs: 1 }))
    )

    expect(result.current.canDelete).toBe(false)
  })

  it('blocks add button when maxTabs reached', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(
        createProps({ tabsCount: 5, maxTabs: 5, onAddTab: vi.fn() })
      )
    )

    expect(result.current.canAddTab).toBe(false)
    expect(result.current.showAddButton).toBe(false)
  })

  it('shows add button when below maxTabs and onAddTab is set', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(
        createProps({ tabsCount: 2, maxTabs: 5, onAddTab: vi.fn() })
      )
    )

    expect(result.current.showAddButton).toBe(true)
  })

  it('is draggable only when editable and onReorderTabs is provided', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(createProps({ onReorderTabs: vi.fn() }))
    )

    expect(result.current.isDraggable).toBe(true)
  })

  it('falls back to primary styleVariant for editable', () => {
    const { result } = renderHook(() => useTabsDerivedState(createProps()))

    expect(result.current.styleVariant).toBe(TAB_VARIANTS.PRIMARY)
  })

  it('keeps non-editable variants as their own styleVariant', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(createProps({ variant: TAB_VARIANTS.UNDERLINE }))
    )

    expect(result.current.styleVariant).toBe(TAB_VARIANTS.UNDERLINE)
    expect(result.current.isEditable).toBe(false)
  })

  it('prefers controlled dragging/dragOver ids over local ones', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(
        createProps({
          draggingTabId: 'controlled-drag',
          dragOverTabId: 'controlled-over',
          localDraggingId: 'local-drag',
          localDragOverId: 'local-over'
        })
      )
    )

    expect(result.current.currentDraggingId).toBe('controlled-drag')
    expect(result.current.currentDragOverId).toBe('controlled-over')
  })

  it('only shows scroll arrows when editable and overflowing', () => {
    const { result } = renderHook(() =>
      useTabsDerivedState(
        createProps({ hasLeftOverflow: true, hasRightOverflow: true })
      )
    )

    expect(result.current.showLeftArrow).toBe(true)
    expect(result.current.showRightArrow).toBe(true)
  })
})

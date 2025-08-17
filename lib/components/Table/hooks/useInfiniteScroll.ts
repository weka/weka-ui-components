import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { ROW_HEIGHT } from '../tableConsts'
import { useEffect, type CSSProperties, type RefObject } from 'react'
import { ExtendedRow } from '../types'

const useInfiniteScroll = <Data>({
  data,
  tableRef,
  infinityScrollConfig,
  rows
}: {
  data: Data[]
  tableRef: RefObject<HTMLDivElement>
  infinityScrollConfig?: {
    isFetchingNextPage: boolean
    hasNextPage: boolean
    fetchNextPage: () => void
  }
  rows: ExtendedRow<Data>[]
}) => {
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    enabled: !!infinityScrollConfig,
    count: data.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => tableRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 15
  })

  const lastItem = rowVirtualizer.getVirtualItems().at(-1)

  useEffect(() => {
    if (
      !infinityScrollConfig?.isFetchingNextPage &&
      infinityScrollConfig?.hasNextPage &&
      lastItem &&
      lastItem.index >= rows.length - 1
    ) {
      infinityScrollConfig.fetchNextPage()
    }
  }, [lastItem, infinityScrollConfig, rows])

  const getInfScrollPropsBody = () => infinityScrollConfig ? ({
    style: {
      width: '100%',
      display: 'grid',
      height: `${rowVirtualizer.getTotalSize()}px`,
      position: 'relative'
    } as CSSProperties
  }) : {}

  const getInfScrollPropsRow = (virtualRow: VirtualItem) => ({
    ref: (node: HTMLTableRowElement | null) =>
      rowVirtualizer.measureElement(node),
    ['data-index']: virtualRow.index,
    style: {
      display: 'flex',
      position: 'absolute',
      transform: `translateY(${virtualRow.start}px)`,
      width: '100%'
    }
  })

  const getVirtualRows = () =>
    rowVirtualizer
      .getVirtualItems()
      .filter((virtualRow) => rows[virtualRow.index])

  return {
    getInfScrollPropsBody,
    getInfScrollPropsRow,
    getVirtualRows
  }
}

export default useInfiniteScroll

import { useVirtualizer } from '@tanstack/react-virtual'
import React, { ReactNode, useRef } from 'react'
import { EMPTY_STRING } from 'consts'

import './virtualMenuList.scss'

type VirtualMenuListProps = {
  children: ReactNode
  maxHeight?: number
}

const VirtualMenuList: React.FC<VirtualMenuListProps> = ({
  children,
  maxHeight = 300
}) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const childrenArray = React.Children.toArray(children)

  const isGroup = (child: any) => {
    return child.props?.children && Array.isArray(child.props.children)
  }

  const getItemHeight = (item: any) => {
    return item.props?.data?.subLabel ? 56 : 36
  }

  const flattenedItems = childrenArray.reduce<
    { item: ReactNode; height: number }[]
  >((acc, child: any) => {
    if (isGroup(child)) {
      if (child.props?.label !== EMPTY_STRING) {
        acc.push({
          item: React.cloneElement(child, { children: [] }),
          height: 32
        })
      }

      const groupChildren = React.Children.toArray(child.props.children)
      groupChildren.forEach((option: any) => {
        acc.push({
          item: option,
          height: getItemHeight(option)
        })
      })
    } else {
      acc.push({
        item: child,
        height: getItemHeight(child)
      })
    }
    return acc
  }, [])

  const totalHeight = Math.min(
    maxHeight,
    flattenedItems.reduce((sum, item) => sum + item.height + 1, 0)
  )

  const rowVirtualizer = useVirtualizer({
    count: flattenedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => flattenedItems[index].height,
    overscan: 5
  })

  return (
    <div className='virtual-menu-wrapper'>
      <div
        ref={parentRef}
        style={{
          height: totalHeight,
          width: '100%',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const currentItem = flattenedItems[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${currentItem.height}px`,
                  transform: `translateY(${virtualItem.start}px)`
                }}
              >
                {currentItem.item}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VirtualMenuList

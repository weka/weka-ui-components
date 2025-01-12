import { useVirtualizer } from '@tanstack/react-virtual'
import React, { ReactNode, useRef } from 'react'

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

  const hasSubLabel = childrenArray.some(
    (child: any) => child.props?.data?.subLabel
  )
  const itemHeight = hasSubLabel ? 56 : 36
  const totalHeight = Math.min(maxHeight, childrenArray.length * itemHeight) + 5

  const rowVirtualizer = useVirtualizer({
    count: childrenArray.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
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
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${itemHeight}px`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              {childrenArray[virtualItem.index]}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualMenuList

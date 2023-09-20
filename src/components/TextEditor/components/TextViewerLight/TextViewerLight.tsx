import React, { Fragment, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import './textViewerLight.scss'
import { useCharacterSize, useScrolledX } from './hooks'
import clsx from 'clsx'

const GUTTER_PADDING_LEFT = 21
const GUTTER_PADDING_RIGHT = 13
const TEXT_CONTAINER_MARGIN = 16

type TextViewerLightProps = {
  value?: string
  fontSize: number
  maxLines?: number
}

function TextViewerLight(props: TextViewerLightProps) {
  const { value, fontSize, maxLines } = props

  const parentRef = useRef<HTMLDivElement>(null)
  const isScrolledX = useScrolledX({ element: parentRef.current })

  const { charWidth, charHeight, maximumCharPerColumn } = useCharacterSize({
    fontSize
  })

  const lines = useMemo(() => {
    return value?.split('\n') ?? []
  }, [value])

  const longestLineLength = useMemo(() => {
    return lines.reduce((acc, line) => Math.max(acc, line.length), 0)
  }, [lines])

  const charactersPerColumn = Math.min(maximumCharPerColumn, longestLineLength)

  const getLineNumber = (index: number) => {
    return (index + 1).toString()
  }

  const rowVirtualizer = useVirtualizer({
    count: lines.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => charHeight,
    overscan: 5
  })

  const gutterWidth =
    getLineNumber(rowVirtualizer.range.endIndex).length * charWidth

  const columnsCount = useMemo(
    () =>
      lines.reduce(
        (acc, line) =>
          Math.max(acc, Math.ceil(line.length / charactersPerColumn)),
        0
      ),
    [charactersPerColumn, lines]
  )

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columnsCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => charWidth * charactersPerColumn,
    paddingStart: gutterWidth + GUTTER_PADDING_LEFT + GUTTER_PADDING_RIGHT
  })

  return (
    <div className='text-viewer-light'>
      <div
        style={{
          height: `100%`,
          width: `100%`,
          overflow: 'auto',
          maxHeight: `${
            maxLines
              ? `${maxLines * charHeight + TEXT_CONTAINER_MARGIN * 2}px`
              : 'none'
          }`,
          ...(fontSize && { fontSize: `${fontSize}px` })
        }}
        ref={parentRef}
      >
        <pre
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
            margin: `${TEXT_CONTAINER_MARGIN}px 0`
          }}
        >
          <div
            className={clsx('text-viewer-gutter', isScrolledX && 'scrolled-x')}
            style={{
              width: `${gutterWidth}px`,
              paddingLeft: `${GUTTER_PADDING_LEFT}px`,
              paddingRight: `${GUTTER_PADDING_RIGHT}px`
            }}
          >
            <div style={{ height: '100%', position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  className='text-viewer-gutter-item'
                  key={virtualRow.index}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    position: 'absolute'
                  }}
                >
                  {getLineNumber(virtualRow.index)}
                </div>
              ))}
            </div>
          </div>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Fragment key={virtualRow.index}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                const cellStartIndex = virtualColumn.index * charactersPerColumn
                const cellEndIndex = cellStartIndex + charactersPerColumn

                const cellData = lines[virtualRow.index]?.slice(
                  cellStartIndex,
                  cellEndIndex
                )

                return cellData ? (
                  <span
                    className='text-viewer-cell'
                    key={virtualColumn.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${virtualColumn.size}px`,
                      height: `${virtualRow.size}px`,
                      transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                    }}
                  >
                    {cellData}
                  </span>
                ) : null
              })}
            </Fragment>
          ))}
        </pre>
      </div>
    </div>
  )
}

export default TextViewerLight

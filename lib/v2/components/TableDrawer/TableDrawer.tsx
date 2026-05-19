import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'

import styles from './tableDrawer.module.scss'

const ANIMATION_END_EVENT = 'animationend'

export interface TableDrawerProps {
  isOpen: boolean
  isResizing: boolean
  width: number
  title: ReactNode
  onClose: () => void
  onResizeStart: (e: MouseEvent) => void
  children: ReactNode
}

export function TableDrawer({
  isOpen,
  isResizing,
  width,
  title,
  onClose,
  onResizeStart,
  children
}: Readonly<TableDrawerProps>) {
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const widthRef = useRef(width)

  useEffect(() => {
    widthRef.current = width
  }, [width])

  const [animationComplete, setAnimationComplete] = useState(false)
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) {
      setAnimationComplete(false)
    }
  }

  const setDrawerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.style.width = `${widthRef.current}px`
      const handleAnimationEnd = () => {
        setAnimationComplete(true)
        node.removeEventListener(ANIMATION_END_EVENT, handleAnimationEnd)
      }
      node.addEventListener(ANIMATION_END_EVENT, handleAnimationEnd)
    }
    drawerRef.current = node
  }, [])

  useLayoutEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.style.width = `${width}px`
    }
  }, [width])

  const stopPropagation = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  const handleResizeHandleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()
      onResizeStart(e)
    },
    [onResizeStart]
  )

  if (!isOpen) {
    return null
  }

  return (
    <div
      ref={setDrawerRef}
      data-testid='table-drawer'
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      className={clsx(
        styles.drawer,
        isResizing && styles.resizing,
        animationComplete && styles.animationComplete
      )}
    >
      <div
        className={styles.resizeHandle}
        data-testid='table-drawer-resize-handle'
        onClick={stopPropagation}
        onMouseDown={handleResizeHandleMouseDown}
      />
      <div className={styles.drawerHeader}>
        <div className={styles.titleContainer}>{title}</div>
        <button
          aria-label='Close drawer'
          className={styles.closeButton}
          data-testid='table-drawer-close'
          onClick={onClose}
          type='button'
        >
          &times;
        </button>
      </div>
      <div className={styles.drawerContent}>{children}</div>
    </div>
  )
}

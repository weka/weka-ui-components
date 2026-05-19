import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

interface ExpandableTextContextType {
  hasExpandableContent: boolean
  registerExpandable: (id: string, needsExpansion: boolean) => void
  unregisterExpandable: (id: string) => void
}

const expandableTextContext = createContext<
  ExpandableTextContextType | undefined
>(undefined)

export function ExpandableTextProvider({
  children
}: Readonly<{ children: ReactNode }>) {
  const [expandableItems, setExpandableItems] = useState<Map<string, boolean>>(
    new Map()
  )

  const registerExpandable = useCallback(
    (id: string, needsExpansion: boolean) => {
      setExpandableItems((prev) => {
        const next = new Map(prev)
        next.set(id, needsExpansion)
        return next
      })
    },
    []
  )

  const unregisterExpandable = useCallback((id: string) => {
    setExpandableItems((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const hasExpandableContent = Array.from(expandableItems.values()).some(
    Boolean
  )

  const contextValue = useMemo(
    () => ({ hasExpandableContent, registerExpandable, unregisterExpandable }),
    [hasExpandableContent, registerExpandable, unregisterExpandable]
  )

  return (
    <expandableTextContext.Provider value={contextValue}>
      {children}
    </expandableTextContext.Provider>
  )
}

export function useExpandableTextContext() {
  const context = useContext(expandableTextContext)
  if (!context) {
    throw new Error(
      'useExpandableTextContext must be used within an ExpandableTextProvider'
    )
  }
  return context
}

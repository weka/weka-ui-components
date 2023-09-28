import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

type TextEditorContextValue = {
  mode?: 'json' | 'text'
  shouldFoldAll?: boolean
  shouldShowSearch?: boolean
  tags?: string[]
  fontSize?: number
  totalLinesCount?: number
  visibleLinesCount?: number
  isLiteMode: boolean
}

type TextEditorContextType = {
  value: TextEditorContextValue
  setTextEditorContext: (
    setter: (prev: TextEditorContextValue) => TextEditorContextValue
  ) => void
}

const TextEditorContext = createContext<TextEditorContextType | null>(null)

export function TextEditorProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<TextEditorContextValue>({
    isLiteMode: false
  })

  const value = useMemo(
    () => ({ value: state, setTextEditorContext: setState }),
    [state, setState]
  )

  return (
    <TextEditorContext.Provider value={value}>
      {children}
    </TextEditorContext.Provider>
  )
}
export function useTextEditorContext(
  isProviderOptional: true
): TextEditorContextType | null
export function useTextEditorContext(
  componentName: string
): TextEditorContextType
export function useTextEditorContext(
  componentNameOrOptionalProvider: string | true
): TextEditorContextType | null {
  const context = useContext(TextEditorContext)

  if (typeof componentNameOrOptionalProvider === 'string' && !context) {
    throw new Error(
      `${componentNameOrOptionalProvider} must be used within the TextEditorProvider`
    )
  }

  return context
}

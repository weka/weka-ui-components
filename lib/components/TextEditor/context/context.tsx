import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'
import { FONT_SIZE_STORAGE_KEY } from '../components/FontSizeControls/FontSizeControls'
import { DEFAULT_FONT_SIZE } from '../TextEditor'

type TextEditorContextValue = {
  mode?: 'json' | 'text'
  foldAll?: boolean
  allowSearch?: boolean
  tags?: string[]
  fontSize: number
  totalLinesCount?: number
  visibleLinesCount?: number
  isLiteMode: boolean
  loading?: boolean
  hideContent?: string[]
  shouldDisableSyntaxCheck: Set<'hideContent' | 'tags'>
  pageStorageKey?: string
}

type TextEditorContextType = {
  value: TextEditorContextValue
  setTextEditorContext: (
    setter: (prev: TextEditorContextValue) => TextEditorContextValue
  ) => void
}

const TextEditorContext = createContext<TextEditorContextType | null>(null)

type TextEditorProviderProps = {
  pageStorageKey?: string
}

export function TextEditorProvider({
  children,
  pageStorageKey
}: PropsWithChildren<TextEditorProviderProps>) {
  const [state, setState] = useState<TextEditorContextValue>(() => ({
    isLiteMode: false,
    fontSize: +(
      localStorage.getItem(FONT_SIZE_STORAGE_KEY) ?? DEFAULT_FONT_SIZE
    ),
    shouldDisableSyntaxCheck: new Set(),
    pageStorageKey
  }))

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

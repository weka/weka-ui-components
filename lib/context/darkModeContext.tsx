import type { PropsWithChildren } from 'react'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { SCHEME_CHANGE, STORAGE } from 'consts'

type Theme = {
  isDarkMode: boolean
  isSystem: boolean
}

const themeClasses = {
  light: 'light-mode',
  dark: 'dark-mode'
} as const

const STORAGE_KEY = 'isDarkMode'
const PREFERS_DARK = '(prefers-color-scheme: dark)'

const getPrefersDarkMode = () => window.matchMedia(PREFERS_DARK).matches

const DarkModeContext = createContext<{
  isDarkMode: boolean
  isSystem: boolean
  setTheme: (theme: { isDarkMode: boolean } | { isSystem: true }) => void
} | null>(null)

const DarkModeProvider = (props: PropsWithChildren) => {
  const [themeState, setThemeState] = useState<Theme>(() => {
    const savedDarkMode = localStorage.getItem(STORAGE_KEY) as
      | 'true'
      | 'false'
      | null
    const prefersDarkMode = getPrefersDarkMode()

    if (savedDarkMode === 'true') {
      document.body.classList.add(themeClasses.dark)
      return {
        isDarkMode: true,
        isSystem: false
      }
    } else if (savedDarkMode === 'false') {
      document.body.classList.add(themeClasses.light)
      return {
        isDarkMode: false,
        isSystem: false
      }
    } else if (prefersDarkMode) {
      document.body.classList.add(themeClasses.dark)
      return {
        isDarkMode: true,
        isSystem: true
      }
    }

    document.body.classList.add(themeClasses.light)
    return {
      isDarkMode: false,
      isSystem: true
    }
  })

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    if (newTheme.isDarkMode) {
      document.body.classList.add(themeClasses.dark)
      document.body.classList.remove(themeClasses.light)
    } else {
      document.body.classList.remove(themeClasses.dark)
      document.body.classList.add(themeClasses.light)
    }
  }, [])

  const setTheme = useCallback(
    (newTheme: { isDarkMode: boolean } | { isSystem: true }) => {
      if ('isDarkMode' in newTheme) {
        localStorage.setItem(STORAGE_KEY, newTheme.isDarkMode.toString())
        applyTheme({ isDarkMode: newTheme.isDarkMode, isSystem: false })

        return
      }

      localStorage.removeItem(STORAGE_KEY)
      applyTheme({
        isDarkMode: getPrefersDarkMode(),
        isSystem: true
      })
    },
    [applyTheme]
  )

  useEffect(() => {
    const onThemeChanged = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        const isDarkMode = JSON.parse(event.newValue) as boolean

        applyTheme({ isDarkMode, isSystem: false })
      } else {
        applyTheme({ isDarkMode: getPrefersDarkMode(), isSystem: true })
      }
    }

    window.addEventListener(STORAGE, onThemeChanged)
    return () => window.removeEventListener(STORAGE, onThemeChanged)
  }, [applyTheme])

  useEffect(() => {
    if (themeState.isSystem) {
      const onPrefersColorSchemeChanged = (event: MediaQueryListEvent) => {
        applyTheme({
          isDarkMode: event.matches,
          isSystem: themeState.isSystem
        })
      }

      const matchedMedia = window.matchMedia(PREFERS_DARK)
      matchedMedia.addEventListener(SCHEME_CHANGE, onPrefersColorSchemeChanged)

      return () => {
        matchedMedia.removeEventListener(
          SCHEME_CHANGE,
          onPrefersColorSchemeChanged
        )
      }
    }
  }, [applyTheme, themeState.isSystem])

  const value = useMemo(
    () => ({
      ...themeState,
      setTheme
    }),
    [setTheme, themeState]
  )

  return <DarkModeContext.Provider value={value} {...props} />
}

const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }

  return context
}

export { DarkModeProvider, useDarkMode }

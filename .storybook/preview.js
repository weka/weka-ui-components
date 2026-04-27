import { createElement } from 'react'

import '../lib/style/theme.scss'
import '../lib/style/app.scss'
import '../lib/style/fonts.scss'
import '../lib/v2/styles/index.scss'
import './storybook-mui-overrides.scss'

// Theme configuration for toolbar
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for v2 components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'sun', title: 'Light' },
        { value: 'dark', icon: 'moon', title: 'Dark' }
      ],
      showName: true,
      dynamicTitle: true
    }
  }
}

// Decorator that applies theme to the story wrapper and document body
// Body-level theming ensures portals (e.g., MUI Tooltip) also pick up CSS variables
const withTheme = (Story, context) => {
  const theme = context.globals.theme

  document.body.setAttribute('data-theme', theme)
  document.body.style.fontFamily = 'var(--font-family)'

  return createElement(
    'div',
    {
      'data-theme': theme,
      style: {
        backgroundColor: 'var(--gray-0-900)',
        color: 'var(--gray-900-100)',
        fontFamily: 'var(--font-family)',
        padding: '1rem',
        minHeight: '100px',
        transition: 'background-color 0.2s ease, color 0.2s ease'
      }
    },
    createElement(Story)
  )
}

export const decorators = [withTheme]

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  backgrounds: {
    disable: true,
    grid: { disable: true }
  },
  options: {
    storySort: {
      method: 'alphabetical'
    }
  }
}

export const tags = ['autodocs']

import { createElement } from 'react'

import '../lib/style/theme.scss'
import '../lib/style/app.scss'
import '../lib/style/fonts.scss'
import '../lib/v2/styles/index.scss'

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

// Decorator that applies theme to the story wrapper (using createElement to avoid JSX)
const withTheme = (Story, context) => {
  const theme = context.globals.theme
  const backgroundColor = theme === 'dark' ? '#171c21' : '#ffffff'

  return createElement(
    'div',
    {
      'data-theme': theme,
      style: {
        backgroundColor,
        padding: '1rem',
        minHeight: '100px',
        transition: 'background-color 0.2s ease'
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
  }
}

export const tags = ['autodocs']

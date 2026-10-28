import type { StorybookConfig } from '@storybook/react-vite'

export default {
  stories: ['../lib/**/*.mdx', '../lib/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@chromatic-com/storybook'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      // The root vite.config.ts builds the library (lib entries, dts, CSS
      // injection), which doesn't apply to Storybook.
      builder: { viteConfigPath: '.storybook/vite.config.ts' }
    }
  },
  staticDirs: [{ from: '../lib/fonts', to: 'fonts' }],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Docgen appends `default.displayName = …` to files that only re-export
      // a default (`export { default } from './X'`), which is invalid syntax.
      exclude: ['**/index.tsx']
    }
  }
} satisfies StorybookConfig

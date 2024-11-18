import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

module.exports = {
  stories: ['../lib/**/*.mdx', '../lib/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook'
  ],

  webpackFinal: async (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test.test('.svg')
    )
    fileLoaderRule.exclude = /\.svg$/
    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      loader: require.resolve('@svgr/webpack')
    })
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require('@babel/preset-typescript').default,
              [
                require('@babel/preset-react').default,
                { runtime: 'automatic' }
              ],
              require('@babel/preset-env').default
            ]
          }
        }
      ]
    })

    config.resolve.extensions.push('.ts', '.tsx')

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    })

    config.resolve.extensions.push('.mjs')
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions
        })
      ]
    }
    return config
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  staticDirs: [{ from: '../lib/fonts', to: 'fonts' }],
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-scss"
  ],
  "core": {
    "builder": "webpack5"
  },
  webpackFinal: async config => {
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test.test('.svg')
    )
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            ref: true,
          },
        },
        'url-loader',
      ],
    })
    return config
  }
}


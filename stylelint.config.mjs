export default {
  extends: 'stylelint-config-standard-scss',
  ignoreFiles: ['**/*.md', '**/*.test.*', '**/*.spec.*'],
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-zA-Z0-9]+)?$',
      { message: 'Classname "%s" should be written in camelCase.', severity: 'warning' }
    ],
    'no-empty-source': null,
    'no-descending-specificity': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-pseudo-class-no-unknown': null,
    'declaration-block-no-redundant-longhand-properties': [true, { severity: 'warning' }],
    'font-family-name-quotes': null,
    'value-keyword-case': [
      'lower',
      { camelCaseSvgKeywords: true, ignoreProperties: ['composes'] }
    ],
    'color-hex-length': null
  }
}

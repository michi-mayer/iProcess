/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/prefer-module */
const defaults = require('./.eslintrc.shared.cjs')

module.exports = {
  ...defaults,
  ignorePatterns: ['src/*'],
  env: {
    node: true
  },
  parserOptions: {
    ...defaults.parserOptions,
    tsconfigRootDir: __dirname,
    project: './tsconfig.backend.json',
  },
  plugins: [
    ...defaults.plugins,
    'promise'
  ],
  extends: [
    ...defaults.extends,
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:functional/stylistic',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    ...defaults.rules,
    'no-console': 'error',
    'unicorn/prefer-default-parameters': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
    'import/order': ['warn', { 'newlines-between': 'always-and-inside-groups' }]
  },
}

/* eslint-disable unicorn/no-empty-file */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  env: {
    es2022: true
  },
  extends: [
    'standard',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'prettier',
    'unicorn',
    'functional',
    'eslint-plugin-tsdoc',
  ],
  rules: {
    'require-await': 'error',
    'require-yield': 'error',
    'import/no-absolute-path': 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'unicorn/filename-case': 'off',
    'unicorn/no-nested-ternary': 'off',
    'no-nested-ternary': 'off',
    'no-void': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-thenable': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-abusive-eslint-disable': 'warn',
    'import/no-unused-modules': 'error',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        checkFilenames: false,
        replacements: {
          props: false,
          ref: false,
          params: false,
          args: false,
          i: false
        }
      }
    ],
    'prettier/prettier': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.mjs', '*.jsx'],
      rules: {}
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {}
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {}
    }
  ]
}

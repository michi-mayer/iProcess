/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/prefer-module */
const defaults = require('./.eslintrc.shared.cjs')

module.exports = {
  ...defaults,
  env: {
    browser: true
  },
  extends: [
    ...defaults.extends,
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    "plugin:@tanstack/eslint-plugin-query/recommended" // ! TODO: Drop plugin on v5 if this is already enforced by the library
  ],
  parserOptions: {
    ...defaults.parserOptions,
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    ...defaults.plugins,
    'react-hooks',
    'jsx-a11y',
    'cypress',
    '@tanstack/query', // ! TODO: Drop plugin on v5 if this is already enforced by the library
    'simple-import-sort'
  ],
  rules: {
    ...defaults.rules,
    'cypress/unsafe-to-chain-command': 'off', // TODO: VDD-981 remove warnings
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 0,
    '@tanstack/query/exhaustive-deps': 'error', // ! TODO: Drop plugin on v5 if this is already enforced by the library
  },
  ignorePatterns: ["aws-exports.js", "aws-exports.cjs", "aws-exports.ts", 'amplify/function/*'],
  settings: {
    react: {
      version: 'detect' // React version. "detect" automatically picks the version you have installed.
    }
  },
  overrides: [
    {
      files: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"],
      rules: {
        "simple-import-sort/imports": [
          "warn",
          {
            "groups": [
              [
                // Packages `react` related packages come first.
                "^react", "^@?\\w",
                // Other relative imports
                "^\\./(?=.*/)(?!/?$)",
                // Internal modules
                "^(@|~|components|lib|shared|hooks|routing|API|theme|contexts|graphql|helper|services)(/.*|$)",
                // Test modules
                "^(test)(/.*|$)",
                // Side effect imports
                "^\\u0000",
                // Parent imports. Put `..` last
                "^\\.\\.(?!/?$)", "^\\.\\./?$",
                // Put same-folder imports and `.` last
                "^\\.(?!/?$)",
                "^\\./?$",
                // Style imports
                "^.+\\.?(css)$",
              ]
            ]
          }
        ]
      }
    }
  ]

}

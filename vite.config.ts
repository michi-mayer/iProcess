import { defineConfig } from 'vitest/config'
import 'dotenv/config'

import svgr from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import compression from 'vite-plugin-compression'
import environmentPlugin from 'vite-plugin-environment'

const isBackendMode = () => process.env.MODE?.trim() === 'backend'

const filesToExcludeInTest = [
  'amplify/#current-cloud-backend/*',
  'amplify/backend/function/iProcessLambdaShared/lib/nodejs/**/*.ts',
  'amplify/backend/function/**/shared/*.ts',
  'amplify/backend/function/**/graphql/**/*.ts',
  'amplify/backend/function/**/graphql/**/*.ts',
  'amplify/backend/function/**/API.ts',
  'amplify/backend/function/**/mapper.ts',
  'src/graphql/*.ts',
  '**/mocks.test.ts',
  '**/*js',
  '**/*.d.ts',
  '*vitest*',
  'scripts'
]

const filesToIncludeInTest = ['**/*.test.ts', '**/*.test.tsx']

// * Test files are not useful for checking the coverage
const baseFilesToExcludeInCoverage = [...filesToExcludeInTest, '**/*.test.ts', '**/*.test.tsx']
const filesToExcludeInCoverage = isBackendMode()
  ? [...baseFilesToExcludeInCoverage, 'src']
  : [...baseFilesToExcludeInCoverage, 'amplify']

const { testConfig, coverageConfig } = isBackendMode()
  ? {
      testConfig: {},
      coverageConfig: {
        statements: 40,
        branches: 70,
        functions: 45,
        lines: 40
      }
    }
  : {
      testConfig: { environment: 'happy-dom', globals: true, setupFiles: './vitest-setup.ts' },
      coverageConfig: {
        statements: 30,
        branches: 45,
        functions: 20,
        lines: 30
      }
    }

export default defineConfig({
  plugins: [
    eslint({ cache: true }),
    tsConfigPaths(),
    checker({ typescript: true }),
    environmentPlugin('all'),
    react(),
    svgr(),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  build: {
    outDir: 'build',
    reportCompressedSize: false,
    rollupOptions: {
      treeshake: true
    }
  },
  server: {
    host: true,
    open: true,
    port: 3000
  },
  preview: {
    host: true,
    open: true,
    port: 3000
  },
  define: {
    VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser'
      }
    ]
  },
  test: {
    ...testConfig,
    coverage: {
      provider: 'v8', // ? v8 supports c8-style comments: https://vitest.dev/guide/coverage.html#ignoring-code
      reporter: ['text', 'html', 'clover', 'json', 'lcov'],
      thresholds: coverageConfig,
      exclude: filesToExcludeInCoverage
    },
    env: {
      ...process.env,
      NODE_ENV: 'development',
      API_ERFASSUNGSAPP_GRAPHQLAPIENDPOINTOUTPUT: 'http://localhost:8888/api',
      TZ: 'Europe/Berlin',
      REGION: 'eu-spain-1',
      VITE_CLOUD_IDP_ADMIN: 'VWAG_IPROCESS_ADMIN_PROD',
      VITE_CLOUD_IDP_MANAGER: 'VWAG_IPROCESS_MANAGER_PROD',
      VITE_CLOUD_IDP_STANDARD: 'VWAG_IPROCESS_USER_PROD',
      API_ERFASSUNGSAPP_ACTUALCOUNTTABLE_NAME: 'actualCount',
      API_ERFASSUNGSAPP_DEFECTIVETABLE_NAME: 'defective',
      API_ERFASSUNGSAPP_DISRUPTIONTABLE_NAME: 'disruption',
      REACT_APP_SHOW_DEVELOPER_LOGIN: 'true'
    },
    exclude: filesToExcludeInTest,
    include: filesToIncludeInTest,
    onConsoleLog: () => false
  }
})

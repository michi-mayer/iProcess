// Main lib
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'src/tests/cypress/**/*.cy.ts',
    supportFile: 'src/tests/cypress/support/e2e.ts',
    baseUrl: 'http://localhost:3000/',
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false,
    screenshotOnRunFailure: true,
    video: false,
    videoCompression: 20,
    requestTimeout: 10_000,
    defaultCommandTimeout: 15_000,
    numTestsKeptInMemory: 1,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/report/mochawesome-report',
      overwrite: false,
      html: false,
      json: true,
      timestamp: 'mmddyyyy_HHMMss'
    },
    env: {
      TZ: 'Europe/Berlin',
      browserLanguage: 'de-DE',
      testDataFiles: 'src/tests/cypress/testdata/files/',
      timeouts: {
        short: 10_000,
        medium: 20_000,
        long: 30_000,
        max: 100_000
      }
    }
  }
})

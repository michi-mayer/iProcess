
module.exports = {
  reporterEnabled: 'mochawesome',
  mochawesomeReporterOptions: {
    reportDir: 'cypress/report/mochawesome-report',
    overwrite: false,
    html: false,
    json: true,
    timestamp: 'mmddyyyy_HHMMss'
  }
}

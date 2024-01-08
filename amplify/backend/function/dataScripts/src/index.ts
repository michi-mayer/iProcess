/* c8 ignore start */
// 3rd party modules
import log from 'loglevel'

// Lambda layer modules
import { AppError, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { EventSchema } from './types.js'
import { updateOEETable } from './workflows/oee.js'
import { updateUnitTable } from './workflows/unit.js'
import { updateTimeSlotTable } from './workflows/time-slot.js'
import { updateDefectiveTable } from './workflows/defective.js'
import { updateDisruptionTable } from './workflows/disruption.js'
import { updateScheduleHourTable } from './workflows/schedule-hour.js'
import { updateConfigurationTable } from './workflows/configuration.js'
import { updateMeasureReportTable } from './workflows/measure-report.js'
import { updatePartUnitTable } from './workflows/part-unit.js'
import { updateCycleStationTable } from './workflows/cycleStation.js'
import { updateTeamTable } from './workflows/team.js'
import { updateTemplatesFromDisruptionTable } from './workflows/template.js'

log.setLevel(getLogLevel())

export const lambdaHandler = lambdaHandlerBuilder('Lambda Scripts', async (inputEvent) => {
  const { workflow, persistToDB } = EventSchema.parse(inputEvent)

  switch (workflow) {
    case 'update-units':
      return await updateUnitTable(persistToDB)

    case 'update-defectives':
      return await updateDefectiveTable(persistToDB)

    case 'update-disruption':
      return await updateDisruptionTable(persistToDB)

    case 'athena-update-templates':
      return await updateTemplatesFromDisruptionTable(persistToDB)

    case 'update-measure-reports':
      return await updateMeasureReportTable(persistToDB)

    case 'update-schedulehours':
      return await updateScheduleHourTable(persistToDB)

    case 'update-configurations':
      return await updateConfigurationTable(persistToDB)

    case 'update-slots':
      return await updateTimeSlotTable(persistToDB)

    case 'update-oee':
      return await updateOEETable(persistToDB)

    case 'update-part-unit':
      return await updatePartUnitTable(persistToDB)

    case 'update-cycle-station':
      return await updateCycleStationTable(persistToDB)

    case 'update-team':
      return await updateTeamTable(persistToDB)

    default:
      throw new AppError(`Unexpected workflow type ${workflow}`)
  }
})
/* c8 ignore start */

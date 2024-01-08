import { BaseUnit } from 'APIcustom'
import { CycleStation, isAssemblyLine, TeamAndCycleStations, Value } from 'types'
import { z, ZodType } from 'zod'
import {
  AttachmentInput,
  AttendingShift,
  Bool,
  CreateTeamInput,
  IssueInput,
  TargetCycleTimeInput,
  TeamsInput,
  UnitType
} from 'API'
import {
  Classification,
  ExtendedProduct,
  ExtendedProductUnit,
  ExtendedScheduleHour,
  ExtendedShiftModel,
  ExtendedUnit,
  QualityIssueConfig,
  SpeedMode,
  UnitBasicInfo
} from 'contexts/iProcessContext'
import { DUPLICATED_VALUE, MINIMUM_CYCLESTATION_ERROR } from 'helper/constants'
import { validateDuplicatedNames } from 'lib/form/helper/validate'
import { arrayOf, EmptyZodObject, NonEmptyString, NonNegativeNumber, objectOf, parse, PositiveNumber } from 'shared'
import type { Classifications, ParetoData, ParetoProductData, WithID } from 'shared/types'

export const WithIDSchema = parse<WithID>().with({ id: NonEmptyString })

export const WithNameSchema = parse<{ name: string }>().with({
  name: NonEmptyString
})

export const StringValueSchema = parse<Value<string>>().with({
  id: NonEmptyString,
  value: NonEmptyString
})

export const NumericValueSchema = parse<Value<number>>().with({
  id: NonEmptyString,
  value: z.number()
})

export const TeamSchema: ZodType<Required<Omit<TeamsInput, 'cycleStations'>>> = WithNameSchema.extend({
  id: NonEmptyString,
  index: PositiveNumber
})

export const PreviousTeamSchema: ZodType<Omit<CreateTeamInput, 'unitId'> & WithID> = WithNameSchema.extend({
  id: NonEmptyString,
  index: NonNegativeNumber
})

export const RejectedFormSchema = z.object({
  id: z.string().optional(),
  count: z.number().min(1).positive(),
  timeStamp: z.string()
})

export const ParetoProductDataSchema: ZodType<ParetoProductData> = z.object({
  name: NonEmptyString,
  number: NonEmptyString
})

export const ClassificationsSchema: ZodType<Classifications> = z.object({
  category: z.string().nullish(),
  cause: z.string().nullish(),
  type: z.string().nullish()
})

export const ClassificationSchema: ZodType<Classification> = StringValueSchema.extend({
  options: z.lazy(() => z.array(ClassificationSchema).optional())
})

export const ClassificationPathSchema = StringValueSchema.extend({
  options: z.array(StringValueSchema.extend({ options: z.array(StringValueSchema).optional() })).min(1)
})

export const PartUnitSchema = parse<ExtendedProductUnit>().with({
  id: NonEmptyString.optional(),
  partId: NonEmptyString.optional(),
  unitId: NonEmptyString.optional(),
  unit: z.array(objectOf(EmptyZodObject).withType<Partial<ExtendedUnit>>()).optional()
})

export const SpeedModeSchema: ZodType<SpeedMode> = NumericValueSchema.merge(WithNameSchema)

export const isSpeedMode = (_: unknown): _ is SpeedMode => SpeedModeSchema.safeParse(_).success

const ParetoBaseData = z.object({
  id: z.string(),
  templateId: NonEmptyString,
  description: NonEmptyString,
  classifications: NonEmptyString,
  unitId: NonEmptyString,
  unitShortName: NonEmptyString,
  cycleStationName: NonEmptyString,
  frequency: z.number(),
  totalDuration: NonEmptyString,
  totalDurationInMinutes: z.number(),
  firstOccurrence: NonEmptyString
})

export const ParetoDataSchema: ZodType<ParetoData> = ParetoBaseData.extend({
  products: arrayOf(ParetoProductDataSchema)
})

export const ParetoBarDatumSchema = ParetoBaseData.extend({
  productName: NonEmptyString,
  productNumber: NonEmptyString
})

export const TargetCycleTimeInputSchema = parse<TargetCycleTimeInput>().with({
  unitId: NonEmptyString,
  targetCycleTime: z.number()
})

export const UnitBaseSchema = parse<BaseUnit>().with({
  createdAt: NonEmptyString,
  id: NonEmptyString,
  groupingId: NonEmptyString.optional(),
  manufacturer: z.string().nullish(),
  name: NonEmptyString,
  shortName: NonEmptyString,
  type: z.nativeEnum(UnitType),
  machineId: NonEmptyString.optional()
})

export const UnitBasicInfoSchema: ZodType<UnitBasicInfo> = UnitBaseSchema.pick({
  id: true,
  name: true,
  shortName: true,
  type: true
})

export const IssueSchema: z.ZodType<IssueInput> = z.object({
  id: NonEmptyString,
  name: NonEmptyString,
  index: NonNegativeNumber
})

export const DisruptionClassificationSchema = z.object({
  disLocation: NonEmptyString,
  disLocationSpecification: NonEmptyString,
  disLocationType: z.string().nullish()
})

export const TemplateBaseSchema = DisruptionClassificationSchema.extend({
  id: NonEmptyString,
  description: NonEmptyString,
  cycleStationId: NonEmptyString,
  index: NonNegativeNumber.nullish(),
  issues: z.array(IssueSchema).nullish()
})

// TODO: Align all Disruption / Template schemas with API types
export const TemplateBaseWithTeamInfoSchema = TemplateBaseSchema.extend({
  originatorTeam: TeamSchema,
  team: TeamSchema.optional()
})

export const QualityIssueConfigSchema = parse<QualityIssueConfig>()
  .with({
    hasQualityIssueConfig: z.nativeEnum(Bool),
    partImageKeyFront: NonEmptyString,
    partImageKeyBack: NonEmptyString,
    nioClassificationLocation: z.array(ClassificationSchema).min(1),
    nioClassificationDamageType: z.array(ClassificationSchema).min(1),
    nioClassificationErrorSource: z.array(ClassificationSchema)
  })
  .partial()

export const AttachmentSchema: z.ZodType<AttachmentInput> = z.object({
  key: NonEmptyString,
  type: NonEmptyString,
  size: NonNegativeNumber,
  uploadedBy: NonEmptyString,
  createdAt: NonEmptyString
})

export const DisruptionBase = z.object({
  attachments: z.array(AttachmentSchema),
  cycleStationId: NonEmptyString,
  description: NonEmptyString,
  duration: z.string().nullish(),
  isSolved: z.boolean(),
  issues: z.array(IssueSchema),
  lostVehicles: NonNegativeNumber,
  m100: z.number().nullish(),
  measures: NonEmptyString,
  templateId: NonEmptyString
})

export const DisruptionDialogSchema = DisruptionBase.extend({
  categoryClassification: NonEmptyString,
  deletedFiles: z.array(AttachmentSchema).optional().default([]),
  durationInMinutes: z.number().min(0).optional(),
  id: z.string().optional(),
  originatorId: NonEmptyString.optional(),
  reasonClassification: NonEmptyString,
  startDateTime: z.string(),
  teamId: NonEmptyString.optional(),
  typeClassification: z.string().nullish()
})

export const DisruptionResponseSchema = DisruptionBase.merge(
  DisruptionClassificationSchema.extend({
    cycleStationName: NonEmptyString.nullish(),
    endTimeDate: NonEmptyString.nullish(),
    endTimeDateUTC: NonEmptyString,
    id: NonEmptyString,
    originatorTeam: TeamSchema.nullish(),
    partId: NonEmptyString,
    startTimeDate: NonEmptyString.nullish(), // TODO: change name to startDateTime
    startTimeDateUTC: NonEmptyString, // TODO: change name to startDateTimeUTC
    team: TeamSchema.nullish(),
    timeZone: NonEmptyString,
    updatedAt: NonEmptyString
  })
)

export const CycleStationSchema: z.ZodType<CycleStation> = z.object({
  id: NonEmptyString,
  unitId: z.string(),
  teamId: z.string().nullish(),
  name: NonEmptyString,
  isActive: z.boolean(),
  index: PositiveNumber
})

export const TeamAndCycleStationsSchema: z.ZodType<TeamAndCycleStations> = z.object({
  id: NonEmptyString,
  unitId: z.string(),
  name: NonEmptyString,
  index: PositiveNumber,
  cycleStations: z.array(CycleStationSchema)
})

export const ScheduleHourSchema = objectOf(
  z.object({
    timeZone: NonEmptyString,
    hoursEndUTC: NonEmptyString,
    hoursStartUTC: NonEmptyString
  })
).withType<ExtendedScheduleHour>()

export const UnitSchema = z
  .object({
    id: NonEmptyString.optional(),
    shortName: NonEmptyString,
    name: NonEmptyString,
    manufacturer: z.string().nullish(),
    machineId: z.string(),
    type: z.nativeEnum(UnitType),
    m100Range: z
      .object({
        min: z.number().min(1),
        max: z.number().min(1)
      })
      .refine((_) => _.min < _.max, { path: ['max'] })
      .optional(),
    speedModeCollection: z.array(
      z
        .object({
          id: NonEmptyString,
          name: NonEmptyString,
          value: z.number().min(0.01).optional()
        })
        .optional()
    ),
    teams: z.array(TeamAndCycleStationsSchema),
    cycleStations: z.array(CycleStationSchema)
  })
  .superRefine(({ cycleStations, type, teams }, context) => {
    if (type === UnitType.productionUnit) {
      validateDuplicatedNames(cycleStations, (index) =>
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: DUPLICATED_VALUE,
          path: [`cycleStations.${index}.name`]
        })
      )
    } else {
      for (const [teamIndex, team] of teams.entries()) {
        if (team.cycleStations.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: MINIMUM_CYCLESTATION_ERROR,
            path: [`teams.${teamIndex}.name`]
          })
          continue
        }
        validateDuplicatedNames(team.cycleStations, (index) =>
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: DUPLICATED_VALUE,
            path: [`teams.${teamIndex}.cycleStations.${index}.name`]
          })
        )
      }
    }
  })

export type IUnitState = z.infer<typeof UnitSchema>

export const createStartShiftSchema = (unitSelected: ExtendedUnit | undefined) => {
  const BaseStartShiftFormSchema = z.object({
    shiftModel: objectOf(EmptyZodObject).withType<ExtendedShiftModel>(),
    shiftTarget: z.number().nullish(),
    attendingShift: z.object({
      id: NonEmptyString,
      name: NonEmptyString,
      value: z.nativeEnum(AttendingShift).optional()
    })
  })

  const cycleTimeField = z.object({
    cycleTime: SpeedModeSchema
  })

  const speedModeField = z.object({
    speedMode: SpeedModeSchema,
    part: objectOf(EmptyZodObject).withType<ExtendedProduct>()
  })

  const StartShiftFormSchema = isAssemblyLine(unitSelected)
    ? BaseStartShiftFormSchema.merge(cycleTimeField)
    : BaseStartShiftFormSchema.merge(speedModeField)

  return StartShiftFormSchema
}

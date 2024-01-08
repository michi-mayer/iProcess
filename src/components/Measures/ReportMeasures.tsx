import { useEffect } from 'react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Accordion, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { Cause, Measure } from 'APIcustom'
import measures from 'i18n/en/measures.json'
import moment from 'moment-timezone'
import { ROUTER } from 'routes/routing'
import { TemplateDashboard } from 'types'
import * as yup from 'yup'
import { AttachmentInput, Progress, Status } from 'API'
import DisruptionAccordion from 'components/Accordions/DisruptionAccordion'
import MeasuresAccordion from 'components/Accordions/MeasuresAccordion'
import SystematicAccordion from 'components/Accordions/SystematicAccordion'
import SomethingWentWrongMessage from 'components/Error/SomethingWentWrongMessage'
import ArrowIcon from 'components/Icons/ArrowIcon'
import { useAuth } from 'contexts/authContext'
import { asGraphQLValue, defined } from 'helper/utils'
import useMutateFile from 'hooks/services/useMutateFile'
import useMutateReportMeasure from 'hooks/services/useMutateReportMeasure'
import { fetchMeasureReportsList } from 'hooks/services/useQueryListReportMeasures'
import useQueryReportMeasureById from 'hooks/services/useQueryReportMeasureById'
import { CustomSelect } from 'lib/form/SelectForm'
import { GroupUIDiscardButton, GroupUISubmitButton } from 'lib/ui/Buttons'
import { NextTokenProps } from 'services/client'
import { colors } from 'theme'

export type MeasureTranslationKeys = keyof typeof measures.filter

export const AccordionDivider = styled(Divider)({
  backgroundColor: colors.gray4
})

export const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)({
  fill: colors.blue
})

export const CustomAccordion = styled(Accordion)({
  boxShadow: 'none',
  '&.Mui-disabled': {
    color: colors.gray3,
    backgroundColor: colors.white
  }
})

const reportMeasureSchema = yup
  .object({
    id: yup.string().optional(),
    isCritical: yup.boolean().required(),
    notes: yup.string().nullable().notRequired(),
    attachments: yup
      .array<AttachmentInput[]>()
      .of(
        yup
          .object({
            key: yup.string().min(1).required(),
            type: yup.string().min(1).required(),
            size: yup.number().min(1).required(),
            uploadedBy: yup.string().min(1).required(),
            createdAt: yup.date().required()
          })
          .notRequired()
      )
      .notRequired(),
    deletedFiles: yup
      .array<AttachmentInput[]>()
      .of(
        yup
          .object({
            key: yup.string().min(1).required(),
            type: yup.string().min(1).required(),
            size: yup.number().min(1).required(),
            uploadedBy: yup.string().min(1).required(),
            createdAt: yup.date().required()
          })
          .notRequired()
      )
      .notRequired(),
    progress: yup.mixed<Progress>().oneOf(Object.values(Progress)).required(),
    what: yup.string().nullable().notRequired(),
    when: yup.string().notRequired(),
    where: yup.string().nullable().notRequired(),
    causes: yup
      .array<Cause[]>()
      .of(
        yup
          .object({
            id: yup.string().min(1).required(),
            cause: yup.string().min(1).required()
          })
          .required()
      )
      .notRequired(),
    measures: yup
      .array<Measure[]>()
      .of(
        yup
          .object({
            id: yup.string(),
            description: yup.string().required(),
            subDepartment: yup.string().required(),
            status: yup.mixed<Status>().oneOf(Object.values(Status)).required(),
            dueDate: yup.string().required()
          })
          .required()
      )
      .notRequired()
  })
  .required()

type YupSchema = yup.InferType<typeof reportMeasureSchema>
type YupSchemaWithoutArrays = Omit<YupSchema, 'causes' | 'measures' | 'attachments' | 'deletedFiles'>
export interface IReportMeasureState extends YupSchemaWithoutArrays {
  measures?: Measure[]
  causes: Cause[]
  attachments: AttachmentInput[]
  deletedFiles?: AttachmentInput[]
}

const initialReportMeasureState: IReportMeasureState = {
  id: undefined,
  notes: undefined,
  isCritical: false,
  attachments: [],
  deletedFiles: [],
  progress: Progress.Open,
  causes: [],
  what: undefined,
  when: undefined,
  where: undefined,
  measures: []
}

export interface Position {
  top: number
  height: number
}

const ReportMeasures = () => {
  const { authInfo } = useAuth()
  const { t } = useTranslation('measures')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { reportId } = useParams()

  const { data: reportMeasure } = useQueryReportMeasureById(reportId)
  const { mutate, isPending, isError, isSuccess } = useMutateReportMeasure()
  const { mutate: deleteFile } = useMutateFile()
  const location = useLocation()
  const URLState = location.state as TemplateDashboard | undefined
  const reportState: TemplateDashboard | undefined = reportMeasure
    ? {
        ...reportMeasure,
        templateId: reportMeasure.templateId
      }
    : undefined
  const templateState = URLState ?? reportState

  // Hook form
  const methods = useForm({
    resolver: yupResolver(reportMeasureSchema),
    defaultValues: reportMeasure
      ? {
          id: reportMeasure.id,
          notes: reportMeasure.notes,
          isCritical: reportMeasure.isCritical,
          attachments: reportMeasure.attachments,
          deletedFiles: [],
          progress: reportMeasure.progress,
          what: reportMeasure.what,
          when: reportMeasure.when,
          where: reportMeasure.where,
          causes: reportMeasure.causes,
          measures: reportMeasure.measures
        }
      : {
          ...initialReportMeasureState,
          user: {
            id: defined('ReportMeasures', authInfo?.userAttributes?.sub),
            email: defined('ReportMeasures', authInfo?.userEmail),
            cognitoUserName: defined('ReportMeasures', authInfo?.userAttributes?.preferred_username),
            name: defined('ReportMeasures', authInfo?.userName)
          },
          when: templateState?.firstOccurrence.split('T')[0]
        }
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = methods

  const onSubmit: SubmitHandler<IReportMeasureState> = (data: IReportMeasureState): void => {
    if (templateState) {
      mutate({
        id: reportId,
        templateId: templateState.templateId,
        description: templateState.description,
        unitId: templateState.unitId,
        frequency: templateState.frequency,
        totalDuration: templateState.totalDuration,
        productNumber: templateState.productNumber,
        cycleStationName: templateState.cycleStationName,
        firstOccurrence: templateState.firstOccurrence,
        classifications: templateState.classifications,
        progress: data.progress,
        attachments: data.attachments,
        notes: asGraphQLValue(data.notes),
        isCritical: data.isCritical,
        what: asGraphQLValue(data.what),
        when: data.when,
        where: asGraphQLValue(data.where),
        causes: data.causes,
        measures: data.measures ?? []
      })

      if (data.deletedFiles && data.deletedFiles.length > 0) {
        for (const attachment of data.deletedFiles || []) {
          deleteFile(attachment.key)
        }
      }
    }
  }

  useEffect(() => {
    let mounted = true
    if (mounted && isSuccess) {
      navigate(ROUTER.MEASURES)
    }
    return () => {
      mounted = false
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (reportMeasure) {
      // * useForm is caching undefined when pasting the url and not coming from the measures overview and that's why we need to reset once we get the data
      reset({
        id: reportMeasure.id,
        notes: reportMeasure.notes,
        isCritical: reportMeasure.isCritical,
        attachments: reportMeasure.attachments,
        deletedFiles: [],
        progress: reportMeasure.progress,
        what: reportMeasure.what,
        when: reportMeasure.when,
        where: reportMeasure.where,
        causes: reportMeasure.causes,
        measures: reportMeasure.measures
      })
    }
  }, [reportMeasure, reset])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '1420px', margin: 'auto' }}>
        <Grid container item style={{ display: 'flex', flexDirection: 'column' }}>
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to={ROUTER.MEASURES}
              onMouseOver={() =>
                queryClient.prefetchInfiniteQuery({
                  queryKey: ['ListReportMeasures'],
                  queryFn: ({ pageParam }) => fetchMeasureReportsList({ nextToken: pageParam }),
                  initialPageParam: undefined as NextTokenProps['nextToken']
                })
              }
              style={{
                color: colors.gray2
              }}
            >
              <Typography variant='body1' style={{ color: colors.gray2 }}>
                {t('header.overview')}
              </Typography>
            </Link>
            <ArrowIcon fill={colors.gray2} width={'1rem'} height={'1rem'} style={{ transform: 'rotate(-90deg)' }} />
            {reportId ? (
              <Typography variant='body1'>{t('header.measureReport')}</Typography>
            ) : (
              <Typography variant='body1'>{t('header.newMeasureReport')}</Typography>
            )}
          </Grid>
          <Grid item style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
            <Typography variant='h5'>{t('header.measureReport')}</Typography>
            <Typography variant='h1'>{templateState?.description}</Typography>
          </Grid>
          <Grid style={{ marginBottom: '0.5rem' }}>
            <Typography variant='caption'>
              {t('header.createdByAndDate', {
                date: moment().format('DD.MM.YYYY'),
                interpolation: { escapeValue: false }
              })}
            </Typography>
          </Grid>
          <Grid
            container
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: !isError ? '1rem' : undefined
            }}
          >
            <Grid item xs={4}>
              <Controller
                name={'progress'}
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id='input-progress'
                    error={!!errors.progress}
                    IconComponent={StyledKeyboardArrowDownIcon}
                    style={{ width: '150px', height: '32px' }}
                  >
                    {Object.values(Progress)?.map((progressStatus, index) => {
                      return (
                        <MenuItem key={index} value={progressStatus}>
                          <Grid alignItems={'center'} display={'flex'}>
                            <Typography variant='body1'>
                              {t(`filter.${progressStatus.toLowerCase() as MeasureTranslationKeys}`)}
                            </Typography>
                          </Grid>
                        </MenuItem>
                      )
                    })}
                  </CustomSelect>
                )}
              />
            </Grid>
            <Grid
              item
              gap={2}
              xs={8}
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center'
              }}
            >
              <Link
                to={ROUTER.MEASURES}
                style={{
                  color: colors.gray2
                }}
              >
                <GroupUIDiscardButton id='reportMeasures-usetemplate-dialog-discard'>
                  {t('header.discard')}
                </GroupUIDiscardButton>
              </Link>
              <GroupUISubmitButton
                id='reportMeasures-usetemplate-dialog-submit'
                icon={!isPending ? 'save-24' : 'icon-empty-24'}
                size='m'
                isLoading={isPending}
              >
                {t('header.save')}
              </GroupUISubmitButton>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <SomethingWentWrongMessage isError={isError} />
          </Grid>
        </Grid>

        <AccordionDivider />

        {/* // * DISRUPTION DETAILS */}
        <DisruptionAccordion templateState={templateState} />

        <AccordionDivider />

        {/* // * SYSTEMATIC PROBLEM ANALYSIS */}
        <SystematicAccordion />

        <AccordionDivider />

        {/* // * MEASURES */}
        <MeasuresAccordion />
      </form>
    </FormProvider>
  )
}

export default ReportMeasures

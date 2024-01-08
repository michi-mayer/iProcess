import { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useEffect } from 'react'
import { Controller, FieldArrayWithId, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Button,
  Grid,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField as TimePicker,
  Typography
} from '@mui/material'
import moment from 'moment-timezone'
import { isAssemblyLine } from 'types'
import * as yup from 'yup'
import { Type, UnitType } from 'API'
import SomethingWentWrongMessage from 'components/Error/SomethingWentWrongMessage'
import AddIcon from 'components/Icons/AddIcon'
import { ExtendedShiftModel, Shift, useIProcessState } from 'contexts/iProcessContext'
import { getISOUtcTimeFromLocalTime } from 'helper/time'
import { defined, getCurrentConfigs } from 'helper/utils'
import useMutationUpdateConfigurationAndActualCount from 'hooks/services/useMutationUpdateConfigurationAndActualCount'
import useQueryGetPartsByUnit from 'hooks/services/useQueryGetPartsByUnit'
import useCloseDialog from 'hooks/useCloseDialog'
import useDefaultSpeedModes from 'hooks/useDefaultSpeedModes'
import useMediaQuery from 'hooks/useMediaQuery'
import SelectDropDown from 'lib/form/SelectDropDown'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import ConfigTimeline, { TimeLineDotCustom } from '../Timelines/ConfigTimeline'
import OutputTextField from './OutputTextField'
import ResetConfigDialog from './ResetConfigDialog'
import { ConfigurationUnit, getSpeedModeCycleTime, isOutOfTimeRange, mapConfigurations } from './utils'
import ValidationWarning from './ValidationWarning'

const schema = yup
  .object({
    isOutputRequired: yup.boolean(),
    configurations: yup.array().of(
      yup.object({
        hasSameConfigurationItemsAsPrevious: yup.boolean().isFalse().required(),
        isOutOfTimeRange: yup.boolean().isFalse().required(),
        isSameTime: yup.boolean().isFalse().required(),
        shiftModel: yup.string().required(),
        part: yup.string().required(),
        validFrom: yup.string().required(),
        validUntil: yup.string().required(),
        speedMode: yup.string(),
        cycleTime: yup.string(),
        output: yup.number().when('isOutputRequired', {
          is: true,
          then: yup.number().min(1).required(),
          otherwise: yup.number().notRequired()
        })
      })
    )
  })
  .required()

export interface IConfigState {
  isOutputRequired: boolean
  configurations: ConfigurationUnit[]
}

export type FieldArrayConfig = FieldArrayWithId<IConfigState, 'configurations', 'id'>
interface Props {
  onClose: () => void
  changeDialogTitle: Dispatch<SetStateAction<boolean>>
  resetConfig: boolean
}

const UpdateConfigDialog: FC<Props> = ({ onClose, changeDialogTitle, resetConfig }) => {
  const { t } = useTranslation()
  const [isDesktopWidth] = useMediaQuery('lg')
  const { configurationByUnitId, unitSelected, selectedShift, timeZone, shiftTimeRange } = useIProcessState()
  const { data: partList } = useQueryGetPartsByUnit()
  const { defaultItem } = useDefaultSpeedModes()

  const initialConfigurations = mapConfigurations(
    getCurrentConfigs(configurationByUnitId, unitSelected?.id),
    unitSelected,
    partList,
    defaultItem
  )

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useForm<IConfigState>({
    resolver: yupResolver(schema),
    defaultValues: { configurations: initialConfigurations }
  })
  const configurations = watch('configurations')

  const {
    fields: configurationCollection,
    remove,
    insert,
    update
  } = useFieldArray({
    control,
    name: 'configurations'
  })

  const { mutate, isPending, isSuccess, isError } = useMutationUpdateConfigurationAndActualCount()
  useCloseDialog(isSuccess, onClose)

  const selectModeDropdownId = unitSelected?.type ? getSpeedModeCycleTime(unitSelected.type) : undefined

  const onSubmit: SubmitHandler<IConfigState> = (data: IConfigState) => {
    const newConfig = data.configurations.map((configuration) => {
      const config = {
        validFrom: getISOUtcTimeFromLocalTime(configuration.validFrom, timeZone),
        validUntil: getISOUtcTimeFromLocalTime(configuration.validUntil, timeZone),
        partId: partList?.find((part) => configuration?.part?.includes(part?.partNumber as string))?.id ?? undefined,
        unitType: defined('UpdateConfigDialog', unitSelected?.type),
        shiftModelId: unitSelected?.shiftModels?.find((shiftModel) => shiftModel.name === configuration.shiftModel)?.id,
        timeZone
      }
      if (isAssemblyLine(unitSelected)) {
        return {
          ...config,
          cycleTime:
            unitSelected?.speedModeCollection?.find((speedMode) => speedMode.name === configuration.cycleTime)?.value ??
            defaultItem.value,
          shiftTarget: Number.parseInt(configuration?.output as string)
        }
      } else {
        return {
          ...config,
          speedMode:
            unitSelected?.speedModeCollection?.find((speedMode) => speedMode.name === configuration.speedMode)?.value ??
            defaultItem.value,
          cycleTime: partList?.find((part) => part.id === config.partId)?.targetCycleTime
        }
      }
    })
    mutate(newConfig)
  }

  const handleAddNewConfigItem = () => {
    const previousEndTime = getValues(`configurations.${configurationCollection.length - 1}.validUntil`)
    const part = getValues(`configurations.${configurationCollection.length - 1}.part`)
    const shiftModel = getValues(`configurations.${configurationCollection.length - 1}.shiftModel`)
    const cycleTime = getValues(`configurations.${configurationCollection.length - 1}.cycleTime`)
    const speedMode = getValues(`configurations.${configurationCollection.length - 1}.speedMode`)

    const configLength = configurations.length
    const values = Object.values(
      defined('configurations handleAddNewConfigItem at UpdateConfigDialog', configurations[configurations.length - 1])
    )

    if (!values.includes(undefined) && !values.includes('') && !values.includes('0')) {
      const newConfig = {
        validFrom: previousEndTime,
        validUntil: defined(
          'validUntil at handleAddNewConfigItem UpdateConfigDialog',
          initialConfigurations[initialConfigurations.length - 1]?.validUntil
        ), // TODO: This will be handled in VDD-912
        part,
        shiftModel
      }
      if (isAssemblyLine(unitSelected)) {
        insert(configLength, { ...newConfig, cycleTime })
      } else {
        insert(configLength, { ...newConfig, speedMode })
      }
    }
  }

  const handleDeleteLastConfig = (index: number) => {
    remove(index)
    setValue(
      `configurations.${index - 1}.validUntil`,
      moment(shiftTimeRange?.endTime, moment.HTML5_FMT.TIME_SECONDS, true).format(moment.HTML5_FMT.TIME)
    )
  }

  const handleChangeNextStartTime = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value, name } = event.target
    const [, indexValue] = name.split('.')
    if (indexValue && index < configurations.length - 1) {
      const configuration = defined('handleChangeNextStartTime.plus1', configurations[index + 1])
      setValue(`configurations.${Number.parseInt(indexValue) + 1}.validFrom`, value)
      update(index + 1, { ...configuration, validFrom: value })
    } else {
      const configuration = defined('handleChangeNextStartTime', configurations?.[index])
      update(index, { ...configuration, validUntil: value })
    }
  }

  const getShiftModelCollection = useCallback((): ExtendedShiftModel[] => {
    const shiftModelCollection: ExtendedShiftModel[] = []

    if (unitSelected?.shiftModels)
      for (const shiftModel of unitSelected.shiftModels || []) {
        let containsInactiveShift = false
        for (const scheduleSlot of shiftModel.scheduleHours) {
          if (
            scheduleSlot?.shiftType &&
            Shift[scheduleSlot?.shiftType] === selectedShift &&
            scheduleSlot.type === Type.Inactive
          ) {
            containsInactiveShift = true
          }
        }
        if (!containsInactiveShift) {
          shiftModelCollection.push(shiftModel)
        }
      }

    return shiftModelCollection
  }, [selectedShift, unitSelected?.shiftModels])

  const handleResetClick = () => {
    changeDialogTitle(true)
  }

  useEffect(() => {
    if (isAssemblyLine(unitSelected)) {
      setValue('isOutputRequired', true)
    } else {
      setValue('isOutputRequired', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitSelected])

  const validateHasSameConfigurationItemsAsPrevious = useCallback(() => {
    let previousConfig: ConfigurationUnit | undefined
    for (const indexString in configurations) {
      const index = Number.parseInt(indexString)
      const isSameShiftModel = previousConfig?.shiftModel === configurations[index]?.shiftModel
      const isSameCycleTime = previousConfig?.cycleTime === configurations[index]?.cycleTime
      const isSameOutput = previousConfig?.output === configurations[index]?.output
      const isSameSpeedMode = previousConfig?.speedMode === configurations[index]?.speedMode
      const isSamePart = previousConfig?.part === configurations[index]?.part

      if (isAssemblyLine(unitSelected)) {
        if (isSameShiftModel && isSameCycleTime && isSameOutput) {
          setValue(`configurations.${index}.hasSameConfigurationItemsAsPrevious`, true, {
            shouldValidate: true
          })
        } else {
          setValue(`configurations.${index}.hasSameConfigurationItemsAsPrevious`, false, {
            shouldValidate: true
          })
        }
      } else {
        if (isSameShiftModel && isSameSpeedMode && isSamePart) {
          setValue(`configurations.${index}.hasSameConfigurationItemsAsPrevious`, true, {
            shouldValidate: true
          })
        } else {
          setValue(`configurations.${index}.hasSameConfigurationItemsAsPrevious`, false, {
            shouldValidate: true
          })
        }
      }

      previousConfig = configurations[index] as ConfigurationUnit
    }
  }, [configurations, setValue, unitSelected])

  useEffect(() => {
    let mounted = true

    const validateIsOutOfTimeRange = () => {
      for (const indexString in configurations) {
        const index = Number.parseInt(indexString)

        const currentConfiguration = configurations[index]
        const isSameTime = currentConfiguration?.validFrom === currentConfiguration?.validUntil

        if (currentConfiguration && isOutOfTimeRange(currentConfiguration, shiftTimeRange, selectedShift)) {
          setValue(`configurations.${index}.isOutOfTimeRange`, true, {
            shouldValidate: true
          })
          if (isSameTime) {
            setValue(`configurations.${index}.isSameTime`, true, {
              shouldValidate: true
            })
          } else {
            setValue(`configurations.${index}.isSameTime`, false, {
              shouldValidate: true
            })
          }
        } else {
          setValue(`configurations.${index}.isOutOfTimeRange`, false, {
            shouldValidate: true
          })
          setValue(`configurations.${index}.isSameTime`, false, {
            shouldValidate: true
          })
        }
      }
    }

    if (mounted) {
      validateIsOutOfTimeRange()
      validateHasSameConfigurationItemsAsPrevious()
    }

    return () => {
      mounted = false
    }
  }, [configurations, selectedShift, setValue, shiftTimeRange, validateHasSameConfigurationItemsAsPrevious])

  return (
    <>
      {resetConfig ? (
        <ResetConfigDialog onClose={onClose} changeDialogTitle={changeDialogTitle} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container item xs={12}>
            <Grid container item xs={12} style={{ marginTop: '16px' }}>
              <Typography variant='body2'>{t('configuration.dialogSubTitle')}</Typography>
            </Grid>
            <Grid container item xs={12} style={{ marginTop: '2rem' }}>
              {isDesktopWidth && <ConfigTimeline configurations={configurationCollection} />}
              <Grid
                container
                item
                md={12}
                lg={10}
                direction='row'
                justifyContent='flex-start'
                style={{ height: '100%' }}
              >
                <Grid container item xs={6} alignItems='center' style={{ borderBottom: `2px solid ${colors.gray2}` }}>
                  <Typography variant='h4'>{t('configuration.currentConfigurationsTitle')}</Typography>
                </Grid>
                <Grid item xs={6} textAlign='right' style={{ borderBottom: `2px solid ${colors.gray2}` }}>
                  <Button
                    startIcon={<RefreshIcon style={{ transform: 'rotate(-110deg)' }} />}
                    size='medium'
                    style={{
                      color: colors.blue
                    }}
                    onClick={handleResetClick}
                    id='reset-configuration'
                  >
                    <Typography variant='h3'>{t('configuration.resetConfig')}</Typography>
                  </Button>
                </Grid>
                <Grid container item xs={12} style={{ height: '90%' }}>
                  <Paper elevation={0} square style={{ width: '100%', paddingTop: '1rem' }}>
                    <Grid container item xs={12} spacing={3} style={{ marginBottom: '0.5rem' }}>
                      <Grid item xs={0.5} />
                      <Grid item xs={1.5}>
                        <Typography variant='h5'>{t('configuration.startTime')}</Typography>
                      </Grid>
                      <Grid item xs={1.5}>
                        <Typography variant='h5'>{t('configuration.endTime')}</Typography>
                      </Grid>
                      <Grid item xs={2.66}>
                        <Typography variant='h5'>{t('configuration.shiftModelTitle')}</Typography>
                      </Grid>
                      <Grid item xs={2.66}>
                        <Typography variant='h5'>{t('configuration.speedModeTitle')}</Typography>
                      </Grid>
                      <Grid item xs={2.66}>
                        <Typography variant='h5'>
                          {isAssemblyLine(unitSelected)
                            ? t('configuration.outputTitle')
                            : t('configuration.productTitle')}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} direction='column'>
                      {configurationCollection?.map((configuration, index) => {
                        const lastIndex = configurationCollection.length - 1
                        return (
                          <div
                            key={configuration.id}
                            style={{ borderTop: index > 0 ? `0.5px solid ${colors.gray3}` : undefined }}
                          >
                            <Grid
                              container
                              item
                              xs={12}
                              spacing={3}
                              direction='row'
                              style={{
                                paddingTop: index > 0 ? '12px' : undefined
                              }}
                            >
                              <Grid item xs={0.5}>
                                <TimeLineDotCustom color='primary'>{index + 1}</TimeLineDotCustom>
                              </Grid>
                              <Grid item xs={1.5}>
                                <Controller
                                  name={`configurations.${index}.validFrom`}
                                  control={control}
                                  defaultValue={configuration.validFrom}
                                  shouldUnregister
                                  render={({ field }) => (
                                    <TimePicker
                                      {...field}
                                      id={`validFrom-${index}`}
                                      disabled={true}
                                      type='time'
                                      size='small'
                                      helperText={
                                        !!errors?.configurations?.[index]?.validFrom && t('configuration.errorMessage')
                                      }
                                      error={!!errors?.configurations?.[index]?.validFrom}
                                      inputProps={{
                                        style: {
                                          fontSize: 16
                                        }
                                      }}
                                      sx={{ minWidth: '6.5rem', width: '100%' }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={1.5}>
                                <Controller
                                  name={`configurations.${index}.validUntil`}
                                  control={control}
                                  defaultValue={configuration.validUntil}
                                  shouldUnregister
                                  rules={{
                                    onChange: (event) => handleChangeNextStartTime(event, index)
                                  }}
                                  render={({ field }) => (
                                    <TimePicker
                                      {...field}
                                      id={`validUntil-${index}`}
                                      disabled={index === lastIndex}
                                      type='time'
                                      size='small'
                                      error={
                                        !!errors?.configurations?.[index]?.validUntil ||
                                        !!errors?.configurations?.[index]?.isOutOfTimeRange ||
                                        !!errors?.configurations?.[index + 1]?.isSameTime
                                      }
                                      helperText={
                                        !!errors?.configurations?.[index]?.validUntil &&
                                        !errors?.configurations?.[index + 1]?.isSameTime &&
                                        t('configuration.errorMessage')
                                      }
                                      inputProps={{
                                        style: {
                                          fontSize: 16
                                        }
                                      }}
                                      sx={{ minWidth: '6.5rem', width: '100%' }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={2.66}>
                                <Controller
                                  name={`configurations.${index}.shiftModel`}
                                  control={control}
                                  defaultValue=''
                                  render={({ field: { value, name } }) => (
                                    <SelectDropDown
                                      id={`configurations.${index}.shiftModel`}
                                      name={name}
                                      itemCollection={getShiftModelCollection()}
                                      renderName={(shiftModel) => shiftModel.name}
                                      onClick={(shiftModel) => {
                                        setValue(`configurations.${index}.shiftModel`, shiftModel.name, {
                                          shouldValidate: true,
                                          shouldDirty: true
                                        })
                                        validateHasSameConfigurationItemsAsPrevious()
                                      }}
                                      error={
                                        !!errors?.configurations?.[index]?.shiftModel ||
                                        !!errors?.configurations?.[index]?.hasSameConfigurationItemsAsPrevious
                                      }
                                      errorMessage={
                                        errors?.configurations?.[index]?.shiftModel && t('configuration.errorMessage')
                                      }
                                      style={{
                                        height: '40px',
                                        width: '100%',
                                        marginTop: 0
                                      }}
                                      truncateSetValue
                                      value={value}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={2.66}>
                                <Controller
                                  name={`configurations.${index}.${getSpeedModeCycleTime(
                                    unitSelected?.type as UnitType
                                  )}`}
                                  control={control}
                                  defaultValue=''
                                  render={({ field: { value } }) => (
                                    <SelectDropDown
                                      id={`configurations.${index}.${selectModeDropdownId}`}
                                      itemCollection={unitSelected?.speedModeCollection}
                                      renderName={(speedMode) => speedMode.name}
                                      defaultItem={defaultItem}
                                      defaultComponent={(defaultItemReceived) => (
                                        <MenuItem
                                          id='speedMode-item'
                                          value={defaultItem.name}
                                          onClick={() => {
                                            const unitSelectedType = unitSelected?.type as UnitType
                                            setValue(
                                              `configurations.${index}.${getSpeedModeCycleTime(unitSelectedType)}`,
                                              defaultItemReceived.name,
                                              {
                                                shouldValidate: true,
                                                shouldDirty: true
                                              }
                                            )
                                            if (unitSelectedType === UnitType.assemblyLine) {
                                              setValue(`configurations.${index}.output`, '')
                                            }

                                            validateHasSameConfigurationItemsAsPrevious()
                                          }}
                                        >
                                          <Typography variant='body1'>{defaultItem.name}</Typography>
                                        </MenuItem>
                                      )}
                                      /**
                                       * From the Admin app, we store under speedModes attribute the factor OR cycleTime depending whether it is an Assembly Line or a Product Unit
                                       * so this is why we need make the difference between each unit Type
                                       *
                                       * speedMode = factor
                                       * cycleTime = cycleTime
                                       */
                                      onClick={(speedMode) => {
                                        setValue(
                                          `configurations.${index}.${getSpeedModeCycleTime(
                                            unitSelected?.type as UnitType
                                          )}`,
                                          speedMode.name,
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true
                                          }
                                        )
                                        validateHasSameConfigurationItemsAsPrevious()
                                      }}
                                      error={
                                        (isAssemblyLine(unitSelected)
                                          ? !!errors?.configurations?.[index]?.cycleTime
                                          : !!errors?.configurations?.[index]?.speedMode) ||
                                        !!errors?.configurations?.[index]?.hasSameConfigurationItemsAsPrevious
                                      }
                                      errorMessage={
                                        !!errors?.configurations?.[index]?.cycleTime ||
                                        !!errors?.configurations?.[index]?.speedMode
                                          ? t('configuration.errorMessage')
                                          : undefined
                                      }
                                      style={{
                                        height: '40px',
                                        width: '100%',
                                        marginTop: 0
                                      }}
                                      truncateSetValue
                                      value={value}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={2.66}>
                                {isAssemblyLine(unitSelected) ? (
                                  <Controller
                                    name={`configurations.${index}.output`}
                                    control={control}
                                    defaultValue=''
                                    render={({ field }) => (
                                      <OutputTextField
                                        {...field}
                                        cycleTime={unitSelected?.speedModeCollection?.find(
                                          (cycleTime) =>
                                            cycleTime.name === getValues(`configurations.${index}.cycleTime`)
                                        )}
                                        shiftModelSelected={unitSelected?.shiftModels?.find(
                                          (shiftModel) =>
                                            shiftModel.name === getValues(`configurations.${index}.shiftModel`)
                                        )}
                                        onCalculatedOutput={(value) => {
                                          setValue(`configurations.${index}.output`, value?.toString(), {
                                            shouldValidate: true,
                                            shouldDirty: true
                                          })
                                          validateHasSameConfigurationItemsAsPrevious()
                                        }}
                                        error={
                                          !!errors?.configurations?.[index]?.output ||
                                          !!errors?.configurations?.[index]?.hasSameConfigurationItemsAsPrevious
                                        }
                                        errorMessage={
                                          errors?.configurations?.[index]?.output && t('configuration.errorMessage')
                                        }
                                        disabled={getValues(`configurations.${index}.cycleTime`) !== defaultItem.name}
                                        style={{
                                          height: '40px',
                                          width: '100%',
                                          padding: '8px 14px',
                                          fontSize: 12
                                        }}
                                        marginTop='0rem'
                                      />
                                    )}
                                  />
                                ) : (
                                  <Controller
                                    name={`configurations.${index}.part`}
                                    control={control}
                                    defaultValue=''
                                    render={({ field: { value } }) => (
                                      <SelectDropDown
                                        id={`configurations.${index}.part`}
                                        disabled={true}
                                        itemCollection={partList}
                                        renderName={(part) => `${part.partNumber} (${part?.name})`}
                                        onClick={(part) => {
                                          setValue(
                                            `configurations.${index}.part`,
                                            `${part.partNumber} (${part?.name})`,
                                            {
                                              shouldValidate: true,
                                              shouldDirty: true
                                            }
                                          )

                                          validateHasSameConfigurationItemsAsPrevious()
                                        }}
                                        error={
                                          !!errors?.configurations?.[index]?.part ||
                                          !!errors?.configurations?.[index]?.hasSameConfigurationItemsAsPrevious
                                        }
                                        errorMessage={
                                          errors?.configurations?.[index]?.part && t('configuration.errorMessage')
                                        }
                                        style={{
                                          height: '40px',
                                          width: '100%',
                                          marginTop: 0
                                        }}
                                        truncateSetValue
                                        value={value}
                                      />
                                    )}
                                  />
                                )}
                              </Grid>
                              {configurationCollection.length > 1 && index === configurationCollection.length - 1 ? (
                                <Grid
                                  item
                                  xs={0.5}
                                  style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}
                                >
                                  <IconButton size='medium' onClick={() => handleDeleteLastConfig(index)}>
                                    <DeleteIcon color='primary' />
                                  </IconButton>
                                </Grid>
                              ) : undefined}
                            </Grid>
                            <ValidationWarning
                              isSameTime={!!errors?.configurations?.[index]?.isSameTime}
                              hasSameConfigurationItemsAsPreviousValidation={
                                !!errors?.configurations?.[index]?.hasSameConfigurationItemsAsPrevious
                              }
                              isOutOfTimeRangeValidation={!!errors?.configurations?.[index]?.isOutOfTimeRange}
                            />
                          </div>
                        )
                      })}
                    </Grid>
                    <Grid item xs={3}>
                      <ListItem
                        button
                        onClick={handleAddNewConfigItem}
                        style={{ paddingLeft: 0 }}
                        id='add-new-config-item'
                        disabled={false}
                      >
                        <ListItemIcon
                          style={{
                            padding: 0,
                            margin: 0,
                            minWidth: 0,
                            paddingRight: '16px'
                          }}
                        >
                          <AddIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant='body2' color={colors.blue}>
                              {t('configuration.addNewConfig')}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <SomethingWentWrongMessage isError={isError} />
          </Grid>
          <GroupUILayout>
            <GroupUIDiscardButton id='discard-button' onClick={onClose}>
              {t('buttons.discard')}
            </GroupUIDiscardButton>
            <GroupUISubmitButton
              id='submit-button'
              icon={!isPending ? 'save-24' : 'icon-empty-24'}
              isLoading={isPending}
            >
              {t('buttons.save')}
            </GroupUISubmitButton>
          </GroupUILayout>
        </form>
      )}
    </>
  )
}

export default UpdateConfigDialog

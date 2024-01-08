import { useCallback, useEffect, useState } from 'react'
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { FilterOptionsState, Grid, ListItem, Paper, PaperProps, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { isObject } from 'remeda'
import { NIL, v4 as uuid } from 'uuid'
import { IUnitState, UnitSchema } from 'zodSchemas'
import { UnitType } from 'API'
import SomethingWentWrongMessage from 'components/Error/SomethingWentWrongMessage'
import type { ExtendedUnit } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import { isUnitConnectedToMachine } from 'helper/units'
import { textIsIncluded } from 'helper/utils'
import useMutateUnit from 'hooks/services/useMutateUnit'
import useQueryMachineData, { MachineData } from 'hooks/services/useQueryMachineData'
import useQueryTeamsCyclestations from 'hooks/services/useQueryTeamsCyclestations'
import useCloseDialog from 'hooks/useCloseDialog'
import CycleStationsForm from 'lib/form/CycleStationsForm'
import InputForm from 'lib/form/InputForm'
import InputFormAutocomplete from 'lib/form/InputFormAutocomplete'
import M100Range from 'lib/form/M100Range'
import SpeedModeForm from 'lib/form/SpeedModeForm'
import TeamsForm from 'lib/form/TeamsForm'
import UnitTypeDropDown from 'lib/form/UnitTypeDropDown'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { colors } from 'theme'

const StackWithDivider = styled(Stack)({
  borderBottom: `1px solid ${colors.gray3}`
})

const initialUnitState: Partial<IUnitState> = {
  shortName: '',
  name: '',
  manufacturer: '',
  machineId: '',
  m100Range: undefined,
  speedModeCollection: [],
  teams: [],
  cycleStations: []
}

interface UnitsDialogProps {
  onClose: () => void | undefined
  unitData: ExtendedUnit | undefined
}

const UnitsDialog = ({ onClose, unitData }: UnitsDialogProps) => {
  const [machineInputValue, setMachineInputValue] = useState(unitData?.machineId === NIL ? '' : unitData?.machineId)

  const { mutate, isSuccess, isPending, isError } = useMutateUnit({ previousUnitData: unitData })
  const { t } = useTranslation('admin')

  const methods = useForm<IUnitState>({
    resolver: zodResolver(UnitSchema),
    defaultValues: initialUnitState
  })

  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = methods
  const unitType = watch('type')
  useCloseDialog(isSuccess, onClose)

  const { data: teamCycleStationData } = useQueryTeamsCyclestations({ unitId: unitData?.id, unitType: unitData?.type })
  const { data: availableMachines } = useQueryMachineData({ machineId: unitData?.machineId ?? undefined })

  const { fields: teams } = useFieldArray({
    control,
    name: 'teams'
  })

  const suggestedOptions = useCallback((options: MachineData[], { inputValue }: FilterOptionsState<MachineData>) => {
    return options.filter((_) => textIsIncluded(_.machineId, inputValue))
  }, [])

  const renderOptionLabel = useCallback((_: MachineData | string) => (typeof _ === 'object' ? _.machineId : ''), [])

  const onSubmit: SubmitHandler<IUnitState> = (data: IUnitState): void => mutate(data)

  useEffect(() => {
    if (unitType === UnitType.productionUnit) {
      setValue('m100Range', undefined)
    }
  }, [setValue, unitType])

  useEffect(() => {
    if (unitType === UnitType.assemblyLine && teams.length === 0) {
      setValue('teams', [
        {
          id: uuid(),
          name: '',
          unitId: '',
          index: 1,
          cycleStations: []
        }
      ])
    }
  }, [teams, setValue, unitType])

  useEffect(() => {
    if (unitData) {
      reset(
        {
          id: unitData.id,
          name: unitData.name,
          shortName: unitData.shortName,
          speedModeCollection: unitData.speedModeCollection,
          manufacturer: unitData.manufacturer,
          cycleStations: unitData.type === UnitType.productionUnit ? teamCycleStationData : [],
          teams: unitData.type === UnitType.assemblyLine ? teamCycleStationData : [],
          type: unitData.type,
          m100Range: unitData.m100Range,
          machineId: isUnitConnectedToMachine(unitData) ? unitData.machineId : EMPTY_STRING
        },
        { keepDefaultValues: true }
      )
    }
  }, [teamCycleStationData, reset, unitData])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }} id='unit-form'>
        <StackWithDivider>
          <Controller
            control={control}
            name='type'
            defaultValue={undefined}
            render={({ field }) => (
              <UnitTypeDropDown
                {...field}
                title={t('unitsSection.unitType')}
                isError={!!errors?.type}
                errorMessage={t('unitsSection.typeErrorInputMessage')}
                style={{ width: '347px' }}
              />
            )}
          />
          <InputForm
            {...register('shortName')}
            title={t('unitsSection.unitShortName')}
            titleVariant='subtitle1'
            type='text'
            error={!!errors?.shortName}
            errorMessage={t('unitsSection.shortNameErrorInputMessage')}
            placeholder={t('unitsSection.unitShortNamePlaceholder')}
            id='input-shortName'
            inputProps={{
              maxLength: 6
            }}
            style={{ width: '15%' }}
            marginTop={'4px'}
          />
          <InputForm
            title={t('unitsSection.unitName')}
            titleVariant='subtitle1'
            type='text'
            {...register('name')}
            error={!!errors?.name}
            errorMessage={t('unitsSection.nameErrorInputMessage')}
            placeholder={t('unitsSection.unitNamePlaceholder')}
            id='input-name'
            inputProps={{
              maxLength: 30
            }}
            style={{ width: '347px' }}
          />

          <InputForm
            title={t('unitsSection.unitManufacturer')}
            titleVariant='subtitle1'
            type='text'
            {...register('manufacturer')}
            placeholder={t('unitsSection.unitManufacturerPlaceholder')}
            id='input-manufacturer'
            inputProps={{
              maxLength: 30
            }}
            style={{ width: '347px', marginBottom: '1.5rem' }}
          />
          <Grid item style={{ width: '347px', marginBottom: '24px' }}>
            <Typography variant='subtitle1'>Machine ID</Typography>
            <InputFormAutocomplete
              options={availableMachines || []}
              filterOptions={suggestedOptions}
              openOnFocus={true}
              isDisabled={availableMachines.length === 0}
              inputValue={machineInputValue}
              // eslint-disable-next-line unicorn/no-null
              value={{ machineId: watch('machineId') } || null}
              onChange={(_event, value) => {
                if (!value) return setValue('machineId', '')
                setValue('machineId', isObject(value) && 'machineId' in value ? value.machineId : '')
              }}
              isOptionEqualToValue={(option, value) => {
                if (value.machineId === '') return true
                return option.machineId === value.machineId
              }}
              onInputChange={(event, value) => {
                if (event) {
                  setMachineInputValue(value)
                }
              }}
              placeholder={
                availableMachines.length === 0
                  ? t('unitsSection.noAvailableMachine')
                  : t('unitsSection.machinePlaceholder')
              }
              getOptionLabel={renderOptionLabel}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.machineId} style={{ paddingLeft: '0px' }}>
                  <Typography {...props} style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
                    {option.machineId}
                  </Typography>
                </ListItem>
              )}
              PaperComponent={(props: PaperProps) => {
                return <Paper {...props}>{props.children}</Paper>
              }}
            />
          </Grid>
        </StackWithDivider>
        <StackWithDivider>
          <SpeedModeForm />
          {unitType === UnitType.assemblyLine && <M100Range />}
        </StackWithDivider>
        {unitType === UnitType.assemblyLine ? (
          <TeamsForm unitId={unitData?.id} />
        ) : (
          <CycleStationsForm
            unitId={unitData?.id}
            name='cycleStations'
            error={(index) => ({
              isError: !!errors?.cycleStations?.[index]?.name,
              message: errors?.cycleStations?.[index]?.name?.message
            })}
          />
        )}
        <SomethingWentWrongMessage isError={isError} />
        <GroupUILayout>
          <GroupUIDiscardButton id='units-usetemplate-dialog-discard' onClick={onClose}>
            {t('buttons.discard')}
          </GroupUIDiscardButton>
          <GroupUISubmitButton
            id='units-usetemplate-dialog-submit'
            icon={!isPending ? 'save-24' : 'icon-empty-24'}
            isLoading={isPending}
          >
            {t('buttons.save')}
          </GroupUISubmitButton>
        </GroupUILayout>
      </form>
    </FormProvider>
  )
}

export default UnitsDialog

import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Grid, Typography } from '@mui/material'
import { uniq } from 'remeda'
import { z } from 'zod'
import { UnitBasicInfoSchema } from 'zodSchemas'
import { Department, ExtendedGrouping, ExtendedUnit } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import useMutateGrouping from 'hooks/services/useMutateGrouping'
import { UseQueryListGroupingReturn } from 'hooks/services/useQueryListGrouping'
import useQueryListUnits from 'hooks/services/useQueryListUnits'
import useQueryListUsers from 'hooks/services/useQueryListUsers'
import useCloseDialog from 'hooks/useCloseDialog'
import InputForm from 'lib/form/InputForm'
import SelectForm from 'lib/form/SelectForm'
import SubDeparmentList from 'lib/form/SubDepartmentList'
import UnitList from 'lib/form/UnitList'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { arrayOf, definedArray, NonEmptyString, parse, WithID } from 'shared'
import { selectorSelectUnits } from '../../../routes/admin/selector-ids'

const SUB_DEPARTMENT_REGEX = /^[Kk]-(.{3})|^.{3}/

function getDepartment(subDepartment: string): string {
  if (!subDepartment) {
    return ''
  }
  const match = subDepartment.match(SUB_DEPARTMENT_REGEX)
  return match?.[0] ?? ''
}

const getUnitIDs = (groupings: ExtendedGrouping[]) => definedArray(groupings.flatMap((_) => _.units).map((_) => _?.id))

interface GroupingForm extends Omit<ExtendedGrouping, 'units' | 'createdAt'> {}

const GroupingFormSchema = parse<GroupingForm>().with({
  id: NonEmptyString.optional(),
  name: NonEmptyString.max(30),
  selectedUnits: z.array(UnitBasicInfoSchema).min(1),
  selectedSubDepartments: arrayOf(NonEmptyString)
})

interface GroupingDialogProps {
  listGrouping: UseQueryListGroupingReturn['items'] | undefined
  groupingData: ExtendedGrouping | undefined
  onClose: () => void | undefined
}

const GroupingDialog = ({ onClose, listGrouping, groupingData }: GroupingDialogProps) => {
  const [selectableDepartments, setSelectableDepartments] = useState<Department[] | undefined>([])
  const [selectableUnits, setSelectableUnits] = useState<(ExtendedUnit & WithID)[] | undefined>([])

  const { t } = useTranslation('admin')
  const { data: listUnits } = useQueryListUnits()
  const { data: subDepartments } = useQueryListUsers(['custom:subdepartment'])
  const { mutate, isSuccess, isPending } = useMutateGrouping()

  useCloseDialog(isSuccess, onClose)

  const methods = useForm<GroupingForm>({
    resolver: zodResolver(GroupingFormSchema),
    defaultValues: groupingData ?? { name: '', selectedUnits: [], selectedSubDepartments: [] }
  })

  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    register
  } = methods

  const selectedUnits = watch('selectedUnits')
  const selectedSubdepartments = watch('selectedSubDepartments')

  const onSubmit: SubmitHandler<ExtendedGrouping> = (data) => void mutate(data)

  useEffect(() => {
    const resultValues = uniq(subDepartments.map((_) => getDepartment(_))).map((_) => ({ id: _ }))
    setSelectableDepartments(resultValues)
  }, [subDepartments])

  useEffect(() => {
    let mounted = true

    const filterUnits = (grouping: ExtendedGrouping | undefined) => {
      const unitIDsFromGroupings = getUnitIDs(listGrouping ?? [])
      const filteredUnits = listUnits?.items?.filter((_) => !unitIDsFromGroupings.includes(_.id))

      const nextSelectableUnits = grouping
        ? filteredUnits?.concat((grouping?.units ?? []) as (ExtendedUnit & WithID)[])
        : filteredUnits
      setSelectableUnits(nextSelectableUnits)
    }

    if (mounted && listGrouping && listUnits) filterUnits(groupingData)

    return () => {
      mounted = false
    }
  }, [groupingData, listGrouping, listUnits])

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Grid container item justifyContent='flex-end'>
        <Typography variant='body1' color='inherit'>
          {t('groupingsSection.mandatoryInfo')}
        </Typography>
      </Grid>
      <Grid container item direction='column' style={{ height: '30rem' }}>
        <InputForm
          id='input-grouping-name'
          title={`${t('groupingsSection.groupingName')}*`}
          type='text'
          error={!!errors.name}
          errorMessage={t('groupingsSection.genericFillInputMessage')}
          placeholder={t('groupingsSection.groupingNamePlaceholder')}
          marginTop='2rem'
          {...register('name')}
        />
        <Grid item style={{ width: '100%' }}>
          <SelectForm
            id={`${selectorSelectUnits}`}
            name='selectedUnits'
            title={`${t('groupingsSection.selectUnits')}*`}
            error={!!errors.selectedUnits}
            errorMessage={t('groupingsSection.genericFillInputMessage')}
            value={selectedUnits?.map((_) => _.shortName ?? EMPTY_STRING) ?? []}
            placeholder={t('groupingsSection.selectorPlaceholder')}
            selectFormStyle={{ marginTop: '1rem' }}
            popupDisplayWidth='100%'
          >
            <UnitList
              name='selectedUnits'
              data={selectableUnits}
              values={selectedUnits ?? []}
              onClickItem={(_, values) => setValue('selectedUnits', values)}
              getValue={(_) => _}
            />
          </SelectForm>
          <SelectForm
            id='select-department'
            name='selectedSubDepartments'
            title={t('groupingsSection.allowedAccess')}
            error={!!errors.selectedSubDepartments}
            errorMessage={t('groupingsSection.genericFillInputMessage')}
            value={selectedSubdepartments ?? []}
            placeholder={t('groupingsSection.selectorPlaceholder')}
            popupDisplayWidth='100%'
            selectFormStyle={{ marginTop: '1rem' }}
          >
            <SubDeparmentList
              departments={selectableDepartments}
              values={selectedSubdepartments ?? []}
              onClickItem={(_, values) => setValue('selectedSubDepartments', values)}
              name='selectedSubDepartments'
            />
          </SelectForm>
        </Grid>
      </Grid>
      <GroupUILayout>
        <GroupUIDiscardButton id='grouping-usetemplate-dialog-discard' onClick={onClose}>
          {t('buttons.discard')}
        </GroupUIDiscardButton>
        <GroupUISubmitButton
          id='grouping-usetemplate-dialog-submit'
          icon={!isPending ? 'save-24' : 'icon-empty-24'}
          size='m'
          isLoading={isPending}
        >
          {t('buttons.save')}
        </GroupUISubmitButton>
      </GroupUILayout>
    </form>
  )
}

export default GroupingDialog

import { useTranslation } from 'react-i18next'
import { Button, Divider, Grid } from '@mui/material'
import CheckboxListForm from 'components/Dialogs/RejectedDialog/CheckboxListForm'
import { colors } from 'theme'
import { Group, Option } from './ReportFilter'
import { MeasureTranslationKeys } from './ReportMeasures'

interface ReportFilterOptionsProps {
  group: string
  input: string
  selectedOptions: Option[]
  options: Option[]
  showMore: boolean
  onClickOption: (item: Option) => void
  onClickShowMore: () => void
}

const ReportFilterOptions = ({
  group,
  selectedOptions,
  options,
  showMore,
  input,
  onClickOption,
  onClickShowMore
}: ReportFilterOptionsProps) => {
  const { t } = useTranslation(['measures', 'landing'])

  const filteredOptions = options.filter((option) =>
    t(`measures:filter.${option.value.toLowerCase() as MeasureTranslationKeys}`)
      .toLowerCase()
      .includes(input.toLowerCase())
  )
  const optionsByGroup = filteredOptions.filter((_) => _.group === group)

  switch (group) {
    case Group.Critical:
    case Group.Status:
      return (
        <>
          <CheckboxListForm
            id={`${group}-checkbox`}
            items={optionsByGroup}
            checked={selectedOptions.map((_) => _.id)}
            onClickToggle={onClickOption}
            translateText
          />
          <Divider style={{ backgroundColor: colors.gray4 }} />
        </>
      )
    case Group.Assignee:
      return (
        <>
          <CheckboxListForm
            id={group}
            items={showMore ? optionsByGroup : optionsByGroup.slice(0, 3)}
            checked={selectedOptions.map((_) => _.id)}
            onClickToggle={onClickOption}
          />

          {input.length === 0 ? (
            <Grid container paddingLeft='8px'>
              <Button variant='text' onClick={onClickShowMore} style={{ fontWeight: 'normal' }}>
                {showMore ? t('landing:changelog.showLess') : t('landing:changelog.showMore')}
              </Button>
            </Grid>
          ) : undefined}
        </>
      )

    default:
      return <></>
  }
}

export default ReportFilterOptions

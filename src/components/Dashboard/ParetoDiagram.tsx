import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import { BarHandlers, BarTooltipProps } from '@nivo/bar'
import { DisruptionClassification } from 'APIcustom'
import { equals } from 'remeda'
import { ParetoBarDatum } from 'types'
import { SelectEnumFilter } from './Filter/SelectEnumFilter'
import { SelectObjectFilter } from './Filter/SelectObjectFilter'
import { SelectStringFilter } from './Filter/SelectStringFilter'
import { Shift } from 'API'
import BarChart, { BarChartTooltip, ChartContainer, FromIndex } from 'components/Charts/BarChart'
import { CHART_LABEL_SPEC } from 'components/Charts/constants'
import LoadingContainer from 'components/Charts/LoadingContainer'
import DashboardDisruptionList from 'components/Dashboard/DashboardDisruptionList'
import { useStorePareto } from 'contexts/paretoStore'
import { ALL_OPTION_DASHBOARDS } from 'helper/constants'
import { defaultOptions } from 'helper/templateCategories'
import { trim } from 'helper/utils'
import useQueryDashboardDisruptions from 'hooks/services/useQueryDashboardDisruptions'
import useQueryListDisruptionsClassification from 'hooks/services/useQueryListDisruptionsClassification'
import useQueryListUnits from 'hooks/services/useQueryListUnits'
import useMediaQuery from 'hooks/useMediaQuery'
import DatePicker from 'lib/form/DatePicker'
import { OTHER_DISRUPTIONS_TEMPLATE_ID } from 'shared'
import { colors } from 'theme'

export enum ParetoKey {
  Frequency = 'frequency',
  Duration = 'totalDurationInMinutes'
}

type ParetoBarIndex = Pick<
  ParetoBarDatum,
  'templateId' | 'frequency' | 'totalDurationInMinutes' | 'classifications' | 'id'
>

const sortParetoByKey = (data: ParetoBarDatum[], sortKey: ParetoKey) => {
  const sortedData = data.map((x) => x)
  return sortedData.sort((a, b) => (a[sortKey] > b[sortKey] ? -1 : 1))
}

interface ClassificationsReturn {
  categories: string[]
  descriptions: string[]
  types: string[]
}

const parseDisruptionClassifications = (items: DisruptionClassification[] | undefined): ClassificationsReturn => {
  const classificationItems = items?.flatMap((item) => item.classificationPath ?? []) ?? []
  const categories: string[] = []
  const descriptions: string[] = []
  const types: string[] = []

  // Loop database classifications
  for (const category of classificationItems) {
    categories.push(category.value)
    const categoryOptions = category.options ?? []
    for (const description of categoryOptions) {
      descriptions.push(description.value)
      const descriptionOptions = description.options ?? []
      for (const type of descriptionOptions) {
        types.push(type.value)
      }
    }
  }

  // Loop default classification of the app
  for (const category of defaultOptions) {
    categories.push(category.value)
    const categoryOptions = category.options ?? []
    for (const description of categoryOptions) {
      descriptions.push(description.value)
      const descriptionOptions = description.options ?? []
      for (const type of descriptionOptions) {
        types.push(type.value)
      }
    }
  }

  const categoriesSet = new Set(categories)
  const descriptionsSet = new Set(descriptions)
  const typesSet = new Set(types)
  if (items) {
    return {
      categories: [ALL_OPTION_DASHBOARDS.name, ...categoriesSet],
      descriptions: [ALL_OPTION_DASHBOARDS.name, ...descriptionsSet],
      types: [ALL_OPTION_DASHBOARDS.name, ...typesSet]
    }
  }
  return {
    categories: [],
    descriptions: [],
    types: []
  }
}

const tooltip: FC<BarTooltipProps<ParetoBarDatum>> = ({ id, value, color, data: { description } }) => {
  const { t } = useTranslation('dashboard')

  const detailsSectionUnit = id === ParetoKey.Duration ? 'min' : t('paretoFilter.occurrences')
  const detailsSectionTitle =
    id === ParetoKey.Duration ? t('paretoFilter.overallDuration') : t('paretoFilter.overallFrequency')

  return (
    <BarChartTooltip
      color={color}
      top={{ title: t('paretoFilter.disruption'), body: description }}
      bottom={{ title: detailsSectionTitle, body: `${value} ${detailsSectionUnit}` }}
    />
  )
}

const indexBy = ({ templateId, frequency, totalDurationInMinutes, classifications, id }: ParetoBarIndex) =>
  [templateId, frequency, totalDurationInMinutes, classifications, id].join('#')

const fromIndex = (value: string): FromIndex<ParetoBarIndex> => {
  const [templateId, frequency, totalDurationInMinutes, classifications, id] = value.split('#')
  return { templateId, frequency, totalDurationInMinutes, classifications, id }
}

const useAxisFormatter = (items: ParetoBarDatum[]) => {
  const [isDesktopWidth] = useMediaQuery('lg')

  return (value: string) => {
    // * 'value' is the index for each bar. It uses the format from 'indexBy'
    const { templateId, id } = fromIndex(value)

    const itemDescription =
      templateId === OTHER_DISRUPTIONS_TEMPLATE_ID
        ? items.find((_) => _.id === id)?.description || ''
        : items.find((_) => _.templateId === templateId)?.description || ''

    return trim(
      itemDescription,
      isDesktopWidth ? CHART_LABEL_SPEC.MAX_CHARS_DESKTOP : CHART_LABEL_SPEC.MAX_CHARS_MOBILE
    )
  }
}

const ParetoDiagram = () => {
  const { t } = useTranslation(['dashboard', 'iProcess'])
  const { data: listUnits, isSuccess: isSuccessUnits } = useQueryListUnits()
  const { data: listDisruptionClassification, isSuccess: isSuccessClassifications } =
    useQueryListDisruptionsClassification()
  const {
    data: paretoData,
    isLoading,
    isSuccess
  } = useQueryDashboardDisruptions(isSuccessUnits && isSuccessClassifications)

  const [selectedDisruption, setSelectedDisruption] = useState<ParetoBarDatum | undefined>()

  let sortedParetoDataByDuration: ParetoBarDatum[] = []
  let sortedParetoDataByFrequency: ParetoBarDatum[] = []
  const hasData = !!paretoData && paretoData.length > 0
  const numberOfDataBars = 5

  if (paretoData) {
    sortedParetoDataByDuration = sortParetoByKey(paretoData, ParetoKey.Duration).slice(0, numberOfDataBars)
    sortedParetoDataByFrequency = sortParetoByKey(paretoData, ParetoKey.Frequency).slice(0, numberOfDataBars)
  }

  const [filter, setFilter] = useStorePareto((store) => store)

  const { startDate, endDate, unitIds, disruptionCategories, disruptionDescriptions, disruptionTypes, shifts } = filter

  /* handlers */

  const handleChangeDatePicker = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    attribute: 'startDate' | 'endDate'
  ) => {
    const newDate = event.target.value
    if (newDate.length > 0) {
      setFilter({ [attribute]: newDate })
    }
  }

  const handleOnClick: BarHandlers<ParetoBarDatum, unknown>['onClick'] = (event) => {
    const data = event.data
    if (equals(data, selectedDisruption)) {
      return void setSelectedDisruption(undefined)
    }
    const selectedBar = sortedParetoDataByDuration.find((_) => equals(_, data))

    if (selectedBar) {
      setSelectedDisruption(selectedBar)
    }
  }

  const xAxisFormatterByDuration = useAxisFormatter(sortedParetoDataByDuration)
  const xAxisFormatterByFrequency = useAxisFormatter(sortedParetoDataByFrequency)

  /* memoized values */

  const unitOptions = useMemo(() => {
    if (listUnits?.items) {
      return [ALL_OPTION_DASHBOARDS, ...listUnits.items.map(({ id, shortName: name }) => ({ id, name }))]
    }
    return []
  }, [listUnits?.items])

  const shiftOptions = useMemo(() => {
    return [
      ALL_OPTION_DASHBOARDS,
      ...Object.values(Shift).map((shift) => ({
        name: t(`iProcess:header.${shift}`),
        id: shift
      }))
    ]
  }, [t])

  const classifications = useMemo(
    () => parseDisruptionClassifications(listDisruptionClassification?.items),
    [listDisruptionClassification?.items]
  )

  /* effects */

  useEffect(() => {
    setSelectedDisruption(undefined)
  }, [filter])

  useEffect(() => {
    if (shifts.length === 0) {
      setFilter({ shifts: Object.values(Shift) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftOptions])

  useEffect(() => {
    if (unitIds.length === 0) {
      const allUnitIds = unitOptions.map((_) => _.id)
      setFilter({ unitIds: allUnitIds })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(unitOptions)])

  useEffect(() => {
    if (listDisruptionClassification) {
      setFilter({
        disruptionCategories: disruptionCategories.length === 0 ? classifications.categories : disruptionCategories,
        disruptionDescriptions:
          disruptionDescriptions.length === 0 ? classifications.descriptions : disruptionDescriptions,
        disruptionTypes: disruptionTypes.length === 0 ? classifications.types : disruptionTypes
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classifications, listDisruptionClassification])

  return (
    <>
      <div style={{ paddingLeft: '1rem', paddingRight: '1rem', backgroundColor: colors.white }}>
        <Grid container alignItems='baseline' justifyContent='space-between' spacing={4}>
          <Grid item xs={2} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Typography variant='overline' noWrap={true} textOverflow='clip' style={{ lineHeight: 1.8 }}>
              {t('dashboard:paretoFilter.startDate')}
            </Typography>
            <DatePicker
              style={{ marginTop: '4px' }}
              value={startDate}
              inputProps={{ max: endDate }}
              onChange={(event) => handleChangeDatePicker(event, 'startDate')}
            />
          </Grid>

          <Grid item xs={2} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Typography variant='overline' noWrap={true} style={{ lineHeight: 1.8 }}>
              {t('dashboard:paretoFilter.endDate')}
            </Typography>
            <DatePicker
              style={{ marginTop: '4px' }}
              value={endDate}
              inputProps={{ min: startDate }}
              onChange={(event) => handleChangeDatePicker(event, 'endDate')}
            />
          </Grid>
          <Grid item xs={4}>
            {/* Filter: Shift */}
            <SelectEnumFilter value='shifts' data={shiftOptions} />
          </Grid>
          <Grid item xs={4}>
            {/* Filter: Unit */}
            <SelectObjectFilter storeKey='unitIds' data={unitOptions} />
          </Grid>
        </Grid>

        <Grid container alignItems='center' justifyContent='center' spacing={4}>
          <Grid item xs={4}>
            {/* Filter: Disruption Categories */}
            <SelectStringFilter value='disruptionCategories' data={classifications.categories} />
          </Grid>
          <Grid item xs={4}>
            {/* Filter: Disruption Descriptions */}
            <SelectStringFilter value='disruptionDescriptions' data={classifications.descriptions} />
          </Grid>
          <Grid item xs={4}>
            {/* Filter: Disruption Types */}
            <SelectStringFilter value='disruptionTypes' data={classifications.types} />
          </Grid>
        </Grid>
      </div>
      {
        <LoadingContainer
          isLoading={isLoading}
          isSuccess={isSuccess}
          hasData={hasData}
          noDataMessage={t('dashboard:paretoFilter.noDataMessage')}
        >
          <Grid container style={{ backgroundColor: colors.white }}>
            <ChartContainer item xs={12} lg={6} style={{ marginTop: '3rem', marginBottom: '1rem' }}>
              <BarChart
                data={sortedParetoDataByDuration}
                keys={[ParetoKey.Duration]}
                selectedItem={selectedDisruption}
                title={t('dashboard:paretoFilter.titleDuration')}
                yAxisTitle={t('dashboard:paretoFilter.overallDuration')}
                xAxisFormatter={xAxisFormatterByDuration}
                indexBy={indexBy}
                tooltip={tooltip}
                onClick={handleOnClick}
              />
            </ChartContainer>
            <ChartContainer item xs={12} lg={6} style={{ marginTop: '3rem', marginBottom: '1rem' }}>
              <BarChart
                data={sortedParetoDataByFrequency}
                keys={[ParetoKey.Frequency]}
                selectedItem={selectedDisruption}
                title={t('dashboard:paretoFilter.titleFrequency')}
                yAxisTitle={t('dashboard:paretoFilter.overallFrequency')}
                xAxisFormatter={xAxisFormatterByFrequency}
                indexBy={indexBy}
                tooltip={tooltip}
                onClick={handleOnClick}
              />
            </ChartContainer>
          </Grid>
        </LoadingContainer>
      }
      <DashboardDisruptionList paretoData={selectedDisruption ? [selectedDisruption] : paretoData ?? []} />
    </>
  )
}

export default ParetoDiagram

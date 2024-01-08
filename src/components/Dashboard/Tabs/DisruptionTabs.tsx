import { lazy, ReactNode, Suspense, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Active,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  Over,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material'
import { sortBy } from 'remeda'
import { isAssemblyLine, Template, TemplateBase, TemplateBaseWithOriginator } from 'types'
import { TemplateBaseSchema } from 'zodSchemas'
import { UnitType, VehicleNumberInput } from 'API'
import { useAuth } from 'contexts/authContext'
import createStore from 'contexts/createStore'
import { useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import useMutateMultipleTemplates from 'hooks/services/useMutateMultipleTemplates'
import useQueryListTemplatesFiltered from 'hooks/services/useQueryListTemplatesFiltered'
import useAllInfiniteData from 'hooks/useAllInfiniteData'
import { conditionallySortArray } from 'shared'
import { NonNullFields } from 'shared/types'
import { useStoreDisruptionTemplates } from '../DisruptionDashboard'
import MyTeamFilterGroup from './MyTeamFilterGroup'
import PreviousTeamsTemplateCardList from './PreviousTeamsTemplateCardList'
import TemplateCardList from './TemplateCardList'

const assemblyLineQuantitiesLoader = () => import('./Quantities/AssemblyLineQuantitiesTab')
const productionUnitQuantitiesLoader = () => import('./Quantities/ProductionUnitQuantitiesTab')
const reportedDisruptionsLoader = () => import('./ReportedDisruptions/ReportedDisruptionsTable')
const AssemblyLineReportedDisruptionsTableLoader = () =>
  import('./ReportedDisruptions/AssemblyLineReportedDisruptionsTable')
const ProductionUnitReportedDisruptionsTableLoader = () =>
  import('./ReportedDisruptions/ProductionUnitReportedDisruptionsTable')

const AssemblyLineQuantitiesTab = lazy(assemblyLineQuantitiesLoader)
const ProductionUnitQuantitiesTab = lazy(productionUnitQuantitiesLoader)
const AssemblyLineReportedDisruptionsTable = lazy(AssemblyLineReportedDisruptionsTableLoader)
const ProductionUnitReportedDisruptionsTable = lazy(ProductionUnitReportedDisruptionsTableLoader)

export type VehicleNumber = NonNullFields<VehicleNumberInput>

export interface QuantitiesStore {
  actualCount: number
  vehicleNumber: VehicleNumber
}

export interface DisruptionTemplatesStore {
  templates: TemplateBase[]
  previousTeamTemplates: TemplateBaseWithOriginator[]
  searchInput: string
  clickedOption: TemplateBase | undefined
}

const getInitialState = (): QuantitiesStore => ({
  actualCount: 0,
  vehicleNumber: {
    from: undefined,
    until: undefined
  }
})

// Context
const { Provider: QuantitiesProvider, useStore } = createStore<QuantitiesStore>({ initialState: getInitialState() })

export const useQuantitiesStore = useStore

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const findIndexes = (templates: Template[], active: Active, over: Over | null) => {
  return {
    oldIndex: templates.findIndex((template) => template.id === active.id),
    newIndex: templates.findIndex((template) => template.id === over?.id)
  }
}

const DisruptionTabs = () => {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation('iProcess')
  const { currentShiftTab, selectedShiftTab, unitSelected, selectedTeam } = useIProcessState()
  const { authInfo } = useAuth()
  const dispatch = useIProcessDispatch()

  const showOriginators = useMemo(
    () =>
      tab === 0 &&
      unitSelected?.type === UnitType.assemblyLine &&
      authInfo?.roles.includes('Manager') &&
      selectedTeam &&
      selectedTeam?.index > 1,
    [authInfo?.roles, selectedTeam, tab, unitSelected?.type]
  )

  const showTeamsFilter = unitSelected?.type === UnitType.assemblyLine

  const [{ templates, previousTeamTemplates }, setDisruptionStore] = useStoreDisruptionTemplates((store) => store)
  const { mutate: batchMutateTemplates } = useMutateMultipleTemplates()
  const { data, fetchNextPage, hasNextPage } = useQueryListTemplatesFiltered<TemplateBase>({
    reportedByTeam: selectedTeam?.id
  })
  const listTemplates = useAllInfiniteData({ fetchNextPage, hasNextPage, data })
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>()

  const distanceInPixels = 10 // The distance property represents the distance, in pixels, by which the pointer needs to be moved before a drag start event is emitted

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: distanceInPixels
      }
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: distanceInPixels
      }
    })
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id)
      dispatch({ type: 'isSorting', isSorting: true })
    },
    [dispatch]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      const isMyTeamTemplate = templates.some((_) => _.id === active.id)

      // Update only when drag ends over templates that are different
      if (active.id !== over?.id) {
        if (isMyTeamTemplate) {
          const { oldIndex, newIndex } = findIndexes(templates, active, over)
          const updatedTemplates = arrayMove(templates, oldIndex, newIndex)
          batchMutateTemplates(updatedTemplates)
          setDisruptionStore({ templates: updatedTemplates })
        } else {
          const { oldIndex, newIndex } = findIndexes(previousTeamTemplates, active, over)
          const updatedTemplates = arrayMove(previousTeamTemplates, oldIndex, newIndex)
          batchMutateTemplates(updatedTemplates)
          setDisruptionStore({ previousTeamTemplates: updatedTemplates })
        }
      }

      dispatch({ type: 'isSorting', isSorting: false })
      setActiveId(undefined)
    },
    [batchMutateTemplates, dispatch, setDisruptionStore, templates, previousTeamTemplates]
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(undefined)
    dispatch({ type: 'isSorting', isSorting: false })
  }, [dispatch])

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const onLoadQuantities = () => {
    if (isAssemblyLine(unitSelected)) {
      assemblyLineQuantitiesLoader()
    } else {
      productionUnitQuantitiesLoader()
    }
  }

  const onLoadReportedDisruptionsTab = () => {
    reportedDisruptionsLoader()
  }

  useEffect(() => {
    // it selects Reported Disruptions when past ShiftTabs are selected
    if (currentShiftTab !== selectedShiftTab) {
      setTab(1)

      // it selects Report Disruptions when current ShiftTab is selected
    } else {
      setTab(0)
    }
  }, [currentShiftTab, selectedShiftTab])

  useEffect(() => {
    if (listTemplates) {
      setDisruptionStore({
        templates: conditionallySortArray(TemplateBaseSchema, listTemplates, (_) =>
          sortBy(_, (_) => _.description.toLowerCase())
        )
      })
    }

    // First team is selected
    if (selectedTeam?.index === 1) {
      setDisruptionStore({
        previousTeamTemplates: []
      })
    }
  }, [listTemplates, selectedTeam?.index, setDisruptionStore])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ margin: '0 1rem' }}>
        <Tabs value={tab} onChange={handleChange}>
          {/* // * It selects   <TemplateCardList /> */}
          <Tab
            label={
              <Typography variant='h3' style={{ fontWeight: tab === 0 ? 'bold' : 'normal' }}>
                {t('disruptionList.headingDisruption')}
              </Typography>
            }
            id='report-disruption-switch'
          />
          {/* // * It selects   <DisruptionsReportedTable /> */}
          <Tab
            onMouseEnter={onLoadReportedDisruptionsTab}
            onFocus={onLoadReportedDisruptionsTab}
            onTouchStart={onLoadReportedDisruptionsTab}
            label={
              <Typography variant='h3' style={{ fontWeight: tab === 1 ? 'bold' : 'normal' }}>
                {t('disruptionList.headingReview')}
              </Typography>
            }
            id='disruptionListReviewSwitch'
          />
          {/* // * It selects   <Quantities /> */}
          <Tab
            onMouseEnter={onLoadQuantities}
            onFocus={onLoadQuantities}
            onTouchStart={onLoadQuantities}
            label={
              <Typography variant='h3' style={{ fontWeight: tab === 2 ? 'bold' : 'normal' }}>
                {t('quantitiesCard.quantitiesHeader')}
              </Typography>
            }
            id='quantities-switch'
          />
        </Tabs>
        <Divider style={{ marginBottom: '1.5rem' }} />
      </Box>
      <TabPanel value={tab} index={0}>
        <MyTeamFilterGroup showTooltipButton showTeamsFilter={showTeamsFilter} showSearchDisruptionsFilter />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <TemplateCardList activeId={activeId} />
        </DndContext>
        {showOriginators && (
          <>
            <Divider variant='middle' style={{ marginBottom: '1.5rem', marginTop: '0.75rem' }} />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <PreviousTeamsTemplateCardList currentTab={tab} activeId={activeId} />
            </DndContext>
          </>
        )}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Suspense>
          {isAssemblyLine(unitSelected) ? (
            <AssemblyLineReportedDisruptionsTable />
          ) : (
            <ProductionUnitReportedDisruptionsTable />
          )}
        </Suspense>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Suspense>
          <QuantitiesProvider>
            {isAssemblyLine(unitSelected) ? <AssemblyLineQuantitiesTab /> : <ProductionUnitQuantitiesTab />}
          </QuantitiesProvider>
        </Suspense>
      </TabPanel>
    </Box>
  )
}

export default DisruptionTabs

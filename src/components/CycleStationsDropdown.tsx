import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { Grid, IconButton, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { QUERY_PARAMS } from 'routes/routing'
import { CycleStation } from 'types'
import FilterIcon from 'components/Icons/FilterIcon'
import WarningIcon from 'components/Icons/warning.svg'
import WarningFilledIcon from 'components/Icons/warning-filled.svg'
import useCycleStations from 'hooks/useCycleStations'
import DropDownAutocomplete, { DropDownOption } from 'lib/form/DropDownAutocomplete'
import { GetOptionLabel } from 'lib/form/types'
import { ALL_CYCLE_STATIONS, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { useIProcessDispatch, useIProcessState } from '../contexts/iProcessContext'
import { colors } from '../theme'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => {
  return <Tooltip {...props} classes={{ popper: className }} />
})(({ theme }) => ({
  tooltip: {
    margin: 0
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: colors.white,
    '&::before': {
      backgroundColor: colors.white,
      boxShadow: theme.shadows[1]
    }
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: colors.white,
    maxWidth: 175,
    color: colors.black,
    boxShadow: theme.shadows[1],
    fontSize: '14px'
  }
}))

export interface CycleStationsDropdownProps {
  showTooltipButton?: boolean
  showTeamsFilter?: boolean
  showSearchDisruptionsFilter?: boolean
}

export const CycleStationsDropdown = ({ showTooltipButton = false }: CycleStationsDropdownProps) => {
  const { t } = useTranslation('iProcess')

  const [params, setParams] = useSearchParams()
  const cycleStationId = params.get(QUERY_PARAMS.cycleStationId)

  const { unitSelected, cycleStationSelected, selectedTeam } = useIProcessState()

  const cycleStations = useCycleStations(selectedTeam?.id)
  const allCycleStationsClone = useMemo(
    () => ({ ...ALL_CYCLE_STATIONS, name: t('disruptionReview.allDisruptions') }),
    [t]
  )

  const cycleStationOptions = useMemo(
    () => [allCycleStationsClone, ...cycleStations],
    [allCycleStationsClone, cycleStations]
  )

  const dispatch = useIProcessDispatch()

  const [showCyleStation, setShowCycleStation] = useState<boolean>(false)
  const [showTooltip, setShowshowTooltip] = useState<boolean>(false)

  const onDispatchCycleStation = useCallback(
    (id: string) => {
      const cycleStationSelected = cycleStationOptions.find((_) => _.id === id)
      dispatch({
        type: 'cycleStationSelected',
        cycleStationSelected: cycleStationSelected || allCycleStationsClone
      })
      return cycleStationSelected
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cycleStations, params]
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cycleStationSelected = onDispatchCycleStation(event.target.value)
    if (cycleStationSelected?.id) {
      params.set(QUERY_PARAMS.cycleStationId, cycleStationSelected?.id)
    } else {
      params.delete(QUERY_PARAMS.cycleStationId)
    }
    setParams(params)
    setShowCycleStation(!showCyleStation)
  }

  const handleLabel: GetOptionLabel<CycleStation> = (cycleStation) => {
    if (typeof cycleStation !== 'string') {
      return cycleStation.name
    }
    return cycleStation
  }

  useEffect(() => {
    if (cycleStationSelected?.id === allCycleStationsClone.id) {
      dispatch({
        type: 'cycleStationSelected',
        cycleStationSelected: allCycleStationsClone
      })
    }
    if (cycleStationSelected?.id === UNIT_SPECIFIC_CYCLE_STATION.id) {
      dispatch({
        type: 'cycleStationSelected',
        cycleStationSelected: {
          ...UNIT_SPECIFIC_CYCLE_STATION,
          name: t('disruptionDialog.defaultCycleStationName')
        }
      })
    }
  }, [allCycleStationsClone, cycleStationSelected?.id, dispatch, t])

  useEffect(() => {
    if (!!cycleStationId && cycleStationSelected?.id !== cycleStationId) {
      const selectedCyclestation = onDispatchCycleStation(cycleStationId)
      if (!selectedCyclestation) {
        params.delete(QUERY_PARAMS.cycleStationId)
        setParams(params)
      }
    }
  }, [cycleStationId, cycleStationSelected?.id, onDispatchCycleStation, params, setParams])

  return (
    <Grid container display='flex' alignItems='center'>
      <DropDownAutocomplete
        options={cycleStationOptions}
        name='cycleStations'
        placeholder={t('disruptionReview.placeholder')}
        icon={<FilterIcon width={24} height={24} />}
        selectedName={cycleStationSelected?.name}
        getOptionLabel={handleLabel}
        renderOption={(props, cycleStation) => (
          <DropDownOption
            type='radio'
            key={cycleStation.index}
            label={cycleStation.index === 0 ? `${cycleStation.name} (${unitSelected?.shortName})` : cycleStation.name}
            checked={
              cycleStationSelected?.id === cycleStation.id ||
              (cycleStation.index === -1 && cycleStationSelected === undefined) // Handle when All disruptions is checked
            }
            value={cycleStation.id}
            onChange={handleChange}
            showDivider={cycleStations && cycleStation.index === 0 && cycleStations.length > 1}
            listProps={props}
          />
        )}
      />
      {showTooltipButton && (
        <ClickAwayListener onClickAway={() => setShowshowTooltip(false)}>
          <div>
            <LightTooltip
              title={t('disruptionReview.informationMessage')}
              open={showTooltip}
              placement='right'
              arrow
              disableHoverListener
            >
              <IconButton onClick={() => setShowshowTooltip(!showTooltip)}>
                <img
                  width={26}
                  height={26}
                  src={showTooltip ? WarningFilledIcon : WarningIcon}
                  loading='lazy'
                  style={showTooltip ? {} : { transform: 'rotate(180deg)' }}
                />
              </IconButton>
            </LightTooltip>
          </div>
        </ClickAwayListener>
      )}
    </Grid>
  )
}

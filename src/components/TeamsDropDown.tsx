import { ChangeEvent, MouseEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { PersonOutlineOutlined } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { List, ListItemButton, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import { QUERY_PARAMS } from 'routes/routing'
import { Team } from 'types'
import SendIcon from './Icons/SendIcon'
import { useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import useRouterParams from 'hooks/useRouterParams'
import DropDownAutocomplete, { DropDownOption } from 'lib/form/DropDownAutocomplete'
import { GetOptionLabel } from 'lib/form/types'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { colors } from 'theme'

interface SimpleTeamsDropDownProps {
  teams: Team[]
  selectedTeam: Team | undefined
  onClickTeam: (_: Team | undefined) => void
}

const SimpleTeamsDropDown = ({ teams, selectedTeam, onClickTeam }: SimpleTeamsDropDownProps) => {
  const [anchorElement, setAnchorElement] = useState<undefined | HTMLElement>(undefined)

  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleTeamClick = (_: MouseEvent<HTMLElement>, team: Team) => {
    onClickTeam(team)

    setAnchorElement(undefined)
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  return (
    <div>
      <List component='nav' aria-label='Select Team' style={{ padding: '0', margin: '0', marginLeft: '20px' }}>
        <ListItemButton
          id='team-dropdown'
          data-testid='team-dropdown'
          aria-haspopup='true'
          aria-controls='team-menu'
          onClick={handleClickListItem}
          style={{ padding: '0', margin: '0' }}
          component='div'
        >
          <PersonOutlineOutlined color={'primary'} style={{ marginRight: '8px' }} />
          <ListItemText
            disableTypography
            primary={
              <Typography variant='h3' component={'span'}>
                {selectedTeam?.name}
              </Typography>
            }
            style={{ padding: '0', margin: '0' }}
          />
          <ExpandMoreIcon color='primary' style={{ marginLeft: '8px', fontSize: '30px' }} />
        </ListItemButton>
      </List>
      <Menu id='team-menu' anchorEl={anchorElement} keepMounted open={Boolean(anchorElement)} onClose={handleClose}>
        {teams.map((team) => (
          <MenuItem
            id={'team-option-' + team.id}
            key={team.id}
            selected={team.index === selectedTeam?.index}
            onClick={(event) => handleTeamClick(event, team)}
            style={{
              marginLeft: '8px',
              marginRight: '8px',
              backgroundColor: team.index === selectedTeam?.index ? colors.bluegray : ''
            }}
          >
            {team.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

interface TeamsDropDownAutocompleteProps extends SimpleTeamsDropDownProps {}

const TeamsDropDownAutocomplete = ({ teams, selectedTeam, onClickTeam }: TeamsDropDownAutocompleteProps) => {
  const [params, setParams] = useSearchParams()
  const onSelectTeam = useCallback((teamId: string) => teams.find((_) => _.id === teamId), [teams])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const team = onSelectTeam(event.target.value)
    onClickTeam(team)
    params.delete(QUERY_PARAMS.previousTeams)
    setParams(params)
  }

  const handleLabel: GetOptionLabel<Team> = (team) => {
    if (typeof team === 'object') {
      return team.name
    }
    return team
  }

  return (
    <DropDownAutocomplete
      options={teams}
      name='teams'
      icon={<SendIcon style={{ transform: 'rotate(45deg)' }} />}
      selectedName={selectedTeam?.name}
      getOptionLabel={handleLabel}
      renderOption={(props, { id, name, index }) => (
        <DropDownOption
          type='radio'
          key={id}
          label={name}
          checked={selectedTeam?.id === id}
          value={id}
          onChange={handleChange}
          showDivider={teams && index === 0 && teams.length > 1}
          listProps={props}
        />
      )}
    />
  )
}
export interface TeamsDropDownProps {
  teams: Team[]
  isFilter?: boolean
}

export const TeamsDropDown = ({ teams, isFilter = false }: TeamsDropDownProps) => {
  const { selectedTeam, cycleStationSelected } = useIProcessState()
  const dispatch = useIProcessDispatch()
  const setAction = useRouterParams()
  const { t } = useTranslation()

  const onClickTeam = useCallback(
    (team?: Team) => {
      dispatch({ type: 'selectedTeam', selectedTeam: team })
      if (cycleStationSelected?.id) {
        dispatch({
          type: 'cycleStationSelected',
          cycleStationSelected: { ...UNIT_SPECIFIC_CYCLE_STATION, name: t('disruptionDialog.defaultCycleStationName') }
        })
      }
      setAction([
        {
          parameter: 'teamId',
          value: team?.id,
          action: 'set'
        },
        {
          parameter: 'cycleStationId',
          value: UNIT_SPECIFIC_CYCLE_STATION.id,
          action: 'set'
        }
      ])
    },
    [dispatch, setAction, t, cycleStationSelected?.id]
  )

  return isFilter ? (
    <TeamsDropDownAutocomplete teams={teams} selectedTeam={selectedTeam} onClickTeam={onClickTeam} />
  ) : (
    <SimpleTeamsDropDown teams={teams} selectedTeam={selectedTeam} onClickTeam={onClickTeam} />
  )
}

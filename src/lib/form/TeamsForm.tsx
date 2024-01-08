import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { IUnitState } from 'zodSchemas'
import { MINIMUM_CYCLESTATION_ERROR } from 'helper/constants'
import { AddButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import CycleStationsForm from './CycleStationsForm'
import NavigationInputForm from './NavigationInputForm'

interface Props {
  unitId: string | undefined
}

const TeamsForm = ({ unitId }: Props) => {
  const { t } = useTranslation('admin')
  const [teamIndex, setTeamIndex] = useState(0)
  const {
    formState: { errors },
    control,
    register,
    trigger,
    getValues
  } = useFormContext<IUnitState>()

  const {
    fields: teams,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'teams'
  })
  const handleAddTeam = () => {
    const nextIndex = teams?.length + 1
    const newTeam: IUnitState['teams'][0] = {
      id: uuid(),
      name: '',
      unitId: unitId ?? '',
      index: nextIndex,
      cycleStations: []
    }
    append(newTeam, { shouldFocus: true })
    if (teamIndex < 0) setTeamIndex(0)
  }

  const handleRemove = (index: number) => {
    remove(index)
    setTeamIndex(index - 1)
  }

  return (
    <Grid container>
      <Grid container item xs={4}>
        <Box style={{ flex: 1 }}>
          <Grid item xs={12} style={{ marginTop: '1rem' }}>
            <Typography variant='overline'>{t('unitsSection.team')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='subtitle1'>{t('unitsSection.name')}</Typography>
          </Grid>
          {getValues('teams').map((team, index) => (
            <Grid container item xs={12} key={team.id} style={{ marginTop: index !== 0 ? '0.5rem' : undefined }}>
              <Grid item xs={10}>
                <Stack>
                  <NavigationInputForm
                    {...register(`teams.${index}.name`)}
                    onFocus={() => setTeamIndex(index)}
                    error={!!errors.teams?.[index]?.name}
                    hasAdornment={team.cycleStations.length > 0}
                    isSelected={index === teamIndex}
                    onClickAdornment={() => setTeamIndex(index)}
                  />
                  {!!errors.teams?.[index]?.name &&
                    (errors.teams?.[index]?.name?.message === MINIMUM_CYCLESTATION_ERROR ? (
                      <Typography variant='caption' style={{ color: colors.redError, fontSize: 12 }}>
                        {t('unitsSection.minimumCycleStationPerTeam')}
                      </Typography>
                    ) : (
                      <Typography variant='caption' style={{ color: colors.redError, fontSize: 12 }}>
                        {t('unitsSection.emptyFieldValidation')}
                      </Typography>
                    ))}
                </Stack>
              </Grid>
              <Grid item xs={2}>
                {index > 0 && (
                  <IconButton id={`delete-team-${index}`} size='medium' onClick={() => handleRemove(index)}>
                    <DeleteIcon style={{ color: colors.blue }} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} style={{ paddingLeft: 2 }}>
            <AddButton
              onClick={handleAddTeam}
              text={t('unitsSection.addTeamTitle')}
              id='add-new-team'
              style={{ margin: '1rem 0' }}
            />
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={1} display='flex' justifyContent='center' style={{ padding: '1rem 0' }}>
        <Divider orientation='vertical' />
      </Grid>
      <Grid item xs={7} style={{ paddingLeft: '1rem' }}>
        {teamIndex >= 0 && (
          <CycleStationsForm
            unitId={unitId}
            name={`teams.${teamIndex}.cycleStations`}
            error={(index) => ({
              isError: !!errors.teams?.[teamIndex]?.cycleStations?.[index]?.name,
              message: errors.teams?.[teamIndex]?.cycleStations?.[index]?.name?.message
            })}
            onAddItem={() => trigger(`teams.${teamIndex}.name`)}
          />
        )}
      </Grid>
    </Grid>
  )
}

export default TeamsForm

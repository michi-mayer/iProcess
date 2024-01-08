// MUI
import { Fragment } from 'react'
// Types
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
// Hooks
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { IUnitState } from 'zodSchemas'
import { DUPLICATED_VALUE } from 'helper/constants'
import SwitchToggle from 'lib/form/SwitchToggle'
import { AddButton } from 'lib/ui/Buttons'
import DragAndDrop from 'lib/ui/DragAndDrop'
import { colors } from 'theme'
import type { Direction } from './DraggableInputForm'
import DraggableInputForm, { moveItemTo } from './DraggableInputForm'

interface Props {
  unitId: string | undefined
  name: 'cycleStations' | `teams.${number}.cycleStations`
  error: (index: number) => { isError: boolean; message: string | undefined } | undefined
  onAddItem?: () => void
}

const CycleStationsForm = ({ unitId, name, error, onAddItem }: Props) => {
  const { t } = useTranslation('admin')

  const { trigger, control, register, getValues } = useFormContext<IUnitState>()
  const {
    fields: cycleStations,
    append,
    remove,
    move,
    replace
  } = useFieldArray({
    control,
    name
  })

  const handleAddCycleStation = () => {
    const nextIndex = cycleStations?.length + 1
    const newCycleStation = {
      id: uuid(),
      name: '',
      isActive: true,
      unitId: unitId ?? '',
      index: nextIndex
    }
    append(newCycleStation, { shouldFocus: true })
    onAddItem?.()
  }

  const handleMove = (direction: Direction, fromIndex: number) => {
    const toIndex = moveItemTo(direction, cycleStations || [])
    move(fromIndex, toIndex)
    trigger(name)
  }

  return (
    <DragAndDrop>
      {(dragConstraints) => (
        <>
          <Typography variant='overline' style={{ marginTop: '1rem' }}>
            {t('unitsSection.cycleStations')}
          </Typography>
          {cycleStations && cycleStations?.length > 0 && (
            <DragAndDrop.Group axis='y' values={getValues(name)} onReorder={replace}>
              {getValues(name)?.map((cycleStation, index) => {
                return (
                  <Fragment key={cycleStation.id}>
                    {index === 0 && (
                      <Typography variant='subtitle1' style={{ paddingLeft: '40px' }}>
                        {t('unitsSection.name')}
                      </Typography>
                    )}
                    <DragAndDrop.Item key={cycleStation.id} item={cycleStation} dragConstraints={dragConstraints}>
                      {(dragControls, boxShadow, iRef) => (
                        <>
                          <DraggableInputForm
                            iconRef={iRef}
                            boxShadow={boxShadow}
                            moveTopText={t('unitsSection.moveUp')}
                            moveBottomText={t('unitsSection.moveDown')}
                            dragControls={dragControls}
                            index={index}
                            onDelete={remove}
                            {...register(`${name}.${index}.name`)}
                            onClickMove={handleMove}
                            error={error(index)?.isError}
                            placeholder={t('unitsSection.cycleStationPlaceholder')}
                            id={`cycleStations-name-${index}`}
                            MiddleComponent={
                              <Controller
                                name={`${name}.${index}.isActive`}
                                control={control}
                                defaultValue={true}
                                render={({ field }) => (
                                  <SwitchToggle
                                    {...field}
                                    checked={field.value}
                                    id={`cycleStations-toggle-${index}`}
                                    text={t('unitsSection.isActive')}
                                  />
                                )}
                              />
                            }
                            containerStyle={{ marginTop: index !== 0 ? '0.5rem' : undefined }}
                          />
                          {error(index)?.isError && (
                            <Typography
                              variant='caption'
                              style={{ color: colors.redError, fontSize: 12 }}
                              id={`cycleStations-${index}-name-errorMessage`}
                            >
                              {error(index)?.message === DUPLICATED_VALUE
                                ? t('unitsSection.duplicatedValue')
                                : t('unitsSection.emptyFieldValidation')}
                            </Typography>
                          )}
                        </>
                      )}
                    </DragAndDrop.Item>
                  </Fragment>
                )
              })}
            </DragAndDrop.Group>
          )}

          <Grid item xs={12} style={{ paddingLeft: 2 }}>
            <AddButton
              onClick={handleAddCycleStation}
              text={t('unitsSection.addCycleStationsTitle')}
              id='add-new-cycleStation'
              style={{ margin: cycleStations && cycleStations?.length > 0 ? '1rem 0' : '0 0 1rem 0' }}
            />
          </Grid>
        </>
      )}
    </DragAndDrop>
  )
}

export default CycleStationsForm

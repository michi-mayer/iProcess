import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import moment from 'moment-timezone'
import { Disruption } from 'types'
import DashboardContainer from './Dashboard/DashboardContainer'
import { OnAddDisruptionSubscription, OnAddDisruptionSubscriptionVariables } from 'API'
import { onAddDisruption } from 'graphql/subscriptions'
import useSubscription from 'hooks/services/useSubscription'
import useAllInfiniteData from 'hooks/useAllInfiniteData'
import useCycleStations from 'hooks/useCycleStations'
import { useIProcessState } from '../contexts/iProcessContext'
import useQueryDisruptionsByDay from '../hooks/services/useQueryDisruptionsByDay'
import useQueryGetPartsByUnit from '../hooks/services/useQueryGetPartsByUnit'
import TableSkeleton from '../lib/animation/TableSkeleton'

const GridStyled = styled(Grid)({
  padding: '24px',
  height: '100%'
})

const DailyOverview = () => {
  const { t } = useTranslation('iProcess')
  const cycleStations = useCycleStations()

  const { data, hasNextPage, fetchNextPage, isPending, isSuccess } = useQueryDisruptionsByDay()

  const disruptionsByDay = useAllInfiniteData<Disruption>({
    fetchNextPage,
    hasNextPage,
    data
  })

  const queryClient = useQueryClient()
  const { unitSelected } = useIProcessState()

  const forwardCallbackUpdate = useCallback(
    ({ onAddDisruption }: OnAddDisruptionSubscription) => {
      if (onAddDisruption) {
        queryClient.invalidateQueries({
          queryKey: [
            'FetchDisruptionsByDay',
            {
              unitId: unitSelected?.id
            }
          ]
        })
      }
    },
    [queryClient, unitSelected?.id]
  )

  const getSubscriptionVariables = useCallback((): OnAddDisruptionSubscriptionVariables | undefined => {
    if (unitSelected?.id) {
      return { unitId: unitSelected.id }
    }
  }, [unitSelected?.id])

  useSubscription(onAddDisruption, forwardCallbackUpdate, getSubscriptionVariables())

  const { data: partList } = useQueryGetPartsByUnit()

  const [partMap, setPartMap] = useState(new Map<string, string>())

  useEffect(() => {
    if (partList) {
      partMap.clear()
      for (const part of partList) {
        if (part.id && part.partNumber && !partMap.has(part.id)) {
          partMap.set(part.id, part.partNumber)
        }
      }
      setPartMap(partMap)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partList])

  return (
    <DashboardContainer style={{ marginTop: '16px', minHeight: `calc(100vh - 5rem` }}>
      <GridStyled container id='dailyOverview'>
        <Grid item xs={12} marginBottom='16px'>
          <Typography variant='h2'>{t('dailyOverview.disruptionsInLast24')}</Typography>
        </Grid>
        <Grid item xs={12} style={{ height: '96%' }}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table aria-label='review-table' size='medium' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('dailyOverview.disruptionsReportedTableHeaderDescription')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('dailyOverview.disruptionsReportedTableHeaderMeasure')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('dailyOverview.disruptionsReportedTableHeaderProduct')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('disruptionReview.cycleStation')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('dailyOverview.disruptionsReportedTableHeaderDate')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('dailyOverview.disruptionsReportedTableHeaderEndDateTime')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('dailyOverview.disruptionsReportedTableHeaderDuration')}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography variant='h3'>{t('disruptionReview.quantityLoss')}</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isPending && <TableSkeleton columns={3} rows={8} />}
                {isSuccess &&
                  disruptionsByDay?.map((disruption, index) => (
                    <TableRow key={disruption?.id}>
                      <TableCell align='left' id={`24h-disruption-description-${index}`}>
                        <Typography variant='body2'>{disruption?.description}</Typography>
                      </TableCell>
                      <TableCell align='left' id={`24h-disruption-measure-${index}`}>
                        <Typography variant='body2'>{disruption?.measures}</Typography>
                      </TableCell>
                      <TableCell align='left' id={`24h-disruption-product-${index}`}>
                        <Typography variant='body2'>
                          {disruption?.partId && (partMap.get(disruption?.partId) || '')}
                        </Typography>
                      </TableCell>

                      <TableCell align='left' id={`24h-disruption-cycleStation-${index}`}>
                        <Typography variant='body2'>
                          {cycleStations.find((cycleStation) => disruption?.cycleStationId === cycleStation.id)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell align='left' id={`24h-disruption-date-${index}`}>
                        <Typography variant='body2'>{`${moment(disruption?.endTimeDate).format(
                          'DD-MM-YYYY'
                        )}`}</Typography>
                      </TableCell>
                      <TableCell align='left'>
                        <Typography
                          id={`disruption-daily-period-${disruption?.description}`}
                          variant='body2'
                        >{`${moment(disruption?.startTimeDate).format('HH:mm')} - ${moment(
                          disruption?.endTimeDate
                        ).format('HH:mm')}`}</Typography>
                      </TableCell>
                      <TableCell align='left' id={`24h-disruption-duration-${index}`}>
                        <Typography variant='body2'>{disruption?.duration?.toString()}</Typography>
                      </TableCell>
                      <TableCell align='left' id={`24h-disruption-lostVehicles-${index}`}>
                        <Typography variant='body2'>{disruption?.lostVehicles}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </GridStyled>
    </DashboardContainer>
  )
}

export default DailyOverview

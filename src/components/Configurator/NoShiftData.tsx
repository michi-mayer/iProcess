import { useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import DashboardContainer from 'components/Dashboard/DashboardContainer'
import { useIProcessDispatch } from 'contexts/iProcessContext'
import { colors } from 'theme'

interface Props {
  message: string
  id?: string
}

const NoShiftData = ({ message, id }: Props) => {
  const dispatch = useIProcessDispatch()

  useEffect(() => {
    let mounted = true

    if (mounted) {
      dispatch({ type: 'productSelected', productSelected: {} })
      dispatch({ type: 'shiftModelSelected', shiftModelSelected: undefined })
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DashboardContainer id={id}>
      <Grid container height={160} style={{ backgroundColor: colors.gray4 }} direction='row'>
        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='h1'>{message}</Typography>
        </Grid>
      </Grid>
    </DashboardContainer>
  )
}

export default NoShiftData

import type { PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { match } from 'ts-pattern'
import { colors } from 'theme'

interface LoadingContainerProps {
  isLoading: boolean
  isSuccess: boolean
  hasData: boolean
  noDataMessage: string
  showWhiteBackground?: boolean
}

export const ChartFlexContainer = styled('div')({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '1000'
})

const NoDataMessage = ({ noDataMessage }: { noDataMessage: string }) => (
  <Typography variant='body1' textAlign='center' height='100%'>
    {noDataMessage}
  </Typography>
)

const LoadingContainer = ({
  children,
  isLoading,
  isSuccess,
  hasData,
  showWhiteBackground,
  noDataMessage
}: PropsWithChildren<LoadingContainerProps>) =>
  match({ isLoading, isSuccess, hasData, showWhiteBackground })
    .with({ isLoading: true }, () => (
      <ChartFlexContainer>
        <CircularProgress color='primary' size={50} thickness={1} variant='indeterminate' />
      </ChartFlexContainer>
    ))
    .with({ isSuccess: true, hasData: true, showWhiteBackground: false }, () => <Grid container>{children}</Grid>)
    .with({ isSuccess: true, hasData: true }, () => (
      <Box display='flex' justifyContent='center' alignItems='center'>
        {children}
      </Box>
    ))
    .with({ showWhiteBackground: false }, () => (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100%'
        style={{ backgroundColor: colors.white, borderRadius: '8px', border: `1px solid ${colors.gray3}` }}
      >
        <NoDataMessage noDataMessage={noDataMessage} />
      </Box>
    ))
    .otherwise(() => (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100%'
        style={{ backgroundColor: colors.white }}
      >
        <NoDataMessage noDataMessage={noDataMessage} />
      </Box>
    ))

export default LoadingContainer

import { CSSProperties, FC, PropsWithChildren } from 'react'
import { Grid, Stack } from '@mui/material'

interface Props extends PropsWithChildren {
  gridStyle?: CSSProperties
  stackStyle?: CSSProperties
}

const LandingContainer: FC<Props> = ({ children, gridStyle, stackStyle }) => {
  return (
    <Grid
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        ...gridStyle
      }}
    >
      <Stack style={{ paddingLeft: '16px', paddingRight: '16px', maxWidth: '74rem', ...stackStyle }}>{children}</Stack>
    </Grid>
  )
}

export default LandingContainer

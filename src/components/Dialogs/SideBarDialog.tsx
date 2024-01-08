import { forwardRef, ReactElement, Ref } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Dialog, Grid, IconButton, Slide, Stack, Typography } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'
import InformationProvider from 'components/Navbars/InformationProvider'
import NavLinkStack from 'components/Navbars/NavLinkStack'
import { colors, theme } from 'theme'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>
) {
  return (
    <Slide
      direction='right'
      easing={{ enter: theme.transitions.easing.easeInOut, exit: theme.transitions.easing.easeInOut }}
      ref={ref}
      {...props}
    />
  )
})

interface Props {
  open: boolean
  onClose: () => void
}

const SideBarDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <Stack
        style={{
          backgroundColor: colors.darkBlue,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Grid container item xs={12}>
          <Grid
            container
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '16px'
            }}
          >
            <Grid container item xs={12} justifyContent='space-between' style={{ padding: '0px 16px' }}>
              <Grid item>
                <Typography
                  style={{
                    fontSize: '1.125rem',
                    letterSpacing: '0.2px',
                    fontWeight: 'bold',
                    color: colors.white
                  }}
                >
                  i.Process
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={onClose}
                  size='small'
                  color='secondary'
                  style={{
                    padding: 0,
                    margin: 0
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <NavLinkStack onClick={onClose} />
        </Grid>
        <InformationProvider />
      </Stack>
    </Dialog>
  )
}

export default SideBarDialog

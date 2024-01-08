import { CSSProperties, PropsWithChildren } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, Grid, IconButton, Stack, Typography } from '@mui/material'
import type { DialogProps } from '@mui/material/Dialog'
import pencilIcon from 'components/Icons/pencil-24.svg'

interface CustomDialogProps extends DialogProps, PropsWithChildren {
  title?: string
  header?: string
  dialogContentStyle?: CSSProperties
  stackStyle?: CSSProperties
  onClose: () => void | undefined
}

const CustomDialog = ({
  onClose,
  title,
  header,
  children,
  dialogContentStyle,
  stackStyle,
  ...props
}: CustomDialogProps) => {
  return (
    <Dialog scroll='body' id='dialog' {...props}>
      <DialogContent
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          ...dialogContentStyle
        }}
      >
        <Grid container justifyContent='end'>
          <IconButton onClick={onClose} size='small' style={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid container style={{ display: 'flex', flexDirection: 'column' }}>
            {header && (
              <Grid item container display='flex' spacing={'0.5rem'} style={{ alignItems: 'center' }}>
                <Grid item>
                  <img src={pencilIcon} style={{ width: '15px' }}></img>
                </Grid>
                <Grid item>
                  <Typography variant='h5'>{header}</Typography>
                </Grid>
              </Grid>
            )}
            <Grid item>
              <Typography variant='h1' id='dialog-title'>
                {title}
              </Typography>
            </Grid>
          </Grid>
          <Stack style={{ marginTop: '2rem', ...stackStyle }}>{children}</Stack>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog

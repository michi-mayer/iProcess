import { SyntheticEvent, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

interface ErrorProps {
  error: unknown
}

const ErrorFallback = ({ error }: ErrorProps) => {
  const message =
    error instanceof Error
      ? // remove the initial 'Error: ' that accompanies many errors
        error.toString().replace(/^Error:\s*/, '')
      : 'Error connecting the server!'

  const [open, setOpen] = useState<boolean>(true)

  const handleClose = (_?: Event | SyntheticEvent<unknown, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      id={'react-query-error'}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert variant='standard' severity='error' style={{ justifyContent: 'center', alignItems: 'center' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ErrorFallback

import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Alert, IconButton, Snackbar, Typography } from '@mui/material'

interface WarningSnackBarProps {
  message: string
  showWarning: boolean
}

const WarningSnackBar = ({ message, showWarning }: WarningSnackBarProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    setOpen(showWarning)
  }, [showWarning])

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} id='warning'>
      <Alert variant='standard' severity='warning' style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='caption' color='inherit' fontSize={17}>
          {message}
        </Typography>
        <IconButton onClick={handleClose} size='large'>
          <CloseIcon />
        </IconButton>
      </Alert>
    </Snackbar>
  )
}

export default WarningSnackBar

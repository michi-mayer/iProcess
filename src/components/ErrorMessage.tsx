import Typography from '@mui/material/Typography'
import { colors } from 'theme'

type TypographyProps = Parameters<typeof Typography>[0]

export interface ErrorMessageProps {
  error: boolean | undefined
  errorMessage: string | undefined
}

const ErrorMessage = ({ errorMessage, error, ...props }: ErrorMessageProps & TypographyProps) => (
  <>
    {error && errorMessage && (
      <Typography {...props} variant='caption' style={{ color: colors.redError, fontSize: 12 }}>
        {errorMessage}
      </Typography>
    )}
  </>
)

export default ErrorMessage

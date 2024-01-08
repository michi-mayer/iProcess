import { useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import Logo from 'components/Icons/Logo'
import { colors } from 'theme'

interface Props {
  onLogoClick?: () => void
  showLogo?: boolean
}

const IProcessLogo = ({ onLogoClick, showLogo = true }: Props) => {
  const { pathname } = useLocation()

  return (
    <Stack>
      <Logo onClickLogo={onLogoClick} showLogo={showLogo} />

      {pathname.includes('admin') && (
        <Typography
          style={{
            fontSize: '1.125rem',
            letterSpacing: '0.2px',
            fontWeight: 'lighter',
            color: colors.white,
            textAlign: 'center',
            marginLeft: '1.5rem',
            height: '48px'
          }}
        >
          Admin
        </Typography>
      )}
    </Stack>
  )
}

export default IProcessLogo

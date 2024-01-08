import { MouseEvent, useState } from 'react'
import styled from '@emotion/styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Button, Divider, Grid, Popover, Typography } from '@mui/material'
import ArrowIcon from 'components/Icons/ArrowIcon'
import LanguageDropDown from 'components/LanguageDropDown'
import { useAuth } from 'contexts/authContext'
import { truncateText } from 'helper/truncateText'
import { GroupUISignOutButton } from 'lib/ui/Buttons'
import { colors } from 'theme'

export const NavLinkAuthDivider = styled(Divider)({
  backgroundColor: colors.bluegray,
  opacity: '0.25'
})

interface Props {
  isCollapsed?: boolean
  showScrollDown?: boolean
  showScrollUp?: boolean
}

const AuthNavbar = ({ isCollapsed, showScrollDown, showScrollUp }: Props) => {
  const { authInfo } = useAuth()
  const userName = authInfo?.userName ?? 'Unknown User'

  const [anchorElement, setAnchorElement] = useState<undefined | HTMLElement>(undefined)
  const open = Boolean(anchorElement)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!(showScrollDown && showScrollUp) && <NavLinkAuthDivider style={{ width: '190px' }} />}

      <Button
        style={{ height: '4rem', width: '100%', padding: 0, marginLeft: 0, paddingLeft: isCollapsed ? '10px' : '26px' }}
        startIcon={<AccountCircleIcon style={{ fontSize: '24px', color: colors.white }} />}
        endIcon={
          !isCollapsed ? (
            <ArrowIcon
              fill={colors.white}
              height='1rem'
              width='1rem'
              style={{
                transform: 'rotate(-90deg)',
                marginRight: '1.7rem'
              }}
            />
          ) : undefined
        }
        onClick={handleClick}
      >
        {!isCollapsed && (
          <Typography variant='body1' color={colors.white} style={{ width: '100%' }}>
            {truncateText({ maxTextLength: 17, text: userName })}
          </Typography>
        )}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        style={{ left: -12 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
      >
        <GroupUISignOutButton></GroupUISignOutButton>
      </Popover>

      <Grid
        container
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: !isCollapsed ? '24px' : undefined,
          paddingRight: '10px',
          justifyContent: 'space-between'
        }}
      >
        {!isCollapsed && (
          <Typography variant='body1' color={colors.white} style={{ opacity: '0.75' }}>
            Intern - KSU 7.4
          </Typography>
        )}
        <LanguageDropDown arrowIconDirection='right' color={colors.white} />
      </Grid>
    </div>
  )
}

export default AuthNavbar

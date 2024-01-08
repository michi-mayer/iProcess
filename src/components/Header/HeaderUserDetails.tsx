/* eslint-disable no-undef */
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { ClickAwayListener, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material'
import { GroupUISignOutButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import LanguageDropDown from '../LanguageDropDown'
import { UserInfo } from '../UserInfo'

interface Props {
  color?: string
}

export const HeaderUserDetails = ({ color }: Props) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const previousOpen = useRef(open)

  const handleToggle = () => {
    setOpen((previousOpen_) => !previousOpen_)
  }

  const handleClose = (event: { target: unknown }) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (previousOpen.current === true && open === false && anchorRef?.current) {
      anchorRef?.current?.focus()
    }

    previousOpen.current = open
  }, [open])

  return (
    <>
      <Grid container item justifyContent='flex-end' alignItems='center'>
        <Grid item style={{ paddingRight: '16px' }}>
          <Typography variant='body1' style={{ color }}>
            Intern - KSU 7.4
          </Typography>
        </Grid>
        <Grid item>
          <LanguageDropDown color={color} />
        </Grid>
        <Grid item>
          <IconButton
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            onClick={handleToggle}
            size='large'
          >
            <AccountCircleOutlinedIcon style={{ fontSize: 32, color: color ?? colors.gray1 }} />
          </IconButton>
        </Grid>
      </Grid>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 10 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <UserInfo />
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose} style={{ justifyContent: 'space-around' }}>
                    <GroupUISignOutButton></GroupUISignOutButton>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

import { MouseEvent, useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Button, MenuItem, Popover, Typography } from '@mui/material'
import { LanguageOption, locales } from 'i18n/config'
import i18next from 'i18next'
import moment from 'moment-timezone'
import ArrowIcon from './Icons/ArrowIcon'
import 'moment/locale/de'

type ArrowDirection = 'right'

interface Props {
  color?: string
  arrowIconDirection?: ArrowDirection
}

const LanguageDropDown = ({ color, arrowIconDirection }: Props) => {
  const [anchorElement, setAnchorElement] = useState<undefined | HTMLElement>(undefined)
  const open = Boolean(anchorElement)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleSelectLanguage = (language: LanguageOption) => {
    i18next.changeLanguage(language.code)
    moment.locale(language.code)
    document.documentElement.lang = language.code
    setAnchorElement(undefined)
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  useEffect(() => {
    moment.locale(i18next.language)
    document.documentElement.lang = i18next.language
  }, [])

  return (
    <>
      <Button
        id='switch-language'
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='text'
        disableElevation
        onClick={handleClick}
      >
        <Typography variant='body1' style={{ marginLeft: 5, color }}>
          {i18next.language.toUpperCase()}
        </Typography>
        {arrowIconDirection === 'right' ? (
          <ArrowIcon
            fill={color}
            height='1rem'
            width='1rem'
            style={{
              transform: 'rotate(-90deg)',
              margin: '4px'
            }}
          />
        ) : (
          <KeyboardArrowDownIcon color={!color ? 'primary' : 'secondary'} style={{ fontSize: 30 }} />
        )}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: arrowIconDirection === 'right' ? 'center' : 'bottom', // By default popover below
          horizontal: arrowIconDirection === 'right' ? 'right' : 'center'
        }}
        transformOrigin={{
          vertical: arrowIconDirection === 'right' ? 'center' : 'top',
          horizontal: arrowIconDirection === 'right' ? 'left' : 'center'
        }}
      >
        {locales.map((language) => (
          <MenuItem key={language.code} onClick={() => handleSelectLanguage(language)} disableRipple>
            <Typography variant='body2' style={{ marginLeft: 5 }}>
              {language.name}
            </Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}

export default LanguageDropDown

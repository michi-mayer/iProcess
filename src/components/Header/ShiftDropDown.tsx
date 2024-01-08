import { MouseEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import Brightness6Icon from '@mui/icons-material/Brightness6'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import { List, ListItemButton, ListItemText, Menu, MenuItem, SvgIconTypeMap, Typography } from '@mui/material'
import { Team } from 'types'
import { Shift, useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { colors } from 'theme'

type Color = SvgIconTypeMap['props']['color']

interface ConditionalShiftIconProps {
  shift?: Shift
  color?: Color
}

const ConditionalShiftIcon = ({ shift, color }: ConditionalShiftIconProps) => {
  switch (shift) {
    case Shift.morningShift:
      return <Brightness5Icon color={color} style={{ marginRight: '8px' }} />
    case Shift.afternoonShift:
      return <Brightness6Icon color={color} style={{ marginRight: '8px' }} />
    case Shift.nightShift:
      return <NightsStayIcon color={color} style={{ marginRight: '8px' }} />
    case Shift.dailyOverview:
      return <AccessTimeIcon color={color} style={{ marginRight: '8px' }} />
    default:
      return <div></div>
  }
}

interface UseShiftMetadataProps {
  showDailyOverview?: boolean
}

const useShiftMetadata = ({ showDailyOverview = true }: UseShiftMetadataProps) => {
  const { t } = useTranslation('iProcess')

  const dailyShifts = [
    { i: 0, shiftText: t('header.morningShift'), shift: Shift.morningShift },
    { i: 1, shiftText: t('header.afternoonShift'), shift: Shift.afternoonShift },
    { i: 2, shiftText: t('header.nightShift'), shift: Shift.nightShift }
  ]

  if (showDailyOverview) dailyShifts.push({ i: 3, shiftText: t('header.dailyOverview'), shift: Shift.dailyOverview })

  return dailyShifts
}

export interface ShiftDropDownProps extends UseShiftMetadataProps {
  teams?: Team[]
}

export const ShiftDropDown = (props: ShiftDropDownProps) => {
  const { selectedShift, currentShift } = useIProcessState()
  const dispatch = useIProcessDispatch()

  const [anchorElement, setAnchorElement] = useState<undefined | HTMLElement>(undefined)
  const shiftTextMap = useShiftMetadata(props)

  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleMenuItemClick = (_: MouseEvent<HTMLElement>, index: number) => {
    dispatch({ type: 'selectedShift', selectedShift: index })
    setAnchorElement(undefined)
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  useEffect(() => {
    dispatch({ type: 'selectedShift', selectedShift: currentShift })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShift])

  return (
    <div>
      <List component='nav' aria-label='Select Shift' style={{ padding: '0', margin: '0' }}>
        <ListItemButton
          id='shift-dropdown'
          data-testid='shift-dropdown'
          aria-haspopup='true'
          aria-controls='shift-menu'
          onClick={handleClickListItem}
          style={{ padding: '0', margin: '0' }}
          component='div'
        >
          <ConditionalShiftIcon shift={shiftTextMap[selectedShift]?.shift} color='primary' />
          <ListItemText
            disableTypography
            primary={
              <Typography variant='h3' component={'span'}>
                {`${shiftTextMap[selectedShift]?.shiftText}` || 'Select'}
              </Typography>
            }
            style={{ padding: '0', margin: '0' }}
          />
          <ExpandMoreIcon color='primary' style={{ marginLeft: '8px', fontSize: '30px' }} />
        </ListItemButton>
      </List>
      <Menu id='shift-menu' anchorEl={anchorElement} keepMounted open={Boolean(anchorElement)} onClose={handleClose}>
        {shiftTextMap.map((item, index) => (
          <MenuItem
            id={'shift-option-' + item.shiftText}
            key={item.i}
            selected={index === selectedShift}
            onClick={(event) => handleMenuItemClick(event, index)}
            style={{
              marginLeft: '8px',
              marginRight: '8px',
              backgroundColor: index === selectedShift ? colors.bluegray : ''
            }}
          >
            <ConditionalShiftIcon shift={item.shift} /> {item.shiftText}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

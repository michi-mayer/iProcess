import { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import FreeBreakfastOutlinedIcon from '@mui/icons-material/FreeBreakfastOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material'
import { Type } from 'API'
import { IScheduleHour } from 'components/Dialogs/Admin/ShiftModelForm'

const iconsType = {
  Production: <PrecisionManufacturingOutlinedIcon color='primary' />,
  Pause: <FreeBreakfastOutlinedIcon color='primary' />,
  ShiftChange: <SyncAltIcon color='primary' />,
  Inactive: <CloseIcon color='primary' />
}

interface ShiftModelDropDownProps {
  onChangeType: (type: Type) => void
  id: string
  type: Type
  index: number
  isProductionLimit: boolean
  shifts: IScheduleHour[]
}

const ShiftModelDropDown = ({ shifts, onChangeType, id, type, index, isProductionLimit }: ShiftModelDropDownProps) => {
  const [anchorElement, setAnchorElement] = useState<undefined | HTMLElement>(undefined)
  const { t } = useTranslation('admin')
  const open = Boolean(anchorElement)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }
  const handleClose = (type: Type) => {
    onChangeType(type)
    setAnchorElement(undefined)
  }

  return (
    <div>
      <Button
        id={id}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='text'
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon color='primary' style={{ fontSize: 30 }} />}
      >
        {iconsType[type]}
        <Typography
          variant='body1'
          style={{
            marginLeft: 5,
            marginRight: type === Type.Pause ? '1.9rem' : ''
          }}
        >
          {type === Type.Production && t('shiftModelsSection.production')}
          {type === Type.Pause && t('shiftModelsSection.pause')}
          {type === Type.ShiftChange && t('shiftModelsSection.shiftChange')}
          {type === Type.Inactive && t('shiftModelsSection.inactive')}
        </Typography>
      </Button>
      <Menu anchorEl={anchorElement} open={open} onClose={() => handleClose(type)}>
        {isProductionLimit ? (
          <div>
            <MenuItem id='menu-item-pause' onClick={() => handleClose(Type.Pause)} disableRipple>
              <FreeBreakfastOutlinedIcon color='primary' />
              <Typography variant='body1' style={{ marginLeft: 5 }}>
                {t('shiftModelsSection.pause')}
              </Typography>
            </MenuItem>
            {index === shifts.length - 1 && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem id='menu-item-shiftchange' onClick={() => handleClose(Type.ShiftChange)} disableRipple>
                  <SyncAltIcon color='primary' />
                  <Typography variant='body1' style={{ marginLeft: 5 }}>
                    {t('shiftModelsSection.shiftChange')}
                  </Typography>
                </MenuItem>
              </>
            )}
          </div>
        ) : (
          <div>
            <MenuItem id='menu-item-production' onClick={() => handleClose(Type.Production)} disableRipple>
              <PrecisionManufacturingOutlinedIcon color='primary' />
              <Typography variant='body1' style={{ marginLeft: 5 }}>
                {t('shiftModelsSection.production')}
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem id='menu-item-pause' onClick={() => handleClose(Type.Pause)} disableRipple>
              <FreeBreakfastOutlinedIcon color='primary' />
              <Typography variant='body1' style={{ marginLeft: 5 }}>
                {t('shiftModelsSection.pause')}
              </Typography>
            </MenuItem>
            {index === shifts.length - 1 && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem id='menu-item-shiftchange' onClick={() => handleClose(Type.ShiftChange)} disableRipple>
                  <SyncAltIcon color='primary' />
                  <Typography variant='body1' style={{ marginLeft: 5 }}>
                    {t('shiftModelsSection.shiftChange')}
                  </Typography>
                </MenuItem>
              </>
            )}
            {shifts.length <= 1 && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem id='menu-item-inactive' onClick={() => handleClose(Type.Inactive)} disableRipple>
                  <CloseIcon color='primary' />
                  <Typography variant='body1' style={{ marginLeft: 5 }}>
                    {t('shiftModelsSection.inactive')}
                  </Typography>
                </MenuItem>
              </>
            )}
          </div>
        )}
      </Menu>
    </div>
  )
}

export default ShiftModelDropDown

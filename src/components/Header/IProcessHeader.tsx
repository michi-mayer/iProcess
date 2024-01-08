import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { TeamsDropDown } from 'components/TeamsDropDown'
import { colors } from 'theme'
import { ShiftDropDown, ShiftDropDownProps } from './ShiftDropDown'
import { ShiftInfo } from './ShiftInfo'

const GridCustom = styled(Grid)({
  background: colors.white,
  color: 'black',
  height: 48,
  display: 'flex',
  boxShadow: 'none',
  borderBottom: `1px solid ${colors.gray3}`,
  padding: '0 5rem'
})

const IProcessHeader = ({ showDailyOverview, teams }: ShiftDropDownProps) => {
  return (
    <GridCustom item container xs={12}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <ShiftDropDown showDailyOverview={showDailyOverview} />
        {!!teams && <TeamsDropDown teams={teams} />}
        <ShiftInfo />
      </div>
    </GridCustom>
  )
}

export default IProcessHeader

import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton } from '@mui/material'

interface Props {
  disableButton: boolean
  onClickConfig: () => void
}

const ConfigButton = ({ disableButton, onClickConfig }: Props) => {
  return (
    <div style={{ display: 'block' }}>
      <IconButton id='configButton' type='button' onClick={onClickConfig} disabled={disableButton}>
        <SettingsIcon fontSize='medium' color={disableButton ? 'disabled' : 'primary'} />
      </IconButton>
    </div>
  )
}

export default ConfigButton

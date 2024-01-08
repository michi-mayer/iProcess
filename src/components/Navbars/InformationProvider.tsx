import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import NoteIcon from 'components/Icons/NoteIcon'
import { colors, theme } from 'theme'
import { iconsStyle } from './NavLinkStack'

const StyledAnchor = styled('a')({
  fontSize: '1.125rem',
  fontFamily: theme.typography.fontFamily,
  color: colors.white,
  letterSpacing: '0.2px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const InformationProvider = () => {
  return (
    <Grid item xs={12} style={{ display: 'flex', alignItems: 'end', marginBottom: '1rem', paddingLeft: '24px' }}>
      <StyledAnchor
        target='_blank'
        href='https://volkswagen-net.de/wikis/display/Compliance/Hinweisgebersystem'
        rel='noreferrer'
      >
        <NoteIcon style={iconsStyle} />
        Hinweisgeber
      </StyledAnchor>
    </Grid>
  )
}

export default InformationProvider

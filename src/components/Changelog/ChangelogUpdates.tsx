import { useTranslation } from 'react-i18next'
import { Divider, Grid, Stack, styled, Typography } from '@mui/material'
import { Changelog } from 'hooks/services/useQueryChangelog'
import { colors } from 'theme'

const Label = styled('label')({
  padding: '3px 8px',
  borderRadius: '18px',
  color: colors.white,
  fontSize: 12,
  fontWeight: 'bold'
})

interface Props {
  changelog: Changelog
  isPopup: boolean
}

const ChangelogUpdates = ({ changelog, isPopup }: Props) => {
  const { t } = useTranslation('landing')
  return (
    <Grid container>
      <Grid container>
        <Typography variant='body2' style={{ color: colors.gray1, fontWeight: 'bold' }}>
          {changelog.version}
        </Typography>
        <Typography variant='body2' marginLeft='0.5rem' style={{ color: colors.gray2 }}>
          {t('changelog.by')}
          {changelog.author}
        </Typography>
      </Grid>
      <Stack>
        {changelog.changes.length > 0 && (
          <Stack style={{ marginBottom: '8px' }}>
            <Grid item style={{ margin: '8px 0 8px 0' }}>
              <Label style={{ backgroundColor: colors.greenTag }}>{t('changelog.enhanced')}</Label>
            </Grid>
            <ul style={{ listStyle: 'initial', paddingLeft: '1rem', paddingRight: '2rem' }}>
              {changelog.changes.map((text) => (
                <li key={text}>
                  <Typography>{text}</Typography>
                </li>
              ))}
            </ul>
          </Stack>
        )}
        {changelog.fixes.length > 0 && (
          <Stack style={{ marginBottom: '8px' }}>
            <Grid item style={{ margin: '8px 0 8px 0' }}>
              <Label style={{ backgroundColor: colors.blue }}>{t('changelog.fixed')}</Label>
            </Grid>
            <ul style={{ listStyle: 'initial', paddingLeft: '1rem', paddingRight: '2rem' }}>
              {changelog.fixes.map((text) => (
                <li key={text}>
                  <Typography>{text}</Typography>
                </li>
              ))}
            </ul>
          </Stack>
        )}
      </Stack>
      {!isPopup && (
        <Grid item xs={12} style={{ margin: '8px 0 12px 0' }}>
          <Divider />
        </Grid>
      )}
    </Grid>
  )
}

export default ChangelogUpdates

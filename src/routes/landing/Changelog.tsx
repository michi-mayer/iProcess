import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider, Grid, Stack, TablePagination, Typography } from '@mui/material'
import LandingContainer from 'components/Layouts/LandingContainer'
import ChangelogTimeline from 'components/Timelines/ChangelogTimeline'
import useQueryChangelog from 'hooks/services/useQueryChangelog'
import { colors } from 'theme'

const Changelog = () => {
  const { t } = useTranslation('landing')
  const { data } = useQueryChangelog()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value))
    setPage(0)
  }
  return (
    <LandingContainer>
      <Typography variant='h2' fontSize='2rem' color={colors.blue} marginBottom='1.0625rem' marginTop='1.5rem'>
        {t('header.changelog')}
      </Typography>
      <Grid container item xs={12} style={{ marginBottom: '3rem' }}>
        {/* CHANGELOG */}
        <Grid container display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h2' textAlign='center'>
            {t('changelog.section')}
          </Typography>
          <TablePagination
            component='div'
            count={data?.length || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage={t('changelog.pagination')}
            labelDisplayedRows={({ from, to, count }) => `${from} - ${to} ${t('changelog.paginationOf')} ${count}`}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
        <Stack
          style={{ backgroundColor: 'white', border: `1px solid ${colors.gray3}` }}
          divider={<Divider orientation='horizontal' style={{ backgroundColor: colors.gray4 }} />}
          width='auto'
        >
          <ChangelogTimeline data={data} rowsPerPage={rowsPerPage} page={page} />
        </Stack>
        <Grid container alignContent='center' justifyContent='right' margin='1rem 0rem 2rem 0rem'>
          <Typography variant='subtitle1'>i.Process {process.env.VITE_APP_VERSION}</Typography>
        </Grid>
      </Grid>
    </LandingContainer>
  )
}

export default Changelog

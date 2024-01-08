import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Button, Divider, Grid, Stack, TablePagination, Typography } from '@mui/material'
import ApplicationCard from 'components/Cards/ApplicationCard'
import NewsCard from 'components/Cards/NewsCard'
import CustomDialog from 'components/Dialogs/CustomDialog'
import LandingContainer from 'components/Layouts/LandingContainer'
import ChangelogTimeline from 'components/Timelines/ChangelogTimeline'
import { useAuth } from 'contexts/authContext'
import useQueryChangelog from 'hooks/services/useQueryChangelog'
import useQueryNewsFeed from 'hooks/services/useQueryNewsFeed'
import useLocalStorageState from 'hooks/useLocalStorageState'
import { colors } from 'theme'
import { applications, ROUTER } from '../routing'

const Overview = () => {
  const { data: newsfeedData } = useQueryNewsFeed()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { authInfo } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation('landing')
  const { data: changelogData } = useQueryChangelog()
  const firstIndex = rowsPerPage * page
  const secondIndex = rowsPerPage * page + rowsPerPage
  const [changelog, setChangelog] = useLocalStorageState({
    key: 'changelog',
    defaultValue: {
      open: true,
      version: ''
    }
  })
  const handleClose = () => {
    setChangelog({
      open: false,
      version: process.env.VITE_APP_VERSION
    })
  }

  const handleClick = useCallback(() => {
    Promise.resolve(
      setChangelog({
        open: false,
        version: process.env.VITE_APP_VERSION
      })
    ).then(() => navigate(ROUTER.LANDING_CHANGE_LOG))
  }, [navigate, setChangelog])

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value))
    setPage(0)
  }

  useEffect(() => {
    if (changelog.version !== process.env.VITE_APP_VERSION) {
      setChangelog((previousState) => ({
        ...previousState,
        open: true
      }))
    }
  }, [changelog.version, setChangelog])

  return (
    <LandingContainer>
      <Typography variant='h2' fontSize='2rem' marginBottom='3rem' marginTop='1.5rem'>
        {t('header.overview')}, {authInfo?.userName}
      </Typography>

      {/* Applications */}
      <Typography variant='h2' marginBottom='1rem'>
        {t('applications.section')}
      </Typography>
      <Grid container item xs={12} spacing={2} style={{ marginBottom: '3rem' }}>
        {applications.map((application, index) => {
          return (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2.4}
              key={`application-${index}`}
              id={`application-card-${application.title}`}
            >
              <ApplicationCard application={application} />
            </Grid>
          )
        })}
      </Grid>
      {/* News */}
      <Grid container display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h2' textAlign='center'>
          {t('changelog.section')}
        </Typography>
        <TablePagination
          component='div'
          count={newsfeedData?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={t('changelog.pagination')}
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to} ${t('changelog.paginationOf')} ${count}`}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
      <Stack
        padding={2}
        spacing={2}
        style={{ backgroundColor: 'white', border: `1px solid ${colors.gray3}` }}
        divider={<Divider orientation='horizontal' style={{ backgroundColor: colors.gray4 }} />}
        width='auto'
      >
        {newsfeedData?.slice(firstIndex, secondIndex).map((news, index) => {
          return <NewsCard news={news} key={index} />
        })}
      </Stack>
      <Grid container alignContent='center' justifyContent='right' margin='1rem 0rem 2rem 0rem'>
        <Typography variant='subtitle1'>i.Process {process.env.VITE_APP_VERSION}</Typography>
      </Grid>
      <CustomDialog open={changelog.open} onClose={handleClose} title={t('changelog.whatsNew')}>
        <Divider style={{ marginTop: '1rem' }} />
        <ChangelogTimeline data={changelogData} />
        <Divider style={{ marginTop: -11 }} />
        <div
          style={{
            backgroundColor: colors.white,
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: '1rem'
          }}
        >
          <Button onClick={handleClick} variant='outlined'>
            {t('changelog.openChangelog')}
          </Button>
        </div>
      </CustomDialog>
    </LandingContainer>
  )
}

export default Overview

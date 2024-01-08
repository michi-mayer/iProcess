import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { changeDateFormat } from 'components/Timelines/ChangelogTimeline'
import { NewsFeed } from 'hooks/services/useQueryNewsFeed'
import { colors } from 'theme'

interface newsProps {
  news: NewsFeed
}

const NewsCard = ({ news }: newsProps) => {
  const [isShowMoreActive, setShowMore] = useState(false)
  const { t } = useTranslation('landing')

  const maxTextParagraphs = 20
  const isTextTooBig = news.description.length > maxTextParagraphs

  return (
    <Grid container>
      <Grid container paddingBottom='12px'>
        <Typography fontWeight='bold' style={{ color: colors.gray1 }}>
          {news.author}
        </Typography>
        <Typography marginLeft='1rem' style={{ color: colors.gray2 }}>
          {changeDateFormat(news.date)}
        </Typography>
      </Grid>
      <Stack>
        {news.description.map((line, index) => {
          return (
            <Typography
              key={index}
              style={{ marginBottom: '1rem' }}
              hidden={!!(isTextTooBig && index > maxTextParagraphs && !isShowMoreActive)}
            >
              {line}
            </Typography>
          )
        })}
        {isTextTooBig && (
          <Button
            size='small'
            style={{
              color: colors.blue,
              maxWidth: '100px'
            }}
            onClick={() => setShowMore(!isShowMoreActive)}
          >
            <Typography variant='h3'>{isShowMoreActive ? t('changelog.showLess') : t('changelog.showMore')}</Typography>
          </Button>
        )}
      </Stack>
    </Grid>
  )
}

export default NewsCard

import { useMemo } from 'react'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  timelineContentClasses,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from '@mui/lab'
import { Typography } from '@mui/material'
import ChangelogUpdates from 'components/Changelog/ChangelogUpdates'
import { Changelog } from 'hooks/services/useQueryChangelog'
import { colors } from 'theme'

export const changeDateFormat = (date: string) => {
  const [month, day, year] = date.split('/')
  return day + '/' + month + '/' + year
}

interface Props {
  data: Changelog[] | undefined
  rowsPerPage?: number
  page?: number
}

const ChangelogTimeline = ({ data, rowsPerPage, page }: Props) => {
  const isPopup = typeof rowsPerPage === 'undefined' && typeof page === 'undefined'
  const { firstIndex, secondIndex } = useMemo(() => {
    if (typeof rowsPerPage === 'number' && typeof page === 'number') {
      return {
        firstIndex: rowsPerPage * page,
        secondIndex: rowsPerPage * page + rowsPerPage
      }
    }
    return {
      firstIndex: 0,
      secondIndex: 1
    }
  }, [page, rowsPerPage])

  return (
    <Timeline
      position='left'
      sx={{
        [`& .${timelineContentClasses.root}`]: {
          flex: 0
        },
        padding: 0
      }}
    >
      {data?.slice(firstIndex, secondIndex)?.map((changelog) => (
        <TimelineItem key={changelog.date}>
          <TimelineOppositeContent sx={{ paddingTop: 0 }}>
            <ChangelogUpdates changelog={changelog} isPopup={isPopup} />
          </TimelineOppositeContent>
          <TimelineSeparator sx={{ position: 'inherit', top: 5 }}>
            <TimelineDot variant='outlined' color='primary' sx={{ margin: 0 }} />
            <TimelineConnector sx={{ backgroundColor: colors.blue }} />
          </TimelineSeparator>
          <TimelineContent sx={{ paddingTop: 0 }}>
            <Typography variant='body2'>{changeDateFormat(changelog.date)}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export default ChangelogTimeline

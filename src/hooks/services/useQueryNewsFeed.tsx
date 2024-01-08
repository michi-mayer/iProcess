import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Locale } from 'i18n/config'
import { z } from 'zod'
import { sortNewsByDate } from 'helper/sortData'

const NewsFeedSchema = z.object({
  author: z.string(),
  date: z.string(),
  description: z.array(z.string())
})

export type NewsFeed = z.infer<typeof NewsFeedSchema>

const getNewsFeed = async (locale: Locale) => {
  const response = await fetch(`../../data/newsfeed_${locale}.json`).then((result) => result.json())
  return sortNewsByDate(z.array(NewsFeedSchema).parse(response))
}

const useQueryNewsFeed = () => {
  const { i18n } = useTranslation('landing')
  const locale = i18n.language as Locale
  return useQuery({
    queryKey: ['NewsFeed', locale],
    queryFn: () => getNewsFeed(locale),
    staleTime: 60 * 60 * 24 * 14 // 14 days
  })
}

export default useQueryNewsFeed

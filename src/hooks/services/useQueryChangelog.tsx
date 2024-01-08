import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Locale } from 'i18n/config'
import { z } from 'zod'
import { sortNewsByDate } from 'helper/sortData'

const ChangeloSchema = z.object({
  author: z.string(),
  date: z.string(),
  changes: z.array(z.string()).catch([]),
  fixes: z.array(z.string()).catch([]),
  version: z
    .string()
    .refine(
      (value) => /^v\d{2}(?:.\d{1,2}){2}-\d{1,2}/.test(value),
      'The version should have the following format => v[YY].[WEEK].[CHANGES]-[FIXES]. e.g. v22.6.0-0'
    )
})

export type Changelog = z.infer<typeof ChangeloSchema>

const getChangelog = async (locale: Locale) => {
  const response = await fetch(`../../data/changelog_${locale}.json`).then((result) => result.json())
  return sortNewsByDate(z.array(ChangeloSchema).parse(response))
}

const useQueryChangelog = () => {
  const { i18n } = useTranslation('landing')
  const locale = i18n.language as Locale
  return useQuery({
    queryKey: ['Changelog', locale],
    queryFn: () => getChangelog(locale),
    staleTime: 60 * 60 * 24 * 14 // 14 days
  })
}

export default useQueryChangelog

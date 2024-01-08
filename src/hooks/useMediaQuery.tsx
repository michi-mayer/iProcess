import { useCallback, useEffect, useState } from 'react'
import { useMediaQuery as useMediaQueryMUI } from '@mui/material'
import { Breakpoint, useTheme } from '@mui/material/styles'
import { CSSUnitSize } from 'types'

type Height = 'height:'
type Width = 'width:'
type Max = 'max-'
type Min = 'min-'

type Query =
  | `${Height} ${CSSUnitSize}`
  | `${Max}${Height} ${CSSUnitSize}`
  | `${Min}${Height} ${CSSUnitSize}`
  | `${Width} ${CSSUnitSize}`
  | `${Max}${Width} ${CSSUnitSize}`
  | `${Min}${Width} ${CSSUnitSize}`

/**
 * First param is compulsory and is related to the height and the MUI breakpoints determined on the ./theme.ts file
 * The second param is optional and allows you to do a more custom media query
 * If the second param is not passed, then the second position of the array will return always false
 * @param {Breakpoint} breakpoint "xs" | "sm" | "md" | "lg" | "xl"
 * @param {Query} query `height: ${number}px` | `height: ${number}rem` | `height: ${number}em` | `height: ${number}%` | `max-height: ${number}px` | `max-height: ${number}rem` | `max-height: ${number}em` | `max-height: ${number}%` | `min-height: ${number}px` | `min-height: ${number}rem` | `min-height: ${number}em` | `min-height: ${number}%` | `width: ${number}px` | `width: ${number}rem` | `width: ${number}em` | `width: ${number}%` | `max-width: ${number}px` | ... 6 more ... | `min-width: ${number}%`
 * @returns [boolean, boolean]
 */
const useMediaQuery = (breakpoint: Breakpoint, query?: Query): [boolean, boolean] => {
  const queryWithBrackets = query ? `(${query})` : query
  const theme = useTheme()
  const muiBreakpointMatches = useMediaQueryMUI(theme.breakpoints.up(breakpoint))
  const getMatches = (query?: string): boolean => {
    if (typeof window !== 'undefined' && query) {
      return !!window?.matchMedia?.(query)?.matches
    }
    return false
  }

  const [matches, setMatches] = useState<boolean>(getMatches(queryWithBrackets))

  const handleChange = useCallback(() => {
    setMatches(getMatches(queryWithBrackets))
  }, [queryWithBrackets])

  useEffect(() => {
    if (queryWithBrackets) {
      const matchMedia = window?.matchMedia?.(queryWithBrackets)

      // Triggered at the first client-side load and if query changes
      handleChange()

      matchMedia?.addEventListener('change', handleChange)

      return () => {
        matchMedia?.removeEventListener('change', handleChange)
      }
    }
  }, [handleChange, queryWithBrackets])

  return [muiBreakpointMatches, matches]
}

export default useMediaQuery

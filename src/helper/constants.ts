import { Team } from 'types'
import { NIL } from 'uuid'

export const MINIMUM_CYCLESTATION_ERROR = 'minimumCycleStationPerTeam'
export const DUPLICATED_VALUE = 'duplicatedValue'
export const EMPTY_VALUE = '-'
export const EMPTY_STRING = '' as const
export const REMOVE_VALUE = null // eslint-disable-line unicorn/no-null

export const ALL_PREVIOUS_TEAMS: Team = {
  name: 'All Teams',
  id: 'all-previous-teams',
  index: 0
}

export const ALL_OPTION_DASHBOARDS = {
  id: NIL,
  name: 'All'
} as const

/**
 * This constant has been extracted from the ideal heights for each breakpoint (sm, md, lg, xl).
 * E.g: For {lg : 1281} it's 2370 px => 2370/1281 ≈ 1.85
 * E.g: for {md : 961} it's 1780 px => 1780/961 ≈ 1.85
 *
 * This constants should be updated if more elements are added/substracted from the Quicksight dashboard
 */
const DASHBOARD_SCALE_FACTOR = 1.05
export const DASHBOARD_HEIGHT = `${Math.round(window.innerWidth * DASHBOARD_SCALE_FACTOR)}px`

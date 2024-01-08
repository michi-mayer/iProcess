import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Team } from 'types'
import { describe, expect, it, vi } from 'vitest'
import { IProcessProvider, useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { ALL_CYCLE_STATIONS, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { TeamsDropDown } from './TeamsDropDown'

// * this mock makes sure any components using the translate hook can use it without a warning being shown
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (_: string) => _,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
}))

const teams: [Team, Team, Team] = [
  {
    id: '952932fe-5d93-4a43-84fd-557f53e5e139',
    name: 'Team 1',
    index: 0
  },
  {
    id: 'f6f2e897-d432-487e-b4b7-16cecaea909c',
    name: 'Team 2',
    index: 1
  },
  {
    id: '84ad0211-4a6f-4b47-a34d-72e75fd610b6',
    name: 'Team 3',
    index: 2
  }
]

const CheckAppContext = () => {
  const { selectedTeam } = useIProcessState()
  return <p data-testid='check-app-context'>{selectedTeam?.name ?? 'No team selected'}</p>
}

const CheckCycleStationAppContext = () => {
  const { cycleStationSelected } = useIProcessState()
  return <p data-testid='check-app-context-cyclestation'>{cycleStationSelected?.id ?? 'No cyclestation selected'}</p>
}

const SetCycleStationInAppContext = () => {
  const dispatch = useIProcessDispatch()
  useEffect(() => {
    dispatch({
      type: 'cycleStationSelected',
      cycleStationSelected: { ...UNIT_SPECIFIC_CYCLE_STATION, name: UNIT_SPECIFIC_CYCLE_STATION.name }
    })
  }, [dispatch])

  return <></>
}

describe(`Simple ${TeamsDropDown.name}`, () => {
  it(`should update the selected shift and team values in the app's context`, () => {
    render(
      <BrowserRouter>
        <IProcessProvider>
          <TeamsDropDown teams={teams} />
          <CheckAppContext />
        </IProcessProvider>
      </BrowserRouter>
    )

    // * Click on dropdown
    const dropdown = screen.getByTestId('team-dropdown')
    fireEvent.click(dropdown)

    // * Select second team option and check it's visible
    const menu = screen.getByRole('menu')
    const option = within(menu).getByText(teams[1].name)
    expect(option).toBeVisible()

    // * Click on second team option and check the dropdown now shows it
    fireEvent.click(option)
    expect(within(dropdown).getByText(teams[1].name)).toBeVisible()

    // * Check the second team option is also updated in the app's context
    const paragraph = screen.getByTestId('check-app-context')
    expect(within(paragraph).getByText(teams[1].name)).toBeInTheDocument()
  })

  it(`should not update selected cycle station in the app's context`, () => {
    render(
      <BrowserRouter>
        <IProcessProvider>
          <TeamsDropDown teams={teams} />
          <CheckCycleStationAppContext />
        </IProcessProvider>
      </BrowserRouter>
    )

    // * Click on dropdown
    const dropdown = screen.getByTestId('team-dropdown')
    fireEvent.click(dropdown)

    // * Select second team option
    const menu = screen.getByRole('menu')
    const option = within(menu).getByText(teams[1].name)

    // * Click on second team option
    fireEvent.click(option)

    // * Check the cycle station is not updated in the app's context
    const paragraph = screen.getByTestId('check-app-context-cyclestation')
    expect(within(paragraph).getByText(ALL_CYCLE_STATIONS.id)).toBeInTheDocument()
  })

  it(`should update selected cycle station in the app's context`, () => {
    render(
      <BrowserRouter>
        <IProcessProvider>
          <TeamsDropDown teams={teams} />
          <SetCycleStationInAppContext />
          <CheckCycleStationAppContext />
        </IProcessProvider>
      </BrowserRouter>
    )

    // * Click on dropdown
    const dropdown = screen.getByTestId('team-dropdown')
    fireEvent.click(dropdown)

    // * Select second team option
    const menu = screen.getByRole('menu')
    const option = within(menu).getByText(teams[1].name)

    // * Click on second team option
    fireEvent.click(option)

    // * Check the cycle station is updated in the app's context
    const paragraph = screen.getByTestId('check-app-context-cyclestation')
    expect(within(paragraph).getByText(UNIT_SPECIFIC_CYCLE_STATION.id)).toBeInTheDocument()
  })
})

describe(`${TeamsDropDown.name} with autocomplete`, () => {
  it(`should update the selected Team in the app's context using only option selection`, () => {
    render(
      <BrowserRouter>
        <IProcessProvider>
          <TeamsDropDown teams={teams} isFilter />
          <CheckAppContext />
        </IProcessProvider>
      </BrowserRouter>
    )

    // * Click on dropdown
    const dropdown = screen.getByRole('button')
    fireEvent.click(dropdown)

    // * Select one of the options and check it's visible
    const allOptions = screen.getByRole('listbox')

    const option = within(allOptions).getByText(teams[2].name)
    expect(option).toBeVisible()

    // * Click on that option and check the dropdown now shows it
    fireEvent.click(option)
    expect(within(dropdown).getByText(teams[2].name)).toBeVisible()

    // * Check the that option is also updated in the app's context
    const paragraph = screen.getByTestId('check-app-context')
    expect(within(paragraph).getByText(teams[2].name)).toBeVisible()
  })

  it(`should update the selected Team in the app's context using autocomplete filtering and option selection`, async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <IProcessProvider>
          <TeamsDropDown teams={teams} isFilter />
          <CheckAppContext />
        </IProcessProvider>
      </BrowserRouter>
    )

    // * Click on dropdown
    const dropdown = screen.getByRole('button')
    fireEvent.click(dropdown)

    // * Select autocomplete input and input one of the options
    const input = screen.getByRole('combobox')
    await act(async () => await user.type(input, teams[1].name))

    // * Check that option is visible
    const allOptions = screen.getByRole('listbox')

    const option = within(allOptions).getByText(teams[1].name)
    expect(option).toBeVisible()

    // * Click on that option and check the dropdown now shows it
    fireEvent.click(option)
    expect(within(dropdown).getByText(teams[1].name)).toBeVisible()

    // * Check the second team option is also updated in the app's context
    const paragraph = screen.getByTestId('check-app-context')
    expect(within(paragraph).getByText(teams[1].name)).toBeInTheDocument()
  })
})

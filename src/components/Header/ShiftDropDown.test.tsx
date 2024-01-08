import { fireEvent, render, screen, within } from '@testing-library/react'
import { match, P } from 'ts-pattern'
import { describe, expect, it, vi } from 'vitest'
import { IProcessProvider, Shift, useIProcessState } from 'contexts/iProcessContext'
import { ShiftDropDown } from './ShiftDropDown'

// * this mock makes sure any components using the translate hook can use it without a warning being shown
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (_: string) =>
        match(_)
          .with(P.string.includes('morning'), () => 'Morning')
          .with(P.string.includes('afternoon'), () => 'Afternoon')
          .otherwise(() => 'Night'),
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

const CheckAppContext = () => {
  const { selectedShift } = useIProcessState()
  return <p data-testid='check-app-context'>{selectedShift}</p>
}

describe(ShiftDropDown.name, () => {
  it(`should update the selected shift in the app's context`, () => {
    const afternoonShift = 'Afternoon'

    render(
      <IProcessProvider>
        <ShiftDropDown />
        <CheckAppContext />
      </IProcessProvider>
    )

    // * Click on dropdown
    const dropdown = screen.getByTestId('shift-dropdown')
    fireEvent.click(dropdown)

    // * Select option for the afternoon shift and check it's visible
    const menu = screen.getByRole('menu')
    const option = within(menu).getByText(afternoonShift)
    expect(option).toBeVisible()

    // * Click on the option for the afternoon shift and check the dropdown now shows it
    fireEvent.click(option)
    expect(within(dropdown).getByText(afternoonShift)).toBeVisible()

    // * Check the afternoon shift option is also updated in the app's context
    const paragraph = screen.getByTestId('check-app-context')
    expect(within(paragraph).getByText(Shift.afternoonShift)).toBeInTheDocument()
  })
})

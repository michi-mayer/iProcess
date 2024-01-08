import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IProcessProvider, useIProcessState } from 'contexts/iProcessContext'
import { dayjs } from 'shared/datetime'
import useCurrentTime from './useCurrentTime'

const CheckCurrentTime = () => {
  useCurrentTime()
  const { currentDate, currentTime } = useIProcessState()
  return (
    <>
      {currentDate} {currentTime}
    </>
  )
}

describe(useCurrentTime.name, () => {
  it(`should retrieve the current date and time`, () => {
    render(
      <IProcessProvider>
        <CheckCurrentTime />
      </IProcessProvider>
    )

    const currentHour = dayjs().format('H:')
    const currentDay = dayjs().format('D.')

    expect(screen.getByText(currentHour, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(currentDay, { exact: false })).toBeInTheDocument()
  })
})

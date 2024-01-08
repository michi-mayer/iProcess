import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GroupingList } from 'hooks/useSideNavbar'
import SideNavbarGroupingList from './SideNavbarGroupingList'

describe(SideNavbarGroupingList.name, () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Checks the component renders a list of clickable Grouping items', () => {
    const handleSelectGrouping = vi.fn()
    const handlePrefetchGroupingData = vi.fn()
    const groupings: GroupingList = {
      items: [
        {
          id: '9fdc755c-458e-4345-9f55-ecb3ab9c2b9d',
          name: 'z.B. Block 1',
          createdAt: '2021-11-09T12:00:00.000Z',
          units: []
        }
      ],
      nextToken: undefined
    }

    render(
      <SideNavbarGroupingList
        groupings={groupings}
        handleSelectGrouping={handleSelectGrouping}
        handlePrefetchGroupingData={handlePrefetchGroupingData}
      />
    )

    const component = screen.getByTestId('side-navbar-grouping-list')
    expect(component).toBeInTheDocument() // The component is initialized and rendered
  })
})

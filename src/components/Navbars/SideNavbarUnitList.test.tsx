import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { NIL as NIL_UUID } from 'uuid'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { UnitType } from 'API'
import { ExtendedGrouping, ExtendedUnit } from 'contexts/iProcessContext'
import SideBarProvider from 'contexts/sidebarStore'
import SideNavbarUnitList from './SideNavbarUnitList'

const grouping: ExtendedGrouping = {
  id: '59ce247c-80d6-4380-b27a-c5d32dd7f06e',
  name: 'Production Units',
  createdAt: '2022-07-19T14:26:54.474Z',
  units: [
    {
      name: 'PWK-2 1196 Klebeanlage 1',
      manufacturer: 'Fa. Rampf',
      id: '7cd0c408-e619-41ee-be66-54317aaf411e',
      createdAt: '2022-06-30T07:13:44.972Z',
      type: UnitType.productionUnit,
      shortName: 'K 1',
      teams: [],
      machineId: NIL_UUID
    }
  ]
}
const units: ExtendedUnit[] = [
  {
    id: '7cd0c408-e619-41ee-be66-54317aaf411e',
    name: 'PWK-2 1196 Klebeanlage 1',
    shortName: 'K 1',
    shiftModels: [],
    unitDisruptionClassification: {
      __typename: 'UnitProblemClassification',
      id: '1ceb19ed-bd50-49dd-92e1-e2199e4236c6',
      classification:
        '[{"options":[{"options":[],"id":"lN0JgnnEEO1wgEXvOoPFZ","value":"Anlage"},{"options":[],"id":"oOGlk7-fIUPx8Wqb0awhs","value":"Roboter"},{"options":[],"id":"z511O0hFXLZqSG71AOQhc","value":"Fördertechnik"},{"options":[],"id":"_q1umaHu4T4hnUfv-s6Vu","value":"Baugruppe"},{"options":[{"id":"1yFXmVaiAYcd4aaIHF1nN","value":"Elektrisch"},{"id":"sdEmU4BtUgEJ4Shwx-3TS","value":"Mechanisch"},{"id":"xR8q3vdO1iAoQRlHf_9zW","value":"Hydraulisch"},{"id":"wqNt1VDi4LRnGCN-6rK4k","value":"Pneumatisch"}],"id":"yVk2dgrOnEwv-BSvQIo62","value":"Werkzeug"}],"id":"AhcdUItLT2ANcqc4_xKVL","value":"Maschine"},{"options":[{"options":[],"id":"IsmniD3tVUuXHj5UHZpnQ","value":"Arbeitsmittel"},{"options":[],"id":"De2Dob4Xb_7X6S-puzPAC","value":"Arbeitsplanung"},{"options":[],"id":"qUzCsMpVn7QO7XpeeB-hi","value":"Abläufe"}],"id":"1M2f9u2eJN2hQaqb4KN01","value":"Methode"},{"options":[{"options":[],"id":"DwItVL5-UDPXaTRYOxYx2","value":"Kein Leergut"},{"options":[],"id":"H4l3BjftUWH_nMgx8MjOp","value":"Logistik"},{"options":[],"id":"ZftKiF37tBRUQy_YfOXKX","value":"Anlieferungsqualität"}],"id":"RDfzxg1_kGGFKZx9r1a1W","value":"Material"},{"options":[{"options":[],"id":"HXvIO5ShWZ4ycPcV14VzL","value":"Qualifizierung"},{"options":[],"id":"N6cL7Ir2bosrnvg199eWq","value":"Stimmung"}],"id":"zdXsdf3Alo1yNKmVj6Utn","value":"Mensch"},{"options":[{"options":[],"id":"vpT4ubp0AoMQuHPcYSpMd","value":"Informationsfluss"},{"options":[],"id":"6AqxMDtaeQJj6pfycwS6v","value":"Äußere Einwirkungen"},{"options":[],"id":"pOe_7h8ZO37nxH-WYrleq","value":"Voller Puffer"},{"options":[],"id":"O2ixCw6xgHPteQjlU2WZr","value":"Vorgelagerter Prozess"}],"id":"XSd55W7XLc_lGdpDb4Pp3","value":"Mitwelt"}]',
      createdAt: '2023-02-21T13:20:16.358Z',
      updatedAt: '2023-07-05T14:04:03.721Z'
    },
    classificationPath: [],
    type: UnitType.productionUnit,
    speedModeCollection: [],
    teams: [],
    machineId: NIL_UUID
  }
]

describe(SideNavbarUnitList.name, () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Checks the component renders a list of clickable Grouping items', () => {
    const handleBackButton = vi.fn()
    const handleSelectUnit = vi.fn()
    const handlePrefetchUnitData = vi.fn()

    render(
      <MemoryRouter initialEntries={['/']}>
        <SideBarProvider>
          <SideNavbarUnitList
            units={units}
            unitSelected={units[0]}
            groupingSelected={grouping}
            isCollapsed={false}
            showScrollUp={false}
            showScrollDown={false}
            handleBackButton={handleBackButton}
            handleSelectUnit={handleSelectUnit}
            handlePrefetchUnitData={handlePrefetchUnitData}
          />
        </SideBarProvider>
      </MemoryRouter>
    )

    const component = screen.getByTestId('side-navbar-unit-list')
    expect(component).toBeInTheDocument() // The component is initialized and rendered
  })
})

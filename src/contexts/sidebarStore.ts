import createStore from './createStore'

interface SideBar {
  isCollapsed: boolean
  hasUnitSelected: boolean
  showGroupings: boolean
  showScrollUp: boolean
  showScrollDown: boolean
}

const { Provider: SideBarProvider, useStore } = createStore<SideBar>({
  initialState: {
    isCollapsed: false,
    hasUnitSelected: false,
    showGroupings: true,
    showScrollUp: false,
    showScrollDown: true
  }
})

export const useStoreSideBar = useStore
export default SideBarProvider

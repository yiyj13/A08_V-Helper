import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import createSelectors from './selectors'

interface State {
  profileId: number | undefined
  expandProfileFilter: boolean
}

interface Action {
  setProfileFilter: (filter?: number) => void
  toggleProfileFilter: (filter?: number) => void
  toggleExpandFilter: () => void
}

const initialState: State = {
  profileId: undefined,
  expandProfileFilter: false,
}

const Store = create<State & Action>()(
  immer((set, _get) => ({
    ...initialState,
    setProfileFilter(profileId) {
      set((state) => {
        state.profileId = profileId
      })
    },
    toggleProfileFilter(profileId) {
      set((state) => {
        state.profileId = state.profileId === profileId ? undefined : profileId
      })
    },
    toggleExpandFilter() {
      set((state) => {
        state.expandProfileFilter = !state.expandProfileFilter
      })
    },
  }))
)

export const useCalendarStore = createSelectors(Store)

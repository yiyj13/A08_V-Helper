import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import createSelectors from './selectors'

interface State {
  filter: number | string | undefined
  expandProfileFilter: boolean
}

interface Action {
  toggleProfileFilter: (filter?: number | string) => void
  toggleExpandFilter: () => void
}

const initialState: State = {
  filter: undefined,
  expandProfileFilter: true,
}

const Store = create<State & Action>()(
  immer((set, _get) => ({
    ...initialState,
    toggleProfileFilter(profileId) {
      set((state) => {
        state.filter = state.filter === profileId ? undefined : profileId
      })
    },
    toggleExpandFilter() {
      set((state) => {
        state.expandProfileFilter = !state.expandProfileFilter
      })
    },
  }))
)

export const useEnquiryStore = createSelectors(Store)

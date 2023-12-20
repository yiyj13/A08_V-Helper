import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import createSelectors from './selectors'

interface State {
  vaccineId: number | undefined
  expandVaccineFilter: boolean
}

interface Action {
  setFilter: (filter?: number) => void
  toggleFilter: (filter?: number) => void
  toggleExpandFilter: () => void
}

const initialState: State = {
  vaccineId: undefined,
  expandVaccineFilter: false
}

const Store = create<State & Action>()(
  immer((set, _get) => ({
    ...initialState,
    setFilter(filter) {
      set((state) => {
        state.vaccineId = filter
      })
    },
    toggleFilter(filter) {
      set((state) => {
        state.vaccineId = state.vaccineId === filter ? undefined : filter
      })
    },
    toggleExpandFilter() {
      set((state) => {
        state.expandVaccineFilter = !state.expandVaccineFilter
      })
    },
  }))
)

export const useCommunityStore = createSelectors(Store)

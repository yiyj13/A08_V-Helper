import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import createSelectors from './selectors'

interface State {
  vaccineId: number | undefined
}

interface Action {
  setFilter: (filter?: number) => void
  toggleFilter: (filter?: number) => void
}

const initialState: State = {
  vaccineId: undefined,
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
  }))
)

export const useCommunityStore = createSelectors(Store)

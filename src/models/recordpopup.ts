import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import createSelectors from './selectors'

interface State {
  recordId: number | undefined
  isShow: boolean
}

interface Action {
  show: (id: number) => void
  hide: () => void
}

const initialState: State = {
  recordId: undefined,
  isShow: false,
}

const popupStore = create<State & Action>()(
  immer((set, _get) => ({
    ...initialState,
    show(id) {
      set((state) => {
        state.recordId = id
        state.isShow = true
      })
    },
    hide() {
      set((state) => {
        state.isShow = false
        state.recordId = undefined
      })
    },
  }))
)

export const useRecordPopup = createSelectors(popupStore)

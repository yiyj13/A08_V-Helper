import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { setStorageSync, getStorageSync, removeStorageSync } from '@tarojs/taro'
import createSelectors from './selectors'
import { StorageSceneKey } from '../utils'
import type { Userinfo } from '../api'

interface State {
  token: string | null
  id: number | null
  isLogged: boolean
}
interface Action {
  setUserInfo: (token: Userinfo) => void
  removeUserInfo: () => void
}

const userStorage: StateStorage = {
  getItem: (key) => {
    const value = getStorageSync(key)
    return value ?? null
  },
  setItem: (key, value) => {
    setStorageSync(key, value)
  },
  removeItem: (key) => {
    removeStorageSync(key)
  },
}

const initialState: State = {
  token: null,
  id: null,
  isLogged: false,
}
const userStore = create<State & Action>()(
  immer(
    persist(
      (set, _get) => ({
        ...initialState,
        setUserInfo: (data) => set({ token: data.openId, id: data.ID, isLogged: true }),
        removeUserInfo: () => set({ token: null, id: null, isLogged: false }),
      }),
      {
        // NOTE: the name here is the unique key of the current Zustand module when caching,
        // and each Zustand module that needs to be cached must be assigned a unique key
        name: StorageSceneKey.USER,
        storage: createJSONStorage(() => userStorage),
      }
    )
  )
)

export const useUserStore = createSelectors(userStore)
export const getUserID = () => userStore.getState().id
export function useUserReset() {
  userStore.setState(initialState)
}

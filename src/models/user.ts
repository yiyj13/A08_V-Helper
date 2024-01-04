import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { setStorageSync, getStorageSync, removeStorageSync } from '@tarojs/taro'
import createSelectors from './selectors'
import type { Userinfo } from '../api'

interface State {
  token?: string
  id?: number
  openId?: string
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
  isLogged: false,
}
const userStore = create<State & Action>()(
  immer(
    persist(
      (set, _get) => ({
        ...initialState,
        setUserInfo: (data) => set({ token: data.token, id: data.ID, isLogged: true, openId: data.openId }),
        removeUserInfo: () => set({ token: undefined, id: undefined, isLogged: false, openId: undefined }),
      }),
      {
        // NOTE: the name here is the unique key of the current Zustand module when caching,
        // and each Zustand module that needs to be cached must be assigned a unique key
        name: "storage-user",
        storage: createJSONStorage(() => userStorage),
      }
    )
  )
)

export const useUserStore = createSelectors(userStore)
export const getUserID = () => userStore.getState().id
export const getToken = () => userStore.getState().token
export const getOpenID = () => userStore.getState().openId
export const resetUser = () => userStore.setState(initialState)

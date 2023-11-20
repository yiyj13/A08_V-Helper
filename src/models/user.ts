import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import {
  setStorageSync,
  getStorageSync,
  removeStorageSync,
} from "@tarojs/taro";
import createSelectors from "./selectors";
import { StorageSceneKey } from "../utils";

interface State {
  token: string;
  isLogged: boolean;
}
interface Action {
  setToken: (token: string) => void;
  removeToken: () => void;
}

const userStorage: StateStorage = {
  getItem: (key) => {
    const value = getStorageSync(key);
    return value ?? null;
  },
  setItem: (key, value) => {
    setStorageSync(key, value);
  },
  removeItem: (key) => {
    removeStorageSync(key);
  },
};

const initialState: State = {
  token: "",
  isLogged: false,
};
const userStore = create<State & Action>()(
  immer(
    persist(
      (set, _get) => ({
        token: "",
        isLogged: false,
        setToken: (token) => set({ token, isLogged: true }),
        removeToken: () => set({ token: "", isLogged: false }),
      }),
      {
        // NOTE: the name here is the unique key of the current Zustand module when caching,
        // and each Zustand module that needs to be cached must be assigned a unique key
        name: StorageSceneKey.USER,
        storage: createJSONStorage(() => userStorage),
      }
    )
  )
);

export const useUserStore = createSelectors(userStore);
export function useUserReset() {
  userStore.setState(initialState);
}

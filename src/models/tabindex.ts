import { create } from "zustand";
import createSelectors from "./selectors";

interface ITabIndexStore {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

const tabindexStore = create<ITabIndexStore>()((set) => ({
  tabIndex: 0,
  setTabIndex: (index: number) => set((_state) => ({ tabIndex: index })),
}));

export const useTabStore = createSelectors(tabindexStore);

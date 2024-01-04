import { create } from "zustand";
import createSelectors from "./selectors";

interface ITabIndexStore {
  tabIndex: number;
  setTabIndex: (index: number) => void;
  actionVisible: boolean
  setActionVisible: (visible: boolean) => void
}

const tabindexStore = create<ITabIndexStore>()((set) => ({
  tabIndex: 0,
  setTabIndex: (index: number) => set((_state) => ({ tabIndex: index })),
  actionVisible: false,
  setActionVisible: (visible: boolean) => set((_state) => ({ actionVisible: visible })),
}));

export const useTabStore = createSelectors(tabindexStore);

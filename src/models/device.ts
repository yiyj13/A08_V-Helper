import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createSelectors from "./selectors";
import Taro from "@tarojs/taro";

interface State {
  location: Taro.getLocation.SuccessCallbackResult | undefined;
}
interface Action {
  updateLocation: () => void;
}

const deviceStore = create<State & Action>()(
  immer((set, _get) => ({
    location: undefined,
    updateLocation: () => {
      Taro.getLocation({
        type: "gcj02",
        success: (res) => set((_state) => ({ location: res })),
      });
    },
  }))
);

export const useDeviceStore = createSelectors(deviceStore);

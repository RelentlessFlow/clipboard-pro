import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { produce } from 'immer';
import { ClipboardHistory } from '@electron/clipboard';
import { createSelectors } from "@/assets/createSelectors";

type State = {
  list: ClipboardHistory[];
  initialList: () => void;
};
type Store = StateCreator<
  State,
  [
    ["zustand/immer", never],
    ["zustand/devtools", unknown],
    ["zustand/subscribeWithSelector", never],
  ]
>

const createCatSlice: Store = (set) => ({
  list: [],
  initialList: async () => {
    const CLIPBOARDS = await ipc.READ_CLIPBOARD();
    set(
      produce((state) => {
        state.list = CLIPBOARDS;
      })
    );
  }
});

export const useClipboardStore = createSelectors(
  create<State>()(
    immer(
      devtools(
        subscribeWithSelector(
          createCatSlice
        ),
        {
          enabled: true,
          name: "cat store",
        }
      )
    )
  )
);
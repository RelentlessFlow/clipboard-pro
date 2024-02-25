import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { ClipboardHistory } from '@electron/clipboard';
import { createSelectors } from "@/assets/createSelectors";

type State = {
  list: ClipboardHistory[];
  loadList: () => void;
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
  loadList: async () => {
    void await ipc.LOAD_CLIPBOARD();
    const clipboardHistories = await ipc.READ_CLIPBOARD();
    console.log(clipboardHistories);
    set((state) => {
      state.list = clipboardHistories;
    })
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
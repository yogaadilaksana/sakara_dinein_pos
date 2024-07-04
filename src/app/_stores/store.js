import { create } from "zustand";

const useToggleUiStore = create((set) => ({
  isUserOpen: false,
  setIsUserOpen: () => set((state) => ({ isUserOpen: !state.isUserOpen })),
  setCloseUser: () => set({ isUserOpen: false }),

  isSideBarOpen: false,
  setIsSideBarOpen: () =>
    set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
  setCloseSideBar: () => set({ isSideBarOpen: false }),

  isModalOpen: false,
  setIsModalOpen: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  setCloseModal: () => set({ isModalOpen: false }),

  itemName: "",
  setItemName: (data) => set({ itemName: data }),
  itemQty: 0,
  setItemQty: (data) => set({ itemQty: data }),
  addItemQty: () => set((state) => ({ itemQty: state.itemQty + 1 })),
  subtractItemQty: () => set((state) => ({ itemQty: state.itemQty - 1 })),
  inputItemQty: (amount) => set({ itemQty: amount }),
}));

export default useToggleUiStore;

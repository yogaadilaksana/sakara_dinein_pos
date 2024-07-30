import { create } from "zustand";

export const useToggleUiStore = create((set) => ({
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

  selectedDate: "",
  setSelectedDate: (date) => set({ selectedDate: date }),

  isAddItemFormOpen: false,
  setIsAddItemFormOpen: () =>
    set((state) => ({
      isAddItemFormOpen: !state.isAddItemFormOpen,
      selectedItemData: [],
    })),
  setCloseAddItemForm: () => set({ isAddItemFormOpen: false }),

  selectedItemData: {},
  setSelectedItemData: (data) =>
    set({ selectedItemData: data, isAddItemFormOpen: false }),
  setCloseSelectedItem: () => set({ selectedItemData: {} }),
}));

export const useCartDineIn = create((set) => ({
  cart: [],
  setCart: (item) =>
    set((state) => {
      const itemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (itemIndex !== -1) {
        const updatedCart = state.cart.map((cartItem, index) =>
          index === itemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
        return { cart: updatedCart };
      } else {
        return { cart: [...state.cart, item] };
      }
    }),
  handleAddQty: (itemId) =>
    set((state) => {
      const sortedCart = state.cart.map((cart) =>
        cart.id === itemId ? { ...cart, quantity: cart.quantity + 1 } : cart
      );
      return { cart: sortedCart };
    }),
  handleSubtractQty: (itemId) =>
    set((state) => {
      const sortedCart = state.cart
        .map((cart) =>
          cart.id === itemId ? { ...cart, quantity: cart.quantity - 1 } : cart
        )
        .filter((cart) => cart.quantity > 0);
      return { cart: sortedCart };
    }),
}));

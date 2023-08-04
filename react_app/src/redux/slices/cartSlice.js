import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { productId, variantId, name, productName, description, productImage, price } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.variantId === variantId
      );

      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      } else {
        const newVariant = {productId, variantId, name, productName, description, productImage, price, quantity: 1 };
        state.items.push(newVariant);
      }
    },

    decreaseCart: (state, action) => {
      const variantId = action.payload.variantId;
      const itemIndex = state.items.findIndex(
        (item) => item.variantId === variantId
      );

      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },

    increaseCart: (state, action) => {
      const variantId = action.payload.variantId;
      const itemIndex = state.items.findIndex(
        (item) => item.variantId === variantId
      );

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += 1;
      } else {
        const { name, productName, description, productImage, price } = action.payload;
        const newProduct = { variantId, name, productName, description, productImage, price, quantity: 1 };
        state.items.push(newProduct);
      }
    },

    resetCart: (state) =>{
      state.items = [];
    },
  },
});

export const { addItem, decreaseCart, increaseCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;

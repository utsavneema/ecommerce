import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalAmount: 0,
  totalQuantity: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addTotal: (state, action) => {
      const { quantity, price } = action.payload;
      state.totalQuantity += quantity;
      state.totalAmount += quantity * price;
    },
  },
});

export const { addTotal } = orderSlice.actions;

export default orderSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    orderId: null,
    paymentStatus: null,
    totalAmount: null,
    paymentId: null,
  },
  reducers: {
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
    setPaymentStatus(state, action) {
      state.paymentStatus = action.payload;
    },
    setTotalAmount(state, action){
      state.totalAmount = action.payload;
    },
    setPaymentId(state, action){
      state.paymentId = action.payload;
    }
  },
});

export const { setOrderId, setPaymentStatus, setTotalAmount, setPaymentId } = paymentSlice.actions;
export default paymentSlice.reducer;

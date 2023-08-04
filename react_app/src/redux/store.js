import { configureStore}  from "@reduxjs/toolkit";
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
// import orderReducer from './slices/orderSlice'
import paymentReducer from "./slices/paymentSlice"


export const store = configureStore({
    reducer: {
            cart: cartReducer,
            user: userReducer,
            payment: paymentReducer,
            // order: orderReducer,
    }
});
// import { composeWithDevTools } from "redux-devtools-extension";
// devTools: process.env.NODE_ENV !== "production",
// devTools: composeWithDevTools        
// enhancers: [composeWithDevTools()],
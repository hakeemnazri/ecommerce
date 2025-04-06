import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
     cart: [],
     coupon: null,
     total: 0,
     subtotal: 0,
     isCouponApplied: false
    },
  reducers: {
    getCartItems: (state, action) => {
      state.cart =  action.payload ; 
    },
    addToCart: (state, action) => {
      state.cart = action.payload ; 
    },
    subtotal: (state, action) => {
      state.subtotal = action.payload ; 
    },
    total: (state, action) => {
      state.total = action.payload ; 
    },
    couponUsage: (state, action) => {
      state.coupon = action.payload ;
      state.isCouponApplied = true;
    },
    clearCart: (state) => {
      state.cart = [] ; 
      state.coupon = null;
      state.total = 0;
      state.subtotal = 0;
      state.isCouponApplied = false;
    },
    clearCoupon: (state) => {
      state.coupon = null ;
      state.isCouponApplied = false;

    },
  
},
});

export const { getCartItems, addToCart, subtotal, total, clearCart, couponUsage, clearCoupon } = cartSlice.actions;
export const selectCart = (state) => state.cart.cart;
export const selectCoupon = (state) => state.cart.coupon;
export const selectSubtotal = (state) => state.cart.subtotal;
export const selectTotal = (state) => state.cart.total;
export const selectIsCouponApplied = (state) => state.cart.isCouponApplied;

export default cartSlice.reducer;

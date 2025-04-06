import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
     products: [],
    },
  reducers: {
    createProduct: (state, action) => {
      state.products =  [...state.products, action.payload] ; 
    },
    fetchAllProduct: (state, action) => {
        state.products = action.payload ; 
    },
    fetchAllProductByCategory: (state, action) => {
      state.products = action.payload ; 
    },
    FeaturedProducts: (state, action) => {
      state.products = action.payload ; 
    },
    toggleFeaturedProduct: (state, action) => { 
    state.products.map((product) => {
        product._id === action.payload._id ? {...product, isFeatured:action.payload.isFeatured} : product
    }
    );
    }, 
},
});

export const { createProduct, fetchAllProduct, toggleFeaturedProduct, fetchAllProductByCategory } = productSlice.actions;
export const selectProducts = (state) => state.products.products;
export default productSlice.reducer;

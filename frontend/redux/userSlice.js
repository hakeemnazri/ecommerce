import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
     user: null,
    },
  reducers: {
    signup: (state, action) => {
      state.user = action.payload; 
    },
    login: (state, action) => { 
      state.user = action.payload; 
    },
    logout: (state) => { 
      state.user = null; 
    },
},
});

export const { signup, login, logout} = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;

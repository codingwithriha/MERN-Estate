import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFaliure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // New reducer to update avatar
    updateUserAvatar: (state, action) => {
      if(state.currentUser) {
        state.currentUser.avatar = action.payload;  // payload = new avatar URL
      }
    },
    updateUserStart:(state)=>{
      state.loading = true;

    },
    updateUserScuccess:(state,action) =>{
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure:(state,action) =>{
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart:(state) =>{
      state.loading= true;
    },
    deleteUserSuccess:(state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;

    },
    deleteUserFailure:(state,action) =>{
      state.payload = action.payload;
      state.loading = false;
    },
    signOutUserStart:(state) =>{
      state.loading= true;
    },
    signOutUserSuccess:(state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;

    },
    signOutUserFailure:(state,action) =>{
      state.payload = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInFaliure,
  signInSuccess,
  updateUserAvatar ,
  updateUserFailure,
  updateUserStart,
  updateUserScuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { authModalInitialState } from '../initialStates/authModalInitialState';

const authModalSlice = createSlice({
  name: 'authModal',
  initialState: authModalInitialState,
  reducers: {
    displayAuthModal: (state, action) => {
      state.showModal = action.payload; 
    }
  },
});

export const { displayAuthModal } = authModalSlice.actions;

export default authModalSlice.reducer;

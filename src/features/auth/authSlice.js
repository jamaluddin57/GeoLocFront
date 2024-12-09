import Cookies from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: Cookies.get('token') || null, // Initialize from cookies
  permissions: Cookies.get('permissions') ? JSON.parse(Cookies.get('permissions')) : [], // Parse from cookies
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action) {
      const { token, permissions } = action.payload;
      state.token = token;
      state.permissions = permissions;

      // Store in cookies
      Cookies.set('token', token, { expires: 7 }); // 7 days expiry
      Cookies.set('permissions', JSON.stringify(permissions), { expires: 7 });
    },
    clearAuthData(state) {
      state.token = null;
      state.permissions = [];

      // Remove cookies
      Cookies.remove('token');
      Cookies.remove('permissions');
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;

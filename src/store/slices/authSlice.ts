import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, signup } from '../thunks/authThunks';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
}

// Initialize state from localStorage with proper null checks
const getInitialState = (): AuthState => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!storedToken,
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      
      if (action.payload.token && action.payload.user) {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload?.token && action.payload?.user) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(signup.fulfilled, (state, action) => {
        if (action.payload?.token && action.payload?.user) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 
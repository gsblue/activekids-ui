import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { LoginRequest, SignUpRequest } from '../../types';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest) => {
        const response = await authAPI.login(credentials);
        return response.data;
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (credentials: SignUpRequest) => {
        const response = await authAPI.signup(credentials);
        return response.data;
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
); 
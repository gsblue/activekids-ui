import { createAsyncThunk } from '@reduxjs/toolkit';
import { familyAPI } from '../../services/api';

export const addChild = createAsyncThunk(
    'family/addChild',
    async (childData: { firstName: string; birthMonth: number; birthYear: number }) => {
        const response = await familyAPI.addChild(childData);
        return response.data;
    }
);

export const fetchChildren = createAsyncThunk(
    'family/fetchChildren',
    async () => {
        const response = await familyAPI.getChildren();
        return response.data;
    }
);

export const fetchCategories = createAsyncThunk(
    'family/fetchCategories',
    async () => {
        const response = await familyAPI.getCategories();
        return response.data;
    }
);

export const updateChild = createAsyncThunk(
    'family/updateChild',
    async (childData: { id: string; firstName: string; birthMonth: number; birthYear: number }) => {
        const response = await familyAPI.updateChild(childData);
        return response.data;
    }
);

export const deleteChild = createAsyncThunk(
    'family/deleteChild',
    async (childId: string) => {
        await familyAPI.deleteChild(childId);
        return childId;
    }
); 
import { createAsyncThunk } from '@reduxjs/toolkit';
import { eventAPI } from '../../services/api';
import { CreateEventRequest } from '../../types';

export const fetchEvents = createAsyncThunk(
    'family/fetchEvents',
    async () => {
        const response = await eventAPI.getEvents();
        return response.data;
    }
);

export const createEvent = createAsyncThunk(
    'family/createEvent',
    async (eventData: CreateEventRequest) => {
        const response = await eventAPI.createEvent(eventData);
        return response.data;
    }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async () => {
    const response = await eventAPI.getCategories();
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  'events/createCategory',
  async (category: { name: string; type: string; points: number }) => {
    const response = await eventAPI.createCategory(category);
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  'events/updateCategory',
  async (category: { id: string; name: string; type: string; points: number }) => {
    const response = await eventAPI.updateCategory(category.id, category);
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'events/deleteCategory',
  async (id: string) => {
    await eventAPI.deleteCategory(id);
    return id;
  }
); 
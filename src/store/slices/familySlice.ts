import { createSlice } from '@reduxjs/toolkit';
import { fetchChildren, addChild, updateChild, deleteChild, fetchFamilySummary } from '../thunks/familyThunks';
import { Child, FamilySummary } from '../../types';

interface FamilyState {
  children: Child[] | null;
  summary: FamilySummary | null;
  events: any[];
  categories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FamilyState = {
  children: null,
  summary: null,
  events: [],
  categories: [],
  loading: false,
  error: null,
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Children
    builder
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch children';
      })

    // Add Child
    builder
      .addCase(addChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChild.fulfilled, (state, action) => {
        state.loading = false;
        state.children?.push(action.payload);
      })
      .addCase(addChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add child';
      })

    // Update Child
    builder
      .addCase(updateChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChild.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.children?.findIndex(child => child.id === action.payload.id);
        if (index !== -1 && state.children && index !== undefined) {
          state.children[index] = action.payload;
        }
      })
      .addCase(updateChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update child';
      })

    // Delete Child
    builder
      .addCase(deleteChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChild.fulfilled, (state, action) => {
        state.loading = false;
        const filtered = state.children?.filter(child => child.id !== action.payload);
        state.children = filtered || null;
      })
      .addCase(deleteChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete child';
      });

    // Add new cases for summary
    builder
      .addCase(fetchFamilySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchFamilySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch summary';
      });
  },
});

export default familySlice.reducer;
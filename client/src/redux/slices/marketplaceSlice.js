import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMarketplaceItems = createAsyncThunk(
  'marketplace/fetchItems',
  async ({ page = 1, search = '', category = '' }, thunkAPI) => {
    try {
      const response = await api.get(
        `/marketplace?page=${page}&search=${search}&category=${category}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch items'
      );
    }
  }
);

export const createMarketplaceItem = createAsyncThunk(
  'marketplace/createItem',
  async (formData, thunkAPI) => {
    try {
      // Assuming formData is a normal object for now. If using images, we'd use FormData.
      const response = await api.post('/marketplace', formData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create item'
      );
    }
  }
);

export const toggleInterest = createAsyncThunk(
  'marketplace/toggleInterest',
  async ({ itemId, recipientId }, thunkAPI) => {
    try {
      const response = await api.post(`/interests`, {
        listingType: 'Marketplace',
        listingId: itemId,
        recipientId,
        message: 'I am interested in buying this item.'
      });
      return { itemId, message: response.data.message || 'Interest request sent!' };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send interest request'
      );
    }
  }
);

export const updateMarketplaceStatus = createAsyncThunk(
  'marketplace/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.patch(`/marketplace/${id}/status`, { status });
      return { id, status: response.data.data.status };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update status'
      );
    }
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    items: [],
    pagination: {},
    isLoading: false,
    isCreating: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMarketplaceItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // payload is the array
      })
      .addCase(fetchMarketplaceItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createMarketplaceItem.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createMarketplaceItem.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload); // Add new item to top
      })
      .addCase(createMarketplaceItem.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateMarketplaceStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      });
  },
});

export const { clearError } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;

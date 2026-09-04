import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRoommatePosts = createAsyncThunk(
  'roommate/fetchPosts',
  async ({ page = 1, search = '', roomType = '' }, thunkAPI) => {
    try {
      const response = await api.get(
        `/roommates?page=${page}&search=${search}&roomType=${roomType}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch posts'
      );
    }
  }
);

export const createRoommatePost = createAsyncThunk(
  'roommate/createPost',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/roommates', formData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create post'
      );
    }
  }
);

export const toggleRoommateInterest = createAsyncThunk(
  'roommate/toggleInterest',
  async ({ postId, recipientId }, thunkAPI) => {
    try {
      const response = await api.post(`/interests`, {
        listingType: 'Roommate',
        listingId: postId,
        recipientId,
        message: 'I am interested in your roommate vacancy.'
      });
      return { postId, message: response.data.message || 'Interest request sent!' };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send interest request'
      );
    }
  }
);

export const updateRoommateStatus = createAsyncThunk(
  'roommate/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.patch(`/roommates/${id}/status`, { status });
      return { id, status: response.data.data.status };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update status'
      );
    }
  }
);

const roommateSlice = createSlice({
  name: 'roommate',
  initialState: {
    posts: [],
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
      .addCase(fetchRoommatePosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoommatePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload; // payload is the array
      })
      .addCase(fetchRoommatePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createRoommatePost.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createRoommatePost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createRoommatePost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateRoommateStatus.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload.id);
        if (index !== -1) {
          state.posts[index].status = action.payload.status;
        }
      });
  },
});

export const { clearError } = roommateSlice.actions;
export default roommateSlice.reducer;

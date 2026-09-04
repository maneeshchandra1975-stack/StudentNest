import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const API_URL = '/admin';

// Analytics
export const fetchDashboardAnalytics = createAsyncThunk(
  'admin/fetchDashboardAnalytics',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/dashboard`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch analytics'
      );
    }
  }
);

// Users
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 1, search = '', status = '', role = '' }, thunkAPI) => {
    try {
      const response = await api.get(
        `${API_URL}/users?page=${page}&search=${search}&status=${status}&role=${role}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.patch(`${API_URL}/users/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update user status'
      );
    }
  }
);

// Marketplace
export const fetchMarketplaceListings = createAsyncThunk(
  'admin/fetchMarketplaceListings',
  async ({ page = 1, search = '' }, thunkAPI) => {
    try {
      const response = await api.get(
        `${API_URL}/marketplace?page=${page}&search=${search}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch listings'
      );
    }
  }
);

export const deleteMarketplaceListing = createAsyncThunk(
  'admin/deleteMarketplaceListing',
  async (id, thunkAPI) => {
    try {
      await api.delete(`${API_URL}/marketplace/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete listing'
      );
    }
  }
);

// Housing
export const fetchHousingPosts = createAsyncThunk(
  'admin/fetchHousingPosts',
  async ({ page = 1, search = '' }, thunkAPI) => {
    try {
      const response = await api.get(
        `${API_URL}/housing?page=${page}&search=${search}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch housing posts'
      );
    }
  }
);

export const deleteHousingPost = createAsyncThunk(
  'admin/deleteHousingPost',
  async (id, thunkAPI) => {
    try {
      await api.delete(`${API_URL}/housing/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete post'
      );
    }
  }
);

// Reports
export const fetchReports = createAsyncThunk(
  'admin/fetchReports',
  async ({ page = 1, status = '' }, thunkAPI) => {
    try {
      const response = await api.get(
        `${API_URL}/reports?page=${page}&status=${status}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reports'
      );
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  'admin/updateReportStatus',
  async ({ id, status, adminNote }, thunkAPI) => {
    try {
      const response = await api.patch(`${API_URL}/reports/${id}/status`, {
        status,
        adminNote,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update report'
      );
    }
  }
);

// Reviews
export const fetchReviews = createAsyncThunk(
  'admin/fetchReviews',
  async ({ page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/reviews?page=${page}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reviews'
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async (id, thunkAPI) => {
    try {
      await api.delete(`${API_URL}/reviews/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete review'
      );
    }
  }
);

const initialState = {
  analytics: null,
  users: [],
  listings: [],
  housing: [],
  reports: [],
  reviews: [],
  pagination: {
    total: 0,
    pages: 1,
    currentPage: 1,
  },
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminState: (state) => {
      state.analytics = null;
      state.users = [];
      state.listings = [];
      state.housing = [];
      state.reports = [];
      state.reviews = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Analytics
    builder.addCase(fetchDashboardAnalytics.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.analytics = action.payload;
    });
    builder.addCase(fetchDashboardAnalytics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload.users;
      state.pagination = {
        total: action.payload.total,
        pages: action.payload.pages,
        currentPage: action.payload.currentPage,
      };
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });

    // Marketplace
    builder.addCase(fetchMarketplaceListings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMarketplaceListings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.listings = action.payload.listings;
      state.pagination = {
        total: action.payload.total,
        pages: action.payload.pages,
        currentPage: action.payload.currentPage,
      };
    });
    builder.addCase(deleteMarketplaceListing.fulfilled, (state, action) => {
      state.listings = state.listings.filter((l) => l._id !== action.payload);
    });

    // Housing
    builder.addCase(fetchHousingPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchHousingPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.housing = action.payload.posts;
      state.pagination = {
        total: action.payload.total,
        pages: action.payload.pages,
        currentPage: action.payload.currentPage,
      };
    });
    builder.addCase(deleteHousingPost.fulfilled, (state, action) => {
      state.housing = state.housing.filter((p) => p._id !== action.payload);
    });

    // Reports
    builder.addCase(fetchReports.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reports = action.payload.reports;
      state.pagination = {
        total: action.payload.total,
        pages: action.payload.pages,
        currentPage: action.payload.currentPage,
      };
    });
    builder.addCase(updateReportStatus.fulfilled, (state, action) => {
      const index = state.reports.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    });

    // Reviews
    builder.addCase(fetchReviews.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload.reviews;
      state.pagination = {
        total: action.payload.total,
        pages: action.payload.pages,
        currentPage: action.payload.currentPage,
      };
    });
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
    });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;

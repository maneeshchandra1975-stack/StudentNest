import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/notifications');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications.');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/notifications/unread-count');
      return res.data.data.unreadCount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch unread count.');
    }
  }
);

export const markAsReadApi = createAsyncThunk(
  'notifications/markAsReadApi',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark notification as read.');
    }
  }
);

export const markAllAsReadApi = createAsyncThunk(
  'notifications/markAllAsReadApi',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch('/notifications/read-all');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read.');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    addRealtimeNotification: (state, action) => {
      const exists = state.notifications.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark As Read
      .addCase(markAsReadApi.fulfilled, (state, action) => {
        const updated = action.payload.notification;
        const index = state.notifications.findIndex((n) => n._id === updated._id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
        }
        state.unreadCount = action.payload.unreadCount;
      })

      // Mark All As Read
      .addCase(markAllAsReadApi.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { addRealtimeNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;

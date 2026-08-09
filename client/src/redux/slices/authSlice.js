import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Initial State ──────────────────────────────────────────────
const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  isInitializing: !!localStorage.getItem('accessToken'), // only true if token exists initially
  error: null,
  otpEmail: sessionStorage.getItem('otpEmail') || null, // email waiting for OTP verification
};

// ── Async Thunks ───────────────────────────────────────────────

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'OTP Verification failed.'
      );
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to resend OTP.'
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Invalid credentials.'
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send reset code.'
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to reset password.'
      );
    }
  }
);

// Fetch Current User (/me)
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Session expired.'
      );
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (err) {
      // Even if API fails, clear local state
      return true;
    }
  }
);

// ── Auth Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOtpEmail: (state, action) => {
      state.otpEmail = action.payload;
      if (action.payload) {
        sessionStorage.setItem('otpEmail', action.payload);
      } else {
        sessionStorage.removeItem('otpEmail');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    localLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.otpEmail = null;
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('otpEmail');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpEmail = action.payload.data.email;
        sessionStorage.setItem('otpEmail', action.payload.data.email);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.otpEmail = null;
        sessionStorage.removeItem('otpEmail');
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitializing = false;
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.data.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Me
      .addCase(fetchMe.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isInitializing = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.otpEmail = null;
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('otpEmail');
      });
  },
});

export const { setOtpEmail, clearError, localLogout } = authSlice.actions;
export default authSlice.reducer;

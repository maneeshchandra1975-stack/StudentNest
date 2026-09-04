import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import roommateReducer from './slices/roommateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    marketplace: marketplaceReducer,
    roommate: roommateReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

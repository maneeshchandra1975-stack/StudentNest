import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/conversations');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations.');
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'chat/fetchConversationById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/conversations/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Chat is not available for this interaction.');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages.');
    }
  }
);

export const sendMessageApi = createAsyncThunk(
  'chat/sendMessageApi',
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/conversations/${conversationId}/messages`, { text });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message.');
    }
  }
);

export const fetchOrCreateByInterest = createAsyncThunk(
  'chat/fetchOrCreateByInterest',
  async (interestRequestId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/conversations/by-interest/${interestRequestId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Chat is not available for this interaction.');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    activeConversation: null,
    messages: [],
    isLoadingConversations: false,
    isLoadingMessages: false,
    isSending: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      state.error = null;
    },
    addMessage: (state, action) => {
      // Avoid duplicate messages
      const exists = state.messages.some((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
      // Update last message in list if active
      if (state.activeConversation && state.activeConversation._id === action.payload.conversation) {
        state.activeConversation.lastMessage = action.payload.text;
        state.activeConversation.lastMessageAt = action.payload.createdAt;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
        if (!state.activeConversation && action.payload.length > 0) {
          state.activeConversation = action.payload[0];
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = action.payload;
      })

      // Fetch Conversation By Id
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
        state.error = null;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload;
      })

      // Send Message API
      .addCase(sendMessageApi.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessageApi.fulfilled, (state, action) => {
        state.isSending = false;
        const exists = state.messages.some((m) => m._id === action.payload._id);
        if (!exists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessageApi.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })

      // Fetch Or Create By Interest
      .addCase(fetchOrCreateByInterest.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
        const exists = state.conversations.some((c) => c._id === action.payload._id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchOrCreateByInterest.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setActiveConversation, addMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;

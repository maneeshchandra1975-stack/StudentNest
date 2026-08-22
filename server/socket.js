'use strict';

const { Server }       = require('socket.io');
const jwt              = require('jsonwebtoken');
const User             = require('./models/User.model');
const Conversation     = require('./models/Conversation.model');
const Message          = require('./models/Message.model');
const InterestRequest  = require('./models/InterestRequest.model');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5174',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware: Authenticate socket connection via JWT
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Authentication failed: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET CONNECTED] User ${socket.user.name} (${socket.user._id}) connected.`);

    // Join conversation room with strict authorization check
    socket.on('join_conversation', async ({ conversationId }, callback) => {
      try {
        const conversation = await Conversation.findById(conversationId).populate('interestRequest');
        if (!conversation) {
          if (callback) callback({ success: false, message: 'Conversation not found' });
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === socket.user._id.toString()
        );
        if (!isParticipant) {
          if (callback) callback({ success: false, message: 'Unauthorized access' });
          return;
        }

        if (!conversation.interestRequest || conversation.interestRequest.status !== 'Accepted') {
          if (callback) callback({ success: false, message: 'Chat is not available for this interaction.' });
          return;
        }

        const roomName = `conversation_${conversationId}`;
        socket.join(roomName);
        console.log(`[SOCKET ROOM] ${socket.user.name} joined room ${roomName}`);

        if (callback) callback({ success: true, roomName });
      } catch (err) {
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`[SOCKET ROOM] ${socket.user.name} left room conversation_${conversationId}`);
    });

    // Real-time message sending with backend authorization check
    socket.on('send_message', async ({ conversationId, text, messageType, imageUrl }, callback) => {
      try {
        if (!text || !text.trim()) {
          if (callback) callback({ success: false, message: 'Text required' });
          return;
        }

        const conversation = await Conversation.findById(conversationId).populate('interestRequest');
        if (!conversation) {
          if (callback) callback({ success: false, message: 'Conversation not found' });
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === socket.user._id.toString()
        );
        if (!isParticipant) {
          if (callback) callback({ success: false, message: 'Unauthorized' });
          return;
        }

        if (!conversation.interestRequest || conversation.interestRequest.status !== 'Accepted') {
          if (callback) callback({ success: false, message: 'Chat is not available for this interaction.' });
          return;
        }

        // 1. Save message to MongoDB
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          text: text.trim(),
          messageType: messageType || 'text',
          imageUrl: imageUrl || '',
        });

        // 2. Update conversation last message metadata
        conversation.lastMessage = text.trim();
        conversation.lastMessageSender = socket.user._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(message._id).populate('sender', 'name email avatar');

        // 3. Broadcast to all users in the conversation room
        const roomName = `conversation_${conversationId}`;
        io.to(roomName).emit('receive_message', populatedMessage);

        if (callback) callback({ success: true, message: populatedMessage });
      } catch (err) {
        console.error('[SOCKET SEND MESSAGE ERROR]', err);
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.user._id,
        name: socket.user.name,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[SOCKET DISCONNECTED] User ${socket.user.name} disconnected.`);
    });
  });

  return io;
};

module.exports = setupSocket;

import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (socket && socket.connected) {
    return socket; // already connected, don't duplicate
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io('http://localhost:5000', {
    auth: {
      token: token || localStorage.getItem('accessToken'),
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[CLIENT SOCKET] Connected successfully. Socket ID:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.warn('[CLIENT SOCKET ERROR]', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // --- Music Rooms ---
    socket.on('join_room', (roomId: string, username: string) => {
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', { username, timestamp: new Date() });
      console.log(`${username} joined room ${roomId}`);
    });

    socket.on('leave_room', (roomId: string, username: string) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', { username, timestamp: new Date() });
      console.log(`${username} left room ${roomId}`);
    });

    socket.on('send_message', (roomId: string, messageData: any) => {
      // messageData should contain { username, text, timestamp }
      io.to(roomId).emit('receive_message', messageData);
    });

    // --- Party Mode / Queue Syncing (Placeholder for next phase) ---
    socket.on('sync_queue', (roomId: string, queue: any[]) => {
      socket.to(roomId).emit('queue_updated', queue);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

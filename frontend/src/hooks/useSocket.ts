import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface UseSocketOptions {
  token?: string;
  enabled?: boolean;
}

export const useSocket = ({ token, enabled = true }: UseSocketOptions = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!enabled || !token) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, enabled]);

  const send = useCallback(
    (event: string, data: any) => {
      if (socket?.connected) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket?.connected) {
        socket.emit('join', { roomId });
      }
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      if (socket?.connected) {
        socket.emit('leave', { roomId });
      }
    },
    [socket]
  );

  return {
    socket,
    connected,
    messages,
    send,
    joinRoom,
    leaveRoom,
  };
};

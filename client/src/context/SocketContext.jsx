import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [latestEvent, setLatestEvent] = useState(null);

  useEffect(() => {
    const newSocket = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('workout:new', (data) => {
      setLatestEvent({ type: 'workout:new', data, timestamp: Date.now() });
    });

    newSocket.on('workout:kudos', (data) => {
      setLatestEvent({ type: 'workout:kudos', data, timestamp: Date.now() });
    });

    newSocket.on('leaderboard:update', (data) => {
      setLatestEvent({ type: 'leaderboard:update', data, timestamp: Date.now() });
    });

    newSocket.on('raid:cheered', (data) => {
      setLatestEvent({ type: 'raid:cheered', data, timestamp: Date.now() });
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, latestEvent }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

// SocketContext.jsx update
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useSelector(state => state.user); // Redux se user lo

  useEffect(() => {
    if (userData?._id) {
      const newSocket = io("http://localhost:8090", { withCredentials: true });
      
      newSocket.on('connect', () => {
        newSocket.emit('identity', { userId: userData._id });
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [userData?._id]); // Jab user login/logout ho tabhi chale

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(import.meta.env.VITE_API_BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// IMPORTANT: Don't throw error on null socket; return null instead
export const useSocket = () => {
  return useContext(SocketContext);
};

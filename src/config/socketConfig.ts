import { io, Socket } from "socket.io-client";

// Replace with your backend URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let socket: Socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL);
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initializeSocket first.");
  }
  return socket;
};

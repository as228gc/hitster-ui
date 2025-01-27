import { io, Socket } from "socket.io-client";

// Replace with your backend URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let socket: Socket | null = null;

export const initializeSocket = (): Promise<Socket> => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket?.id);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("WebSocket disconnected:", reason);
      if (reason === "io server disconnect") {
        socket?.connect();
      }
    });

    socket.on("connect_error", (error: Error) => {
      console.error("WebSocket connection error:", error);
    });
  }

  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      resolve(socket);
    } else {
      socket?.once("connect", () => resolve(socket!));
      socket?.once("connect_error", (error) => reject(error));
    }
  });
};


export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    console.log("WebSocket disconnected");
    socket = null; // Reset the socket variable
  }
};

import { io, Socket } from "socket.io-client";

// Replace with your backend URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket"], // Use WebSocket transport
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Retry connection 5 times
      reconnectionDelay: 1000, // Start with a 1-second delay between retries
      timeout: 5000, // Connection timeout in milliseconds
    });

    // Log connection events
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Reconnect manually if the server disconnected the client
        socket?.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }
  return socket;
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

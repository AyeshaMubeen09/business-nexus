import { io, Socket } from "socket.io-client";

/* ==========================================
   SOCKET INSTANCE
========================================== */

const SOCKET_URL = "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});
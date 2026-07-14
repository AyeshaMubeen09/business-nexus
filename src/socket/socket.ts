import { io, Socket } from "socket.io-client";

/* ==========================================
   SOCKET INSTANCE
========================================== */

const SOCKET_URL = "https://business-nexus-production-88ff.up.railway.app";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});
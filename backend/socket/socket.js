/* ==========================================
   SOCKET HANDLERS
========================================== */

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    /* ==========================================
       JOIN ROOM
    ========================================== */

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      console.log(`${socket.id} joined room ${roomId}`);

      const clients =
        io.sockets.adapter.rooms.get(roomId);

      if (!clients) return;

      // Only when exactly two participants are present
      if (clients.size === 2) {
        const firstSocketId = [...clients].find(
          (id) => id !== socket.id
        );

        if (firstSocketId) {
          io.to(firstSocketId).emit(
            "create-offer"
          );
        }

        socket.emit("waiting-for-offer");
      }
    });

    /* ==========================================
       WEBRTC OFFER
    ========================================== */

    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", {
        offer,
      });
    });

    /* ==========================================
       WEBRTC ANSWER
    ========================================== */

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", {
        answer,
      });
    });

    /* ==========================================
       ICE CANDIDATE
    ========================================== */

    socket.on(
      "ice-candidate",
      ({ roomId, candidate }) => {
        socket.to(roomId).emit(
          "ice-candidate",
          {
            candidate,
          }
        );
      }
    );

    /* ==========================================
       AUDIO TOGGLE
    ========================================== */

    socket.on(
      "toggle-audio",
      ({ roomId, enabled }) => {
        socket.to(roomId).emit(
          "remote-audio-toggle",
          enabled
        );
      }
    );

    /* ==========================================
       VIDEO TOGGLE
    ========================================== */

    socket.on(
      "toggle-video",
      ({ roomId, enabled }) => {
        socket.to(roomId).emit(
          "remote-video-toggle",
          enabled
        );
      }
    );

    /* ==========================================
       LEAVE ROOM
    ========================================== */

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);

      socket.to(roomId).emit("user-left", {
        socketId: socket.id,
      });
    });

    /* ==========================================
       DISCONNECT
    ========================================== */

    socket.on("disconnect", () => {
      console.log(
        `Socket Disconnected: ${socket.id}`
      );
    });
  });
};

module.exports = initializeSocket;
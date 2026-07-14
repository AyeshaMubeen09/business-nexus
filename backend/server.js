const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const initializeSocket = require("./socket/socket");
const documentRoutes = require("./routes/documentRoutes");
const path = require("path");

require("dotenv").config();

const app = express();

/* ==========================================
   HTTP SERVER
========================================== */

const server = http.createServer(app);

/* ==========================================
   SOCKET.IO
========================================== */

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* ==========================================
   SOCKET CONNECTION
========================================== */

initializeSocket(io);

/* ==========================================
   MIDDLEWARE
========================================== */

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ==========================================
   ROUTES
========================================== */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/documents", documentRoutes);

/* ==========================================
   TEST ROUTE
========================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nexus Backend is Running 🚀",
  });
});

/* ==========================================
   DATABASE
========================================== */

connectDB();

/* ==========================================
   SERVER
========================================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const readingRoutes = require("./routes/readingRoutes");
const alertRoutes = require("./routes/alertRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const wardRoutes = require("./routes/wardRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");


// Socket handler
const { initializeSocket } = require("./sockets/socketHandler");

const app = express();

// ==========================
// Connect MongoDB
// ==========================
connectDB();

// ==========================
// Middleware
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ==========================
// API Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/devices", require("./routes/deviceRoutes"));
app.use("/api/nurses", require("./routes/nurseRoutes"));
app.use("/api/users", userRoutes);

// ==========================
// Health Route
// ==========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart IV Drip Backend Running...",
  });
});

// ==========================
// Create HTTP Server
// ==========================
const server = http.createServer(app);

// ==========================
// Socket.IO Setup
// ==========================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Initialize socket connection handler
initializeSocket(io);

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

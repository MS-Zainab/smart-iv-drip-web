const express = require("express");
const router = express.Router();

const {
  createSession,
  getAllSessions,
  getSessionById,
} = require("../controllers/sessionController");

const { protect } = require("../middleware/authMiddleware");

// All session routes require login
router.use(protect);

// Create session
router.post("/", createSession);

// Get all sessions
router.get("/", getAllSessions);

// Get single session
router.get("/:id", getSessionById);

module.exports = router;
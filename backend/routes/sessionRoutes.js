const express = require("express");
const router = express.Router();

const {
  getAllSessions,
  getSessionById,
} = require("../controllers/sessionController");

const { protect } = require("../middleware/authMiddleware");

// All session routes require login
router.use(protect);

// GET all sessions
router.get("/", getAllSessions);

// GET single session
router.get("/:id", getSessionById);

module.exports = router;
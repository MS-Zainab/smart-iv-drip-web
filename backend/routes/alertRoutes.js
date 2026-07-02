const express = require("express");
const router = express.Router();

const {
  getAlerts,
  resolveAlert,
  acknowledgeAlert,
} = require("../controllers/alertController");

const { protect } = require("../middleware/authMiddleware");

// Protect all alert routes
router.use(protect);

// Get all alerts with filters
router.get("/", getAlerts);

// Resolve alert
router.put("/:id/resolve", resolveAlert);

// Acknowledge alert (placeholder)
router.put("/:id/acknowledge", acknowledgeAlert);

module.exports = router;
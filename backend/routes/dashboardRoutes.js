const express = require("express");
const router = express.Router();

const { getDashboardSummary } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// Protect dashboard route
router.use(protect);

// GET /api/dashboard
router.get("/", getDashboardSummary);

module.exports = router;
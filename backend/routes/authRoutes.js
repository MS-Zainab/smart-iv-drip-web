const express = require("express");
const router = express.Router();

const {
  login,
  verifyToken,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public Route
router.post("/login", login);

// Protected Route
router.get("/verify", protect, verifyToken);

module.exports = router;
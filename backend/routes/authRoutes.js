const express = require("express");
const router = express.Router();

const {
  login,
  verifyToken,
  resetAdminPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/verify", protect, verifyToken);

// TEMP route for fixing admin password
router.post("/reset-admin-password", resetAdminPassword);

module.exports = router;
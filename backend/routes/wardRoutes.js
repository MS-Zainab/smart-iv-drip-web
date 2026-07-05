const express = require("express");
const router = express.Router();

const {
  createWard,
  getAllWards,
  getWardById,
  updateWard,
  deactivateWard,
} = require("../controllers/wardController");

const { protect } = require("../middleware/authMiddleware");

// Protect all ward routes
router.use(protect);

// Ward CRUD
router.post("/", createWard);
router.get("/", getAllWards);
router.get("/:id", getWardById);
router.put("/:id", updateWard);
router.put("/:id/deactivate", deactivateWard);

module.exports = router;
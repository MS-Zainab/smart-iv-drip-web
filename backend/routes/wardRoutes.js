const express = require("express");
const router = express.Router();

const {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  deleteWard,
} = require("../controllers/wardController");

const { protect } = require("../middleware/authMiddleware");

// All ward routes protected
router.use(protect);

// IMPORTANT: only these routes
router.get("/", getAllWards);
router.get("/:id", getWardById);
router.post("/", createWard);
router.put("/:id", updateWard);
router.delete("/:id", deleteWard);

module.exports = router;
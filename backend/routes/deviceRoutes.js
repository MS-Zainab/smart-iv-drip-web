const express = require("express");

const router = express.Router();

const {
  registerDevice,
  getAllDevices,
  getDeviceById,
  forceReconnect,
  unassignDevice,
} = require("../controllers/deviceController");

const { protect } = require("../middleware/authMiddleware");

// All routes require login
router.use(protect);

// ==========================
// Device CRUD / Views
// ==========================
router.post("/", registerDevice);
router.get("/", getAllDevices);
router.get("/:id", getDeviceById);

// ==========================
// Device Actions
// ==========================
router.post("/:id/reconnect", forceReconnect);
router.post("/:id/unassign", unassignDevice);

module.exports = router;
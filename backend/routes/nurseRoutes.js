const express = require("express");
const router = express.Router();

const {
  createNurse,
  getAllNurses,
  getNurseById,
  updateNurse,
  deactivateNurse,
  assignPatientsToNurse,
} = require("../controllers/nurseController");

const { protect } = require("../middleware/authMiddleware");

// Protect all nurse routes
router.use(protect);

// Nurse CRUD + management
router.post("/", createNurse);
router.get("/", getAllNurses);
router.get("/:id", getNurseById);
router.put("/:id", updateNurse);
router.put("/:id/deactivate", deactivateNurse);
router.put("/:id/assign-patients", assignPatientsToNurse);

module.exports = router;
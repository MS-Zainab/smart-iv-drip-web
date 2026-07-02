const express = require("express");

const router = express.Router();

const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  startIVSession,
  endIVSession,
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");

// ==========================
// All routes require login
// ==========================
router.use(protect);

// ==========================
// Patient CRUD
// ==========================
router.get("/", getAllPatients);

router.get("/:id", getPatientById);

router.post("/", createPatient);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

// ==========================
// IV Session Routes
// ==========================
router.post("/:id/start-session", startIVSession);

router.post("/:id/end-session", endIVSession);

module.exports = router;
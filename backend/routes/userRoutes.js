const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors,
  getNurses,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// all user routes protected
router.use(protect);

// special dropdown routes
router.get("/doctors", getDoctors);
router.get("/nurses", getNurses);

// CRUD routes
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
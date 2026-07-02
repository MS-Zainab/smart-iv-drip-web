const express = require("express");

const router = express.Router();

const { receiveReading } = require("../controllers/readingController");

// No auth middleware here
// This route is used by ESP32 / hardware
router.post("/", receiveReading);

module.exports = router;
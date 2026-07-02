const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    deviceName: {
      type: String,
      default: "Smart IV Monitor",
      trim: true,
      maxlength: 100,
    },

    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },

    assignedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    firmwareVersion: {
      type: String,
      default: "1.0.0",
      trim: true,
    },

    batteryLevel: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    connectivity: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
      index: true,
    },

    deviceStatus: {
      type: String,
      enum: [
        "Available",
        "Assigned",
        "Running",
        "Maintenance",
        "Faulty",
      ],
      default: "Available",
      index: true,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    calibrationDate: {
      type: Date,
      default: null,
    },

    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ---------- Indexes ---------- */

deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ serialNumber: 1 });
deviceSchema.index({ assignedPatient: 1 });
deviceSchema.index({ ward: 1 });
deviceSchema.index({ lastSeen: -1 });

module.exports = mongoose.model("Device", deviceSchema);
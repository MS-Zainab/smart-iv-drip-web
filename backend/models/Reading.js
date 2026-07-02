const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    dripRate: {
      type: Number,
      required: true,
      min: 0,
    },

    flowRate: {
      type: Number,
      required: true,
      min: 0,
    },

    bottleLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    batteryLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    signalStrength: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    temperature: {
      type: Number,
      default: 25,
      min: -20,
      max: 80,
    },

    aiRiskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    anomalyDetected: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ---------- Indexes ---------- */

readingSchema.index({ session: 1 });
readingSchema.index({ patient: 1 });
readingSchema.index({ device: 1 });
readingSchema.index({ timestamp: -1 });
readingSchema.index({ patient: 1, timestamp: -1 });
readingSchema.index({ device: 1, timestamp: -1 });

module.exports = mongoose.model("Reading", readingSchema);
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    reading: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reading",
      default: null,
    },

    alertType: {
      type: String,
      enum: [
        "Low Bottle",
        "Bottle Empty",
        "High Flow Rate",
        "Low Flow Rate",
        "Device Offline",
        "Battery Low",
        "Occlusion",
        "Air Bubble",
        "Patient Emergency",
        "AI Warning",
        "Other",
      ],
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isResolved: {
      type: Boolean,
      default: false,
      index: true,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
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

alertSchema.index({ alertId: 1 });
alertSchema.index({ patient: 1 });
alertSchema.index({ device: 1 });
alertSchema.index({ session: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Alert", alertSchema);
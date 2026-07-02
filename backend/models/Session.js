const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
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
      index: true,
    },

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },

    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    medicineName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    prescribedVolume: {
      type: Number,
      required: true,
      min: 0,
    },

    infusedVolume: {
      type: Number,
      default: 0,
      min: 0,
    },

    flowRate: {
      type: Number,
      required: true,
      min: 0,
    },

    dripFactor: {
      type: Number,
      default: 20,
      min: 1,
    },

    expectedDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default: null,
    },

    sessionStatus: {
      type: String,
      enum: [
        "Running",
        "Paused",
        "Completed",
        "Cancelled",
      ],
      default: "Running",
      index: true,
    },

    remarks: {
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

sessionSchema.index({ sessionId: 1 });
sessionSchema.index({ patient: 1 });
sessionSchema.index({ device: 1 });
sessionSchema.index({ nurse: 1 });
sessionSchema.index({ sessionStatus: 1 });
sessionSchema.index({ startTime: -1 });
sessionSchema.index({ patient: 1, sessionStatus: 1 });
sessionSchema.index({ device: 1, sessionStatus: 1 });

module.exports = mongoose.model("Session", sessionSchema);
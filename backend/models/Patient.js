const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    diagnosis: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    allergies: {
      type: [String],
      default: [],
    },

    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },

    bedNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedNurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },

      relation: {
        type: String,
        default: "",
        trim: true,
        maxlength: 50,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },
    },

    ivStatus: {
      type: String,
      enum: ["Running", "Stopped", "Completed"],
      default: "Stopped",
      index: true,
    },

    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Critical"],
      default: "Admitted",
      index: true,
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

patientSchema.index({ patientId: 1 });
patientSchema.index({ fullName: 1 });
patientSchema.index({ ward: 1 });
patientSchema.index({ assignedDoctor: 1 });
patientSchema.index({ assignedNurse: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Patient", patientSchema);
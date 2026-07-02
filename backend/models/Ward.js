const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema(
  {
    wardName: {
      type: String,
      required: [true, "Ward name is required"],
      trim: true,
      unique: true,
      maxlength: 100,
    },

    wardCode: {
      type: String,
      required: [true, "Ward code is required"],
      trim: true,
      unique: true,
      uppercase: true,
      maxlength: 20,
    },

    floor: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    currentPatients: {
      type: Number,
      default: 0,
      min: 0,
    },

    nurseInCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    wardType: {
      type: String,
      enum: [
        "General",
        "ICU",
        "Emergency",
        "Pediatrics",
        "Surgery",
        "Maternity",
      ],
      default: "General",
      index: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ---------- Indexes ---------- */

wardSchema.index({ wardCode: 1 });
wardSchema.index({ wardName: 1 });
wardSchema.index({ wardType: 1 });
wardSchema.index({ status: 1 });
wardSchema.index({ nurseInCharge: 1 });

module.exports = mongoose.model("Ward", wardSchema);
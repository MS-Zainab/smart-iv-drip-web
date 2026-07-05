const Ward = require("../models/Ward");
const Patient = require("../models/Patient");
const User = require("../models/User");

/**
 * ==========================
 * Create Ward
 * POST /api/wards
 * ==========================
 */
const createWard = async (req, res) => {
  try {
    const {
      wardName,
      wardCode,
      floor,
      capacity,
      nurseInCharge,
      wardType,
      status,
      notes,
    } = req.body;

    if (!wardName || !wardCode || floor === undefined || !capacity) {
      return res.status(400).json({
        success: false,
        message: "wardName, wardCode, floor and capacity are required.",
      });
    }

    // Duplicate ward name
    const existingWardName = await Ward.findOne({ wardName: wardName.trim() });
    if (existingWardName) {
      return res.status(400).json({
        success: false,
        message: "Ward name already exists.",
      });
    }

    // Duplicate ward code
    const existingWardCode = await Ward.findOne({
      wardCode: wardCode.trim().toUpperCase(),
    });
    if (existingWardCode) {
      return res.status(400).json({
        success: false,
        message: "Ward code already exists.",
      });
    }

    // Validate nurse if provided
    if (nurseInCharge) {
      const nurse = await User.findById(nurseInCharge);
      if (!nurse || nurse.role !== "Nurse") {
        return res.status(400).json({
          success: false,
          message: "Invalid nurse selected for nurseInCharge.",
        });
      }
    }

    const ward = await Ward.create({
      wardName: wardName.trim(),
      wardCode: wardCode.trim().toUpperCase(),
      floor,
      capacity,
      currentPatients: 0,
      nurseInCharge: nurseInCharge || null,
      wardType: wardType || "General",
      status: status || "Active",
      notes: notes || "",
    });

    const populatedWard = await Ward.findById(ward._id).populate(
      "nurseInCharge",
      "fullName email employeeId"
    );

    res.status(201).json({
      success: true,
      message: "Ward created successfully.",
      data: populatedWard,
    });
  } catch (error) {
    console.error("Create Ward Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get All Wards
 * GET /api/wards
 * ==========================
 */
const getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find()
      .populate("nurseInCharge", "fullName email employeeId")
      .sort({ createdAt: -1 });

    const wardsWithDetails = await Promise.all(
      wards.map(async (ward) => {
        const patients = await Patient.find({
          ward: ward._id,
          status: { $ne: "Discharged" },
        })
          .select("patientId fullName bedNumber status ivStatus")
          .populate("assignedNurse", "fullName");

        return {
          ...ward.toObject(),
          currentPatients: patients.length,
          availableBeds: ward.capacity - patients.length,
          occupancyPercentage:
            ward.capacity > 0
              ? Math.round((patients.length / ward.capacity) * 100)
              : 0,
          patients,
        };
      })
    );

    res.status(200).json({
      success: true,
      total: wardsWithDetails.length,
      data: wardsWithDetails,
    });
  } catch (error) {
    console.error("Get Wards Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get Single Ward
 * GET /api/wards/:id
 * ==========================
 */
const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id).populate(
      "nurseInCharge",
      "fullName email employeeId phone"
    );

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    const patients = await Patient.find({
      ward: ward._id,
      status: { $ne: "Discharged" },
    })
      .populate("assignedDoctor", "fullName email")
      .populate("assignedNurse", "fullName email")
      .select("-__v");

    res.status(200).json({
      success: true,
      data: {
        ward: {
          ...ward.toObject(),
          currentPatients: patients.length,
          availableBeds: ward.capacity - patients.length,
          occupancyPercentage:
            ward.capacity > 0
              ? Math.round((patients.length / ward.capacity) * 100)
              : 0,
        },
        patients,
      },
    });
  } catch (error) {
    console.error("Get Ward Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Update Ward
 * PUT /api/wards/:id
 * ==========================
 */
const updateWard = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    const {
      wardName,
      wardCode,
      floor,
      capacity,
      nurseInCharge,
      wardType,
      status,
      notes,
    } = req.body;

    // Duplicate ward name check
    if (wardName && wardName.trim() !== ward.wardName) {
      const existingWardName = await Ward.findOne({
        wardName: wardName.trim(),
      });
      if (existingWardName) {
        return res.status(400).json({
          success: false,
          message: "Ward name already exists.",
        });
      }
      ward.wardName = wardName.trim();
    }

    // Duplicate ward code check
    if (wardCode && wardCode.trim().toUpperCase() !== ward.wardCode) {
      const existingWardCode = await Ward.findOne({
        wardCode: wardCode.trim().toUpperCase(),
      });
      if (existingWardCode) {
        return res.status(400).json({
          success: false,
          message: "Ward code already exists.",
        });
      }
      ward.wardCode = wardCode.trim().toUpperCase();
    }

    // Validate nurse
    if (nurseInCharge !== undefined) {
      if (nurseInCharge) {
        const nurse = await User.findById(nurseInCharge);
        if (!nurse || nurse.role !== "Nurse") {
          return res.status(400).json({
            success: false,
            message: "Invalid nurse selected for nurseInCharge.",
          });
        }
        ward.nurseInCharge = nurseInCharge;
      } else {
        ward.nurseInCharge = null;
      }
    }

    if (floor !== undefined) ward.floor = floor;
    if (capacity !== undefined) ward.capacity = capacity;
    if (wardType !== undefined) ward.wardType = wardType;
    if (status !== undefined) ward.status = status;
    if (notes !== undefined) ward.notes = notes;

    await ward.save();

    const updatedWard = await Ward.findById(ward._id).populate(
      "nurseInCharge",
      "fullName email employeeId"
    );

    res.status(200).json({
      success: true,
      message: "Ward updated successfully.",
      data: updatedWard,
    });
  } catch (error) {
    console.error("Update Ward Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Deactivate Ward
 * PUT /api/wards/:id/deactivate
 * ==========================
 */
const deactivateWard = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    ward.status = "Inactive";
    await ward.save();

    res.status(200).json({
      success: true,
      message: "Ward deactivated successfully.",
      data: {
        _id: ward._id,
        wardName: ward.wardName,
        status: ward.status,
      },
    });
  } catch (error) {
    console.error("Deactivate Ward Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createWard,
  getAllWards,
  getWardById,
  updateWard,
  deactivateWard,
};
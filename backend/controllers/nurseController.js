const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Patient = require("../models/Patient");

/**
 * ==========================
 * Create Nurse
 * POST /api/nurses
 * ==========================
 */
const createNurse = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      employeeId,
      department,
      profileImage,
    } = req.body;

    if (!fullName || !email || !password || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password and employeeId are required.",
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Check existing employeeId
    const existingEmployee = await User.findOne({
      employeeId: employeeId.toUpperCase(),
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const nurse = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      employeeId: employeeId.toUpperCase(),
      role: "Nurse",
      department: department || "Nursing",
      profileImage: profileImage || "",
      isActive: true,
    });

    const nurseResponse = {
      _id: nurse._id,
      fullName: nurse.fullName,
      email: nurse.email,
      phone: nurse.phone,
      employeeId: nurse.employeeId,
      role: nurse.role,
      department: nurse.department,
      profileImage: nurse.profileImage,
      isActive: nurse.isActive,
      createdAt: nurse.createdAt,
      updatedAt: nurse.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "Nurse created successfully.",
      data: nurseResponse,
    });
  } catch (error) {
    console.error("Create Nurse Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get All Nurses
 * GET /api/nurses
 * ==========================
 */
const getAllNurses = async (req, res) => {
  try {
    const nurses = await User.find({ role: "Nurse" })
      .select("-password")
      .sort({ createdAt: -1 });

    const nursesWithPatients = await Promise.all(
      nurses.map(async (nurse) => {
        const assignedPatients = await Patient.find({
          assignedNurse: nurse._id,
          status: { $ne: "Discharged" },
        })
          .select("patientId fullName bedNumber ivStatus status")
          .populate("ward", "wardName wardCode");

        return {
          ...nurse.toObject(),
          assignedPatientsCount: assignedPatients.length,
          assignedPatients,
        };
      })
    );

    res.status(200).json({
      success: true,
      total: nursesWithPatients.length,
      data: nursesWithPatients,
    });
  } catch (error) {
    console.error("Get Nurses Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get Single Nurse
 * GET /api/nurses/:id
 * ==========================
 */
const getNurseById = async (req, res) => {
  try {
    const nurse = await User.findOne({
      _id: req.params.id,
      role: "Nurse",
    }).select("-password");

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found.",
      });
    }

    const assignedPatients = await Patient.find({
      assignedNurse: nurse._id,
      status: { $ne: "Discharged" },
    })
      .populate("ward", "wardName wardCode")
      .populate("assignedDoctor", "fullName email")
      .select("-__v");

    res.status(200).json({
      success: true,
      data: {
        nurse,
        assignedPatientsCount: assignedPatients.length,
        assignedPatients,
      },
    });
  } catch (error) {
    console.error("Get Nurse Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Update Nurse
 * PUT /api/nurses/:id
 * ==========================
 */
const updateNurse = async (req, res) => {
  try {
    const nurse = await User.findOne({
      _id: req.params.id,
      role: "Nurse",
    });

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found.",
      });
    }

    const { fullName, email, phone, employeeId, department, profileImage, isActive } =
      req.body;

    // Check duplicate email if changed
    if (email && email.toLowerCase() !== nurse.email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
      nurse.email = email.toLowerCase();
    }

    // Check duplicate employeeId if changed
    if (employeeId && employeeId.toUpperCase() !== nurse.employeeId) {
      const existingEmployee = await User.findOne({
        employeeId: employeeId.toUpperCase(),
      });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: "Employee ID already exists.",
        });
      }
      nurse.employeeId = employeeId.toUpperCase();
    }

    if (fullName !== undefined) nurse.fullName = fullName;
    if (phone !== undefined) nurse.phone = phone;
    if (department !== undefined) nurse.department = department;
    if (profileImage !== undefined) nurse.profileImage = profileImage;
    if (isActive !== undefined) nurse.isActive = isActive;

    await nurse.save();

    const updatedNurse = await User.findById(nurse._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Nurse updated successfully.",
      data: updatedNurse,
    });
  } catch (error) {
    console.error("Update Nurse Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Deactivate Nurse
 * PUT /api/nurses/:id/deactivate
 * ==========================
 */
const deactivateNurse = async (req, res) => {
  try {
    const nurse = await User.findOne({
      _id: req.params.id,
      role: "Nurse",
    });

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found.",
      });
    }

    nurse.isActive = false;
    await nurse.save();

    res.status(200).json({
      success: true,
      message: "Nurse deactivated successfully.",
      data: {
        _id: nurse._id,
        fullName: nurse.fullName,
        isActive: nurse.isActive,
      },
    });
  } catch (error) {
    console.error("Deactivate Nurse Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Assign Patients to Nurse
 * PUT /api/nurses/:id/assign-patients
 * Body:
 * {
 *   "patientIds": ["id1", "id2"]
 * }
 * ==========================
 */
const assignPatientsToNurse = async (req, res) => {
  try {
    const { patientIds } = req.body;

    if (!Array.isArray(patientIds) || patientIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patientIds array is required.",
      });
    }

    const nurse = await User.findOne({
      _id: req.params.id,
      role: "Nurse",
    }).select("-password");

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found.",
      });
    }

    const patients = await Patient.find({
      _id: { $in: patientIds },
    });

    if (patients.length !== patientIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more patients not found.",
      });
    }

    await Patient.updateMany(
      { _id: { $in: patientIds } },
      { $set: { assignedNurse: nurse._id } }
    );

    const updatedPatients = await Patient.find({
      _id: { $in: patientIds },
    })
      .populate("ward", "wardName wardCode")
      .populate("assignedNurse", "fullName email employeeId");

    res.status(200).json({
      success: true,
      message: "Patients assigned to nurse successfully.",
      data: {
        nurse,
        assignedPatientsCount: updatedPatients.length,
        assignedPatients: updatedPatients,
      },
    });
  } catch (error) {
    console.error("Assign Patients To Nurse Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createNurse,
  getAllNurses,
  getNurseById,
  updateNurse,
  deactivateNurse,
  assignPatientsToNurse,
};
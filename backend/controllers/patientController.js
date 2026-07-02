const Patient = require("../models/Patient");
const Ward = require("../models/Ward");
const User = require("../models/User");
const Session = require("../models/Session");
const Device = require("../models/Device");

/**
 * ==========================
 * Create New Patient
 * POST /api/patients
 * ==========================
 */
const createPatient = async (req, res) => {
  try {
    const {
      patientId,
      fullName,
      age,
      gender,
      bloodGroup,
      diagnosis,
      allergies,
      ward,
      bedNumber,
      assignedDoctor,
      assignedNurse,
      emergencyContact,
      notes,
    } = req.body;

    // Required Fields
    if (
      !patientId ||
      !fullName ||
      !age ||
      !gender ||
      !bloodGroup ||
      !ward ||
      !bedNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Duplicate Patient ID
    const existingPatient = await Patient.findOne({ patientId });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient ID already exists.",
      });
    }

    // Ward Exists?
    const wardExists = await Ward.findById(ward);

    if (!wardExists) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    // Doctor Exists?
    if (assignedDoctor) {
      const doctor = await User.findById(assignedDoctor);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Assigned doctor not found.",
        });
      }
    }

    // Nurse Exists?
    if (assignedNurse) {
      const nurse = await User.findById(assignedNurse);

      if (!nurse) {
        return res.status(404).json({
          success: false,
          message: "Assigned nurse not found.",
        });
      }
    }

    const patient = await Patient.create({
      patientId,
      fullName,
      age,
      gender,
      bloodGroup,
      diagnosis,
      allergies,
      ward,
      bedNumber,
      assignedDoctor,
      assignedNurse,
      emergencyContact,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully.",
      data: patient,
    });
  } catch (error) {
    console.error("Create Patient Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get All Patients
 * GET /api/patients
 * ==========================
 */
const getAllPatients = async (req, res) => {
  try {
    const {
      search,
      ward,
      status,
      gender,
      ivStatus,
      page = 1,
      limit = 10,
      sort = "createdAt",
    } = req.query;

    const filter = {};

    if (search) {
      filter.fullName = {
        $regex: search,
        $options: "i",
      };
    }

    if (ward) filter.ward = ward;
    if (status) filter.status = status;
    if (gender) filter.gender = gender;
    if (ivStatus) filter.ivStatus = ivStatus;

    const patients = await Patient.find(filter)
      .populate("ward", "wardName wardCode")
      .populate("assignedDoctor", "fullName email")
      .populate("assignedNurse", "fullName email")
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalPatients = await Patient.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalPatients,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPatients / limit),
      data: patients,
    });
  } catch (error) {
    console.error("Get Patients Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Get Single Patient
 * GET /api/patients/:id
 * ==========================
 */
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("ward")
      .populate("assignedDoctor", "-password")
      .populate("assignedNurse", "-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const sessions = await Session.find({ patient: patient._id })
      .populate("device")
      .populate("nurse", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        patient,
        sessions,
      },
    });
  } catch (error) {
    console.error("Get Patient Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Update Patient
 * PUT /api/patients/:id
 * ==========================
 */
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Validate ward if changed
    if (req.body.ward) {
      const ward = await Ward.findById(req.body.ward);

      if (!ward) {
        return res.status(404).json({
          success: false,
          message: "Ward not found.",
        });
      }
    }

    // Validate Doctor
    if (req.body.assignedDoctor) {
      const doctor = await User.findById(req.body.assignedDoctor);

      if (!doctor || doctor.role !== "Doctor") {
        return res.status(400).json({
          success: false,
          message: "Invalid doctor selected.",
        });
      }
    }

    // Validate Nurse
    if (req.body.assignedNurse) {
      const nurse = await User.findById(req.body.assignedNurse);

      if (!nurse || nurse.role !== "Nurse") {
        return res.status(400).json({
          success: false,
          message: "Invalid nurse selected.",
        });
      }
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("ward")
      .populate("assignedDoctor", "-password")
      .populate("assignedNurse", "-password");

    res.status(200).json({
      success: true,
      message: "Patient updated successfully.",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Update Patient Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Delete Patient (Soft Delete)
 * DELETE /api/patients/:id
 * ==========================
 */
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    patient.status = "Discharged";
    patient.ivStatus = "Completed";

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient discharged successfully.",
    });
  } catch (error) {
    console.error("Delete Patient Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
/**
 * ==========================
 * Start IV Session
 * POST /api/patients/:id/start-session
 * ==========================
 */
const startIVSession = async (req, res) => {
  try {
    const {
      deviceId,
      nurseId,
      medicineName,
      prescribedVolume,
      flowRate,
      dripFactor,
      expectedDuration,
      remarks,
    } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    if (patient.ivStatus === "Running") {
      return res.status(400).json({
        success: false,
        message: "IV session already running.",
      });
    }

    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    if (
      device.deviceStatus !== "Available" &&
      device.deviceStatus !== "Assigned"
    ) {
      return res.status(400).json({
        success: false,
        message: "Device is not available.",
      });
    }

    const nurse = await User.findById(nurseId);

    if (!nurse || nurse.role !== "Nurse") {
      return res.status(400).json({
        success: false,
        message: "Invalid nurse.",
      });
    }

    const session = await Session.create({
      sessionId: `SES-${Date.now()}`,
      patient: patient._id,
      device: device._id,
      nurse: nurse._id,
      medicineName,
      prescribedVolume,
      flowRate,
      dripFactor,
      expectedDuration,
      remarks,
      sessionStatus: "Running",
    });

    patient.ivStatus = "Running";
    await patient.save();

    device.assignedPatient = patient._id;
    device.assignedBy = nurse._id;
    device.deviceStatus = "Running";
    device.connectivity = "Online";
    device.lastSeen = new Date();

    await device.save();

    res.status(201).json({
      success: true,
      message: "IV Session started successfully.",
      data: session,
    });

  } catch (error) {
    console.error("Start Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/**
 * ==========================
 * End IV Session
 * POST /api/patients/:id/end-session
 * ==========================
 */
const endIVSession = async (req, res) => {

  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const session = await Session.findOne({
      patient: patient._id,
      sessionStatus: "Running",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found.",
      });
    }

    session.sessionStatus = "Completed";
    session.endTime = new Date();

    await session.save();

    const device = await Device.findById(session.device);

    if (device) {
      device.assignedPatient = null;
      device.assignedBy = null;
      device.deviceStatus = "Available";

      await device.save();
    }

    patient.ivStatus = "Completed";

    await patient.save();

    res.status(200).json({
      success: true,
      message: "IV Session completed successfully.",
      data: session,
    });

  } catch (error) {

    console.error("End Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  startIVSession,
  endIVSession,
};
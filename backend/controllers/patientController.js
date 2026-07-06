const Patient = require("../models/Patient");
const Ward = require("../models/Ward");
const User = require("../models/User");
const Session = require("../models/Session");
const Device = require("../models/Device");

/* =========================================================
   Helpers
========================================================= */
const normalizePatientId = (value = "") => String(value).trim().toUpperCase();

const parseAllergies = (allergies) => {
  if (!allergies) return [];

  if (Array.isArray(allergies)) {
    return allergies
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof allergies === "string") {
    return allergies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const buildEmergencyContact = (emergencyContact = {}) => {
  return {
    name: emergencyContact?.name?.trim?.() || "",
    relation: emergencyContact?.relation?.trim?.() || "",
    phone: emergencyContact?.phone?.trim?.() || "",
  };
};

const generateSessionId = async () => {
  const count = await Session.countDocuments();
  return `SES-${String(count + 1).padStart(4, "0")}`;
};

/* =========================================================
   Create Patient
   POST /api/patients
========================================================= */
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
      status,
      ivStatus,
    } = req.body;

    // Required validation
    if (
      !patientId ||
      !fullName ||
      age === undefined ||
      !gender ||
      !bloodGroup ||
      !ward ||
      !bedNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "patientId, fullName, age, gender, bloodGroup, ward and bedNumber are required.",
      });
    }

    // Duplicate patient ID check
    const normalizedPatientId = normalizePatientId(patientId);

    const existingPatient = await Patient.findOne({
      patientId: normalizedPatientId,
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient ID already exists.",
      });
    }

    // Ward validation
    const wardExists = await Ward.findById(ward);
    if (!wardExists) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    // Doctor validation
    if (assignedDoctor) {
      const doctor = await User.findById(assignedDoctor);
      if (!doctor || doctor.role !== "Doctor") {
        return res.status(400).json({
          success: false,
          message: "Invalid doctor selected.",
        });
      }
    }

    // Nurse validation
    if (assignedNurse) {
      const nurse = await User.findById(assignedNurse);
      if (!nurse || nurse.role !== "Nurse") {
        return res.status(400).json({
          success: false,
          message: "Invalid nurse selected.",
        });
      }
    }

    const patient = await Patient.create({
      patientId: normalizedPatientId,
      fullName: String(fullName).trim(),
      age: Number(age),
      gender,
      bloodGroup,
      diagnosis: diagnosis?.trim?.() || "",
      allergies: parseAllergies(allergies),
      ward,
      bedNumber: String(bedNumber).trim(),
      assignedDoctor: assignedDoctor || null,
      assignedNurse: assignedNurse || null,
      emergencyContact: buildEmergencyContact(emergencyContact),
      notes: notes?.trim?.() || "",
      status: status || "Admitted",
      ivStatus: ivStatus || "Stopped",
    });

    const populatedPatient = await Patient.findById(patient._id)
      .populate("ward", "wardName wardCode")
      .populate("assignedDoctor", "fullName email employeeId role")
      .populate("assignedNurse", "fullName email employeeId role");

    return res.status(201).json({
      success: true,
      message: "Patient created successfully.",
      data: populatedPatient,
    });
  } catch (error) {
    console.error("Create Patient Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================================================
   Get All Patients
   GET /api/patients
========================================================= */
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
      order = "desc",
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { bedNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (ward) filter.ward = ward;
    if (status) filter.status = status;
    if (gender) filter.gender = gender;
    if (ivStatus) filter.ivStatus = ivStatus;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);

    const sortDirection = order === "asc" ? 1 : -1;

    const patients = await Patient.find(filter)
      .populate("ward", "wardName wardCode")
      .populate("assignedDoctor", "fullName email employeeId")
      .populate("assignedNurse", "fullName email employeeId")
      .sort({ [sort]: sortDirection })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalPatients = await Patient.countDocuments(filter);

    return res.status(200).json({
      success: true,
      total: totalPatients,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPatients / limitNumber),
      data: patients,
    });
  } catch (error) {
    console.error("Get Patients Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================================================
   Get Single Patient
   GET /api/patients/:id
========================================================= */
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("ward", "wardName wardCode floor wardType status")
      .populate("assignedDoctor", "-password")
      .populate("assignedNurse", "-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const sessions = await Session.find({ patient: patient._id })
      .populate(
        "device",
        "deviceId deviceName serialNumber deviceStatus batteryLevel connectivity"
      )
      .populate("nurse", "fullName email employeeId role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        patient,
        sessions,
      },
    });
  } catch (error) {
    console.error("Get Patient Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================================================
   Update Patient
   PUT /api/patients/:id
========================================================= */
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

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
      status,
      ivStatus,
    } = req.body;

    // Patient ID duplicate check if changed
    if (patientId && normalizePatientId(patientId) !== patient.patientId) {
      const existingPatient = await Patient.findOne({
        patientId: normalizePatientId(patientId),
        _id: { $ne: patient._id },
      });

      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: "Patient ID already exists.",
        });
      }

      patient.patientId = normalizePatientId(patientId);
    }

    // Ward validation if changed
    if (ward !== undefined) {
      const wardExists = await Ward.findById(ward);
      if (!wardExists) {
        return res.status(404).json({
          success: false,
          message: "Ward not found.",
        });
      }
      patient.ward = ward;
    }

    // Doctor validation
    if (assignedDoctor !== undefined) {
      if (assignedDoctor) {
        const doctor = await User.findById(assignedDoctor);
        if (!doctor || doctor.role !== "Doctor") {
          return res.status(400).json({
            success: false,
            message: "Invalid doctor selected.",
          });
        }
        patient.assignedDoctor = assignedDoctor;
      } else {
        patient.assignedDoctor = null;
      }
    }

    // Nurse validation
    if (assignedNurse !== undefined) {
      if (assignedNurse) {
        const nurse = await User.findById(assignedNurse);
        if (!nurse || nurse.role !== "Nurse") {
          return res.status(400).json({
            success: false,
            message: "Invalid nurse selected.",
          });
        }
        patient.assignedNurse = assignedNurse;
      } else {
        patient.assignedNurse = null;
      }
    }

    if (fullName !== undefined) patient.fullName = String(fullName).trim();
    if (age !== undefined) patient.age = Number(age);
    if (gender !== undefined) patient.gender = gender;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (diagnosis !== undefined) patient.diagnosis = diagnosis?.trim?.() || "";
    if (allergies !== undefined) patient.allergies = parseAllergies(allergies);
    if (bedNumber !== undefined) patient.bedNumber = String(bedNumber).trim();
    if (notes !== undefined) patient.notes = notes?.trim?.() || "";
    if (status !== undefined) patient.status = status;
    if (ivStatus !== undefined) patient.ivStatus = ivStatus;

    if (emergencyContact !== undefined) {
      patient.emergencyContact = buildEmergencyContact(emergencyContact);
    }

    await patient.save();

    const updatedPatient = await Patient.findById(patient._id)
      .populate("ward", "wardName wardCode")
      .populate("assignedDoctor", "fullName email employeeId role")
      .populate("assignedNurse", "fullName email employeeId role");

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully.",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Update Patient Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================================================
   Delete Patient (Soft Delete / Discharge)
   DELETE /api/patients/:id
========================================================= */
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // End active session if any
    const activeSession = await Session.findOne({
      patient: patient._id,
      sessionStatus: { $in: ["Running", "Paused"] },
    });

    if (activeSession) {
      activeSession.sessionStatus = "Completed";
      activeSession.endTime = new Date();
      await activeSession.save();

      const device = await Device.findById(activeSession.device);
      if (device) {
        device.assignedPatient = null;
        device.assignedBy = null;
        device.deviceStatus = "Available";
        await device.save();
      }
    }

    patient.status = "Discharged";
    patient.ivStatus = "Completed";
    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient discharged successfully.",
    });
  } catch (error) {
    console.error("Delete Patient Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================================================
   Start IV Session
   POST /api/patients/:id/start-session
========================================================= */
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
      infusedVolume,
    } = req.body;

    if (!deviceId || !nurseId || !medicineName || !prescribedVolume || !flowRate) {
      return res.status(400).json({
        success: false,
        message:
          "deviceId, nurseId, medicineName, prescribedVolume and flowRate are required.",
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    if (patient.status === "Discharged") {
      return res.status(400).json({
        success: false,
        message: "Cannot start session for discharged patient.",
      });
    }

    // Prevent duplicate active session on patient
    const existingPatientSession = await Session.findOne({
      patient: patient._id,
      sessionStatus: { $in: ["Running", "Paused"] },
    });

    if (existingPatientSession) {
      return res.status(400).json({
        success: false,
        message: "This patient already has an active session.",
      });
    }

    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found.",
      });
    }

    // Prevent duplicate active session on device
    const existingDeviceSession = await Session.findOne({
      device: device._id,
      sessionStatus: { $in: ["Running", "Paused"] },
    });

    if (existingDeviceSession) {
      return res.status(400).json({
        success: false,
        message: "This device already has an active session.",
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
        message: "Invalid nurse selected.",
      });
    }

    const sessionId = await generateSessionId();

    const session = await Session.create({
      sessionId,
      patient: patient._id,
      device: device._id,
      nurse: nurse._id,
      medicineName: medicineName.trim(),
      prescribedVolume: Number(prescribedVolume),
      infusedVolume: infusedVolume ? Number(infusedVolume) : 0,
      flowRate: Number(flowRate),
      dripFactor: dripFactor ? Number(dripFactor) : 20,
      expectedDuration: expectedDuration ? Number(expectedDuration) : 0,
      remarks: remarks?.trim?.() || "",
      sessionStatus: "Running",
      startTime: new Date(),
    });

    // Update patient state
    patient.ivStatus = "Running";
    if (!patient.assignedNurse) {
      patient.assignedNurse = nurse._id;
    }
    await patient.save();

    // Update device state
    device.assignedPatient = patient._id;
    device.assignedBy = nurse._id;
    device.deviceStatus = "Running";
    device.connectivity = "Online";
    device.lastSeen = new Date();
    await device.save();

    const populatedSession = await Session.findById(session._id)
      .populate({
        path: "patient",
        select: "patientId fullName ward bedNumber ivStatus status",
        populate: {
          path: "ward",
          select: "wardName wardCode",
        },
      })
      .populate(
        "device",
        "deviceId deviceName serialNumber deviceStatus batteryLevel connectivity"
      )
      .populate("nurse", "fullName email role employeeId");

    return res.status(201).json({
      success: true,
      message: "IV Session started successfully.",
      data: populatedSession,
    });
  } catch (error) {
    console.error("Start Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================================================
   End IV Session
   POST /api/patients/:id/end-session
========================================================= */
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
      sessionStatus: { $in: ["Running", "Paused"] },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found for this patient.",
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
      device.lastSeen = new Date();
      await device.save();
    }

    patient.ivStatus = "Completed";
    await patient.save();

    const updatedSession = await Session.findById(session._id)
      .populate("patient", "patientId fullName bedNumber ivStatus status")
      .populate("device", "deviceId deviceName serialNumber deviceStatus")
      .populate("nurse", "fullName email employeeId");

    return res.status(200).json({
      success: true,
      message: "IV Session completed successfully.",
      data: updatedSession,
    });
  } catch (error) {
    console.error("End Session Error:", error);
    return res.status(500).json({
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
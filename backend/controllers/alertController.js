const Alert = require("../models/Alert");
const { emitEvent } = require("../sockets/socketHandler");

/**
 * ==========================
 * Get All Alerts
 * GET /api/alerts
 * Filters:
 * - startDate
 * - endDate
 * - alertType
 * - severity
 * - patient
 * - device
 * - isResolved
 * ==========================
 */
const getAlerts = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      alertType,
      severity,
      patient,
      device,
      isResolved,
    } = req.query;

    const filter = {};

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Other filters
    if (alertType) filter.alertType = alertType;
    if (severity) filter.severity = severity;
    if (patient) filter.patient = patient;
    if (device) filter.device = device;

    if (isResolved !== undefined) {
      if (isResolved === "true") filter.isResolved = true;
      if (isResolved === "false") filter.isResolved = false;
    }

    const alerts = await Alert.find(filter)
      .populate("patient", "patientId fullName bedNumber ward")
      .populate("device", "deviceId deviceName serialNumber")
      .populate("session", "sessionId sessionStatus startTime endTime")
      .populate("resolvedBy", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get Alerts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Resolve Alert
 * PUT /api/alerts/:id/resolve
 * Body:
 * {
 *   "notes": "Resolved by nurse"
 * }
 * ==========================
 */
const resolveAlert = async (req, res) => {
  try {
    const { notes } = req.body;

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    if (alert.isResolved) {
      return res.status(400).json({
        success: false,
        message: "Alert is already resolved.",
      });
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user._id;

    if (notes) {
      alert.notes = notes;
    }

    await alert.save();

    const updatedAlert = await Alert.findById(alert._id)
      .populate("patient", "patientId fullName")
      .populate("device", "deviceId deviceName")
      .populate("session", "sessionId")
      .populate("resolvedBy", "fullName email role");

    // Real-time event
    emitEvent("alert:resolved", updatedAlert);

    res.status(200).json({
      success: true,
      message: "Alert resolved successfully.",
      data: updatedAlert,
    });
  } catch (error) {
    console.error("Resolve Alert Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Acknowledge Alert (Placeholder)
 * PUT /api/alerts/:id/acknowledge
 * ==========================
 */
const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Alert acknowledged successfully. Placeholder endpoint for future workflow.",
      data: alert,
    });
  } catch (error) {
    console.error("Acknowledge Alert Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * ==========================
 * Auto Escalation Placeholder
 * Escalate unresolved alerts older than 5 minutes
 * ==========================
 */
const autoEscalateAlerts = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const staleAlerts = await Alert.find({
      isResolved: false,
      createdAt: { $lte: fiveMinutesAgo },
    });

    console.log(
      `⏰ Auto-escalation placeholder: ${staleAlerts.length} unresolved alerts older than 5 minutes.`
    );

    return staleAlerts;
  } catch (error) {
    console.error("Auto Escalation Error:", error);
    return [];
  }
};

module.exports = {
  getAlerts,
  resolveAlert,
  acknowledgeAlert,
  autoEscalateAlerts,
};
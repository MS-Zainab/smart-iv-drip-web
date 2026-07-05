const Patient = require("../models/Patient");
const Device = require("../models/Device");
const Session = require("../models/Session");
const Alert = require("../models/Alert");

/**
 * ==========================
 * Dashboard Summary
 * GET /api/dashboard
 * ==========================
 */
const getDashboardSummary = async (req, res) => {
  try {
    // 1) Stats
    const totalPatientsPromise = Patient.countDocuments();

    // Agar tumhare Device model mein connectivity/status field hai
    // aur online devices count karna hai to us field ka exact name use hoga.
    // screenshot aur frontend ke hisaab se connectivity use kar rahe hain.
    const activeDevicesPromise = Device.countDocuments({
      connectivity: "Online",
    });

    const activeSessionsPromise = Session.countDocuments({
      sessionStatus: "Running",
    });

    const criticalAlertsPromise = Alert.countDocuments({
      isResolved: false,
      severity: { $in: ["High", "Critical"] },
    });

    // 2) Recent Alerts (latest 5)
    const recentAlertsPromise = Alert.find()
      .populate("patient", "patientId fullName")
      .populate("device", "deviceId deviceName")
      .sort({ createdAt: -1 })
      .limit(5);

    // 3) Device Overview (latest 5)
    const deviceOverviewPromise = Device.find()
      .populate("ward", "wardName wardCode")
      .sort({ createdAt: -1 })
      .limit(5);

    const [
      totalPatients,
      activeDevices,
      activeSessions,
      criticalAlerts,
      recentAlerts,
      deviceOverview,
    ] = await Promise.all([
      totalPatientsPromise,
      activeDevicesPromise,
      activeSessionsPromise,
      criticalAlertsPromise,
      recentAlertsPromise,
      deviceOverviewPromise,
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPatients,
          activeDevices,
          activeSessions,
          criticalAlerts,
        },
        recentAlerts,
        deviceOverview,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboardSummary,
};
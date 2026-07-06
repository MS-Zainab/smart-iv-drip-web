import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const getInitialSessionForm = () => ({
  patient: "",
  device: "",
  nurse: "",
  medicineName: "",
  prescribedVolume: "",
  infusedVolume: "",
  flowRate: "",
  dripFactor: 20,
  expectedDuration: "",
  startTime: "",
  remarks: "",
});

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [nurses, setNurses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState(getInitialSessionForm());

  /* -------------------------------------------
   * Fetch Sessions
   * ----------------------------------------- */
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/sessions");

      if (res.data?.success) {
        setSessions(res.data.data || []);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------
   * Fetch Patients
   * ----------------------------------------- */
  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get("/patients");
      console.log("Patients API response:", res.data);

      if (res.data?.success) {
        const patientsData = res.data.data || [];

        // Sirf active / admitted type patients rakhne ka light filter
        const usablePatients = patientsData.filter((patient) => {
          const status = (patient.status || "").toLowerCase();
          return status !== "discharged" && status !== "inactive";
        });

        setPatients(usablePatients);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Fetch patients error:", error);
      setPatients([]);
    }
  };

  /* -------------------------------------------
   * Fetch Devices
   * ----------------------------------------- */
  const fetchDevices = async () => {
    try {
      const res = await axiosInstance.get("/devices");
      console.log("Devices API response:", res.data);

      if (res.data?.success) {
        const devicesData = res.data.data || [];

        // IMPORTANT:
        // फिलहाल hard filter mat lagao warna dropdown empty ho sakta hai.
        // Bas obviously unusable statuses hata do if present.
        const usableDevices = devicesData.filter((device) => {
          const status = (device.deviceStatus || "").toLowerCase();

          return status !== "inactive" && status !== "deactivated";
        });

        setDevices(usableDevices);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error("Fetch devices error:", error);
      setDevices([]);
    }
  };

  /* -------------------------------------------
   * Fetch Nurses
   * ----------------------------------------- */
  const fetchNurses = async () => {
    try {
      const res = await axiosInstance.get("/nurses");
      console.log("Nurses API response:", res.data);

      if (res.data?.success) {
        const nursesData = res.data.data || [];

        const activeNurses = nursesData.filter((nurse) => nurse.isActive !== false);
        setNurses(activeNurses);
      } else {
        setNurses([]);
      }
    } catch (error) {
      console.error("Fetch nurses error:", error);
      setNurses([]);
    }
  };

  /* -------------------------------------------
   * Open Start Session Modal
   * ----------------------------------------- */
  const handleOpenSessionModal = async () => {
    try {
      setShowSessionModal(true);
      setModalLoading(true);
      setSessionForm(getInitialSessionForm());

      await Promise.all([fetchPatients(), fetchDevices(), fetchNurses()]);
    } catch (error) {
      console.error("Error opening session modal:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseSessionModal = () => {
    if (creatingSession) return;
    setShowSessionModal(false);
    setSessionForm(getInitialSessionForm());
  };

  /* -------------------------------------------
   * Handle Form Change
   * ----------------------------------------- */
  const handleFormChange = (field, value) => {
    setSessionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* -------------------------------------------
   * Form Validity
   * ----------------------------------------- */
  const isSessionFormValid =
    sessionForm.patient?.trim() &&
    sessionForm.device?.trim() &&
    sessionForm.nurse?.trim() &&
    sessionForm.medicineName?.trim() &&
    Number(sessionForm.prescribedVolume) > 0 &&
    Number(sessionForm.flowRate) > 0;

  /* -------------------------------------------
   * Create Session
   * ----------------------------------------- */
  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!isSessionFormValid) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setCreatingSession(true);

      const payload = {
        patient: sessionForm.patient,
        device: sessionForm.device, // Mongo _id
        nurse: sessionForm.nurse,   // Mongo _id
        medicineName: sessionForm.medicineName.trim(),
        prescribedVolume: Number(sessionForm.prescribedVolume),
        infusedVolume: Number(sessionForm.infusedVolume || 0),
        flowRate: Number(sessionForm.flowRate),
        dripFactor: Number(sessionForm.dripFactor || 20),
        expectedDuration: Number(sessionForm.expectedDuration || 0),
        startTime: sessionForm.startTime
          ? new Date(sessionForm.startTime).toISOString()
          : new Date().toISOString(),
        remarks: sessionForm.remarks?.trim() || "",
      };

      console.log("Create session payload:", payload);

      const res = await axiosInstance.post("/sessions", payload);

      if (res.data?.success) {
        alert("Session created successfully.");
        setShowSessionModal(false);
        setSessionForm(getInitialSessionForm());
        fetchSessions();
      } else {
        alert(res.data?.message || "Failed to create session.");
      }
    } catch (error) {
      console.error("Create session error:", error);
      alert(error.response?.data?.message || "Failed to create session.");
    } finally {
      setCreatingSession(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* -------------------------------------------
   * Summary
   * ----------------------------------------- */
  const summary = useMemo(() => {
    const total = sessions.length;
    const running = sessions.filter(
      (session) => session.sessionStatus === "Running"
    ).length;

    const completed = sessions.filter(
      (session) => session.sessionStatus === "Completed"
    ).length;

    const paused = sessions.filter(
      (session) => session.sessionStatus === "Paused"
    ).length;

    return { total, running, completed, paused };
  }, [sessions]);

  /* -------------------------------------------
   * Helpers
   * ----------------------------------------- */
  const getStatusBadge = (status) => {
    const styles = {
      Running: "bg-green-100 text-green-700",
      Completed: "bg-slate-200 text-slate-700",
      Paused: "bg-yellow-100 text-yellow-700",
      Cancelled: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDateTime = (value) => {
    if (!value) return "--";
    return new Date(value).toLocaleString();
  };

  const getProgress = (session) => {
    const prescribed = Number(session.prescribedVolume || 0);
    const infused = Number(session.infusedVolume || 0);

    if (!prescribed || prescribed <= 0) return 0;
    return Math.min(Math.round((infused / prescribed) * 100), 100);
  };

  const getProgressColor = (status, progress) => {
    if (status === "Cancelled") return "bg-red-500";
    if (status === "Completed") return "bg-slate-500";
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 40) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sessions</h1>
            <p className="text-slate-500 mt-2">
              Track active IV drip sessions, flow rate, progress and patient infusion status.
            </p>
          </div>

          <button
            onClick={handleOpenSessionModal}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            + Start Session
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Sessions</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {summary.total}
          </h2>
          <p className="text-sm text-slate-400 mt-1">All recorded sessions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Running Now</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {summary.running}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Currently active</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Paused Sessions</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {summary.paused}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Temporarily stopped</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-3xl font-bold text-slate-700 mt-2">
            {summary.completed}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Finished sessions</p>
        </div>
      </div>

      {/* Sessions Table */}
        {/* Sessions Table */}
<SectionCard
  title="Session Monitor"
  actionText={loading ? "Refreshing..." : "Refresh"}
  onAction={fetchSessions}
>
  {loading ? (
    <div className="py-10 text-center text-slate-500">
      Loading sessions...
    </div>
  ) : sessions.length === 0 ? (
    <div className="py-10 text-center text-slate-500">
      No sessions found.
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Session ID
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Patient
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Device
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Ward / Bed
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Medicine
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Flow Rate
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Progress
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Nurse
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Started
            </th>
            <th className="py-3 px-3 text-sm font-semibold text-slate-600">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => {
            const progress = getProgress(session);

            return (
              <tr
                key={session._id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="py-4 px-3 text-sm font-medium text-slate-700">
                  {session.sessionId}
                </td>

                <td className="py-4 px-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {session.patient?.fullName || "--"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.patient?.patientId || "--"}
                    </p>
                  </div>
                </td>

                <td className="py-4 px-3 text-sm text-slate-600">
                  {session.device?.deviceId || session.device?.deviceName || "--"}
                </td>

                <td className="py-4 px-3 text-sm text-slate-600">
                  {session.patient?.ward?.wardName || "--"} •{" "}
                  {session.patient?.bedNumber || "--"}
                </td>

                <td className="py-4 px-3 text-sm text-slate-600">
                  {session.medicineName || "--"}
                </td>

                <td className="py-4 px-3 text-sm text-slate-600">
                  {session.flowRate ? `${session.flowRate} ml/hr` : "--"}
                </td>

                <td className="py-4 px-3 min-w-[180px]">
                  <div className="space-y-2">
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProgressColor(
                          session.sessionStatus,
                          progress
                        )}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {progress}% completed
                    </p>
                  </div>
                </td>

                <td className="py-4 px-3 text-sm text-slate-600">
                  {session.nurse?.fullName || "--"}
                </td>

                <td className="py-4 px-3 text-sm text-slate-600">
                  {formatDateTime(session.startTime)}
                </td>

                <td className="py-4 px-3">
                  {getStatusBadge(session.sessionStatus)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</SectionCard>

      {/* Start Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Start New Session
                </h2>
                <p className="text-slate-500 mt-2">
                  Create a new IV drip monitoring session for a patient.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseSessionModal}
                className="text-slate-400 hover:text-slate-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(92vh-90px)]">
              {modalLoading ? (
                <div className="py-16 text-center text-slate-500">
                  Loading form data...
                </div>
              ) : (
                <form onSubmit={handleCreateSession} className="space-y-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Patient */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Patient <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sessionForm.patient}
                        onChange={(e) => handleFormChange("patient", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        required
                      >
                        <option value="">Select patient</option>
                        {patients.length > 0 ? (
                          patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                              {patient.fullName || "Unknown"} ({patient.patientId || "No ID"})
                              {patient.bedNumber ? ` - Bed ${patient.bedNumber}` : ""}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No patients available
                          </option>
                        )}
                      </select>
                    </div>

                    {/* Device */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Device <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sessionForm.device}
                        onChange={(e) => handleFormChange("device", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        required
                      >
                        <option value="">Select device</option>
                        {devices.length > 0 ? (
                          devices.map((device) => (
                            <option key={device._id} value={device._id}>
                              {device.deviceName || "Unnamed Device"} ({device.deviceId || "No ID"})
                              {device.deviceStatus ? ` - ${device.deviceStatus}` : ""}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No devices available
                          </option>
                        )}
                      </select>
                    </div>

                    {/* Nurse */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nurse <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sessionForm.nurse}
                        onChange={(e) => handleFormChange("nurse", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        required
                      >
                        <option value="">Select nurse</option>
                        {nurses.length > 0 ? (
                          nurses.map((nurse) => (
                            <option key={nurse._id} value={nurse._id}>
                              {nurse.fullName || "Unnamed Nurse"}
                              {nurse.employeeId ? ` (${nurse.employeeId})` : ""}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No nurses available
                          </option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Medicine Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Medicine Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={sessionForm.medicineName}
                        onChange={(e) =>
                          handleFormChange("medicineName", e.target.value)
                        }
                        placeholder="e.g. Normal Saline"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        required
                      />
                    </div>

                    {/* Prescribed Volume */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prescribed Volume (ml) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={sessionForm.prescribedVolume}
                        onChange={(e) =>
                          handleFormChange("prescribedVolume", e.target.value)
                        }
                        placeholder="e.g. 500"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {/* Infused Volume */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Infused Volume (ml)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={sessionForm.infusedVolume}
                        onChange={(e) =>
                          handleFormChange("infusedVolume", e.target.value)
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>

                    {/* Flow Rate */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Flow Rate (ml/hr) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={sessionForm.flowRate}
                        onChange={(e) =>
                          handleFormChange("flowRate", e.target.value)
                        }
                        placeholder="e.g. 60"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        required
                      />
                    </div>

                    {/* Drip Factor */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Drip Factor
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={sessionForm.dripFactor}
                        onChange={(e) =>
                          handleFormChange("dripFactor", e.target.value)
                        }
                        placeholder="20"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>

                    {/* Expected Duration */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expected Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={sessionForm.expectedDuration}
                        onChange={(e) =>
                          handleFormChange("expectedDuration", e.target.value)
                        }
                        placeholder="e.g. 120"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={sessionForm.startTime}
                        onChange={(e) =>
                          handleFormChange("startTime", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      rows={4}
                      value={sessionForm.remarks}
                      onChange={(e) => handleFormChange("remarks", e.target.value)}
                      placeholder="Optional notes about the session..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                    />
                  </div>

                  {/* Debug Info - remove later if you want */}
                  {/* <pre className="text-xs bg-slate-100 p-3 rounded-xl overflow-auto">
                    {JSON.stringify({ patients, devices, nurses, sessionForm }, null, 2)}
                  </pre> */}

                  {/* Footer Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseSessionModal}
                      className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                      disabled={creatingSession}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!isSessionFormValid || creatingSession}
                      className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {creatingSession ? "Starting..." : "Start Session"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
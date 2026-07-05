import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const initialFormData = {
  deviceId: "",
  serialNumber: "",
  deviceName: "Smart IV Monitor",
  ward: "",
  firmwareVersion: "1.0.0",
  batteryLevel: 100,
  connectivity: "Offline",
  deviceStatus: "Available",
  calibrationDate: "",
  location: "",
  notes: "",
};

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [wards, setWards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/devices");

      if (res.data?.success) {
        setDevices(res.data.data || []);
      } else {
        setDevices([]);
      }
    } catch (err) {
      console.error("Fetch Devices Error:", err);
      setError(err.response?.data?.message || "Failed to fetch devices");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async () => {
    try {
      const res = await axiosInstance.get("/wards");

      if (res.data?.success) {
        setWards(res.data.data || []);
      } else {
        setWards([]);
      }
    } catch (err) {
      console.error("Fetch Wards Error:", err);
      setWards([]);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchWards();
  }, []);

  const totalDevices = devices.length;

  const onlineDevices = useMemo(() => {
    return devices.filter((device) => device.connectivity === "Online").length;
  }, [devices]);

  const offlineDevices = useMemo(() => {
    return devices.filter((device) => device.connectivity === "Offline").length;
  }, [devices]);

  const runningDevices = useMemo(() => {
    return devices.filter((device) => device.deviceStatus === "Running").length;
  }, [devices]);

  const getConnectivityBadge = (connectivity) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          connectivity === "Online"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {connectivity || "Unknown"}
      </span>
    );
  };

  const getDeviceStatusBadge = (status) => {
    const styles = {
      Available: "bg-slate-100 text-slate-700",
      Assigned: "bg-blue-100 text-blue-700",
      Running: "bg-green-100 text-green-700",
      Maintenance: "bg-yellow-100 text-yellow-700",
      Faulty: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  const openAddModal = () => {
    setFormData(initialFormData);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "batteryLevel" ? Number(value) : value,
    }));
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();

    if (!formData.deviceId || !formData.serialNumber || !formData.ward) {
      setFormError("Device ID, Serial Number and Ward are required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = {
        ...formData,
        calibrationDate: formData.calibrationDate || null,
      };

      const res = await axiosInstance.post("/devices", payload);

      if (res.data?.success) {
        closeAddModal();
        await fetchDevices();
      }
    } catch (err) {
      console.error("Add Device Error:", err);
      setFormError(err.response?.data?.message || "Failed to add device");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Devices Management</h1>
            <p className="text-slate-500 mt-2">
              Manage Smart IV devices, monitor connectivity, track assignments and register new monitoring devices.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchDevices}
              className="px-5 py-3 rounded-xl bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition"
            >
              Refresh Devices
            </button>

            <button
              onClick={openAddModal}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
            >
              Add Device
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Devices</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {loading ? "..." : totalDevices}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Online Devices</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : onlineDevices}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Offline Devices</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {loading ? "..." : offlineDevices}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Running Devices</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? "..." : runningDevices}
          </h2>
        </div>
      </div>

      {/* Devices List */}
      <SectionCard title="All Devices" actionText="Live Data">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No devices found.</div>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device._id}
                className="border border-slate-200 rounded-2xl p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 hover:shadow-sm transition"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {device.deviceName || "Smart IV Monitor"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">Device ID:</span>{" "}
                      {device.deviceId || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Serial Number:</span>{" "}
                      {device.serialNumber || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Ward:</span>{" "}
                      {device.ward?.wardName || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Battery:</span>{" "}
                      {device.batteryLevel ?? 0}%
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Firmware:</span>{" "}
                      {device.firmwareVersion || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Assigned Patient:</span>{" "}
                      {device.assignedPatient?.fullName || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Location:</span>{" "}
                      {device.location || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Last Seen:</span>{" "}
                      {device.lastSeen
                        ? new Date(device.lastSeen).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {getConnectivityBadge(device.connectivity)}
                  {getDeviceStatusBadge(device.deviceStatus)}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Add Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add New Device</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Register a new Smart IV monitoring device in the system.
                </p>
              </div>

              <button
                onClick={closeAddModal}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="p-6 space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Device ID *
                  </label>
                  <input
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleChange}
                    placeholder="DEV-001"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="SN-001"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Device Name
                  </label>
                  <input
                    type="text"
                    name="deviceName"
                    value={formData.deviceName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ward *
                  </label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="">Select Ward</option>
                    {wards.map((ward) => (
                      <option key={ward._id} value={ward._id}>
                        {ward.wardName} {ward.wardCode ? `(${ward.wardCode})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Firmware Version
                  </label>
                  <input
                    type="text"
                    name="firmwareVersion"
                    value={formData.firmwareVersion}
                    onChange={handleChange}
                    placeholder="1.0.0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Battery Level
                  </label>
                  <input
                    type="number"
                    name="batteryLevel"
                    value={formData.batteryLevel}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Connectivity
                  </label>
                  <select
                    name="connectivity"
                    value={formData.connectivity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Device Status
                  </label>
                  <select
                    name="deviceStatus"
                    value={formData.deviceStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Faulty">Faulty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calibration Date
                  </label>
                  <input
                    type="date"
                    name="calibrationDate"
                    value={formData.calibrationDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ward A - Bed 3"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Optional notes about this device..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-5 py-3 rounded-xl bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
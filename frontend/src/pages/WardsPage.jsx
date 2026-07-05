import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const initialForm = {
  wardName: "",
  wardCode: "",
  floor: "",
  capacity: "",
  nurseInCharge: "",
  wardType: "General",
  status: "Active",
  notes: "",
};

const WardsPage = () => {
  const [wards, setWards] = useState([]);
  const [nurses, setNurses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState(initialForm);

  const fetchWards = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/wards");

      if (res.data?.success) {
        setWards(res.data.data || []);
      } else {
        setWards([]);
      }
    } catch (err) {
      console.error("Fetch Wards Error:", err);
      setError(err.response?.data?.message || "Failed to fetch wards");
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNurses = async () => {
    try {
      const res = await axiosInstance.get("/nurses");
      if (res.data?.success) {
        const onlyActiveNurses = (res.data.data || []).filter(
          (nurse) => nurse.isActive
        );
        setNurses(onlyActiveNurses);
      } else {
        setNurses([]);
      }
    } catch (err) {
      console.error("Fetch Nurses Error:", err);
      setNurses([]);
    }
  };

  useEffect(() => {
    fetchWards();
    fetchNurses();
  }, []);

  const totalWards = wards.length;

  const activeWards = useMemo(() => {
    return wards.filter((ward) => ward.status === "Active").length;
  }, [wards]);

  const totalBeds = useMemo(() => {
    return wards.reduce((sum, ward) => sum + (ward.capacity || 0), 0);
  }, [wards]);

  const occupiedBeds = useMemo(() => {
    return wards.reduce((sum, ward) => sum + (ward.currentPatients || 0), 0);
  }, [wards]);

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-red-100 text-red-700",
      Maintenance: "bg-yellow-100 text-yellow-700",
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

  const getOccupancyPercentage = (occupied, total) => {
    if (!total || total === 0) return 0;
    return Math.round((occupied / total) * 100);
  };

  const getOccupancyBarColor = (percentage) => {
    if (percentage >= 85) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const openAddModal = () => {
    setFormData(initialForm);
    setFormError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormError("");
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddWard = async (e) => {
    e.preventDefault();

    if (
      !formData.wardName.trim() ||
      !formData.wardCode.trim() ||
      formData.floor === "" ||
      formData.capacity === ""
    ) {
      setFormError("Ward name, ward code, floor and capacity are required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = {
        wardName: formData.wardName.trim(),
        wardCode: formData.wardCode.trim(),
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        wardType: formData.wardType,
        status: formData.status,
        notes: formData.notes.trim(),
        nurseInCharge: formData.nurseInCharge || null,
      };

      const res = await axiosInstance.post("/wards", payload);

      if (res.data?.success) {
        await fetchWards();
        closeAddModal();
      } else {
        setFormError("Failed to create ward.");
      }
    } catch (err) {
      console.error("Create Ward Error:", err);
      setFormError(err.response?.data?.message || "Failed to create ward");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Wards Management</h1>
            <p className="text-slate-500 mt-2">
              View ward details, occupancy levels, assigned nurses, and operational status.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Add Ward
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Wards</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">{totalWards}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Active Wards</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{activeWards}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Beds</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">{totalBeds}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Occupied Beds</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">{occupiedBeds}</h2>
        </div>
      </div>

      {/* Ward Cards */}
      <SectionCard title="All Wards" actionText={`${wards.length} Total`}>
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading wards...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : wards.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No wards found.</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {wards.map((ward) => {
              const occupancy = getOccupancyPercentage(
                ward.currentPatients || 0,
                ward.capacity || 0
              );

              return (
                <div
                  key={ward._id}
                  className="border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition bg-white"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {ward.wardName}
                      </h3>

                      <div className="space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium text-slate-700">Ward Code:</span>{" "}
                          {ward.wardCode || "-"}
                        </p>

                        <p>
                          <span className="font-medium text-slate-700">Floor:</span>{" "}
                          {ward.floor ?? "-"}
                        </p>

                        <p>
                          <span className="font-medium text-slate-700">Type:</span>{" "}
                          {ward.wardType || "-"}
                        </p>

                        <p>
                          <span className="font-medium text-slate-700">
                            Assigned Nurse:
                          </span>{" "}
                          {ward.nurseInCharge?.fullName || "Not Assigned"}
                        </p>

                        <p>
                          <span className="font-medium text-slate-700">Beds:</span>{" "}
                          {ward.currentPatients || 0} / {ward.capacity || 0} occupied
                        </p>
                      </div>
                    </div>

                    <div>{getStatusBadge(ward.status)}</div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">
                        Occupancy Level
                      </span>
                      <span className="text-slate-700 font-semibold">
                        {occupancy}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${getOccupancyBarColor(
                          occupancy
                        )}`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Add Ward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add New Ward</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new ward and optionally assign a nurse in charge.
                </p>
              </div>

              <button
                onClick={closeAddModal}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddWard} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Ward Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ward Name *
                  </label>
                  <input
                    type="text"
                    name="wardName"
                    value={formData.wardName}
                    onChange={handleChange}
                    placeholder="e.g. ICU Ward"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                {/* Ward Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ward Code *
                  </label>
                  <input
                    type="text"
                    name="wardCode"
                    value={formData.wardCode}
                    onChange={handleChange}
                    placeholder="e.g. ICU-01"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Floor *
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 12"
                    min="1"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                {/* Ward Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ward Type
                  </label>
                  <select
                    name="wardType"
                    value={formData.wardType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="General">General</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Maternity">Maternity</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Nurse In Charge */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nurse In Charge
                  </label>
                  <select
                    name="nurseInCharge"
                    value={formData.nurseInCharge}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="">Select Nurse (Optional)</option>
                    {nurses.map((nurse) => (
                      <option key={nurse._id} value={nurse._id}>
                        {nurse.fullName} ({nurse.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Optional ward notes..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {submitting ? "Creating Ward..." : "Create Ward"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardsPage;
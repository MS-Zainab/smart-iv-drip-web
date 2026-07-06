import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import axiosInstance from "../api/axiosInstance";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  employeeId: "",
  department: "Nursing",
};

const NursesPage = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Nurse modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/nurses");

      if (res.data?.success) {
        setNurses(res.data.data || []);
      } else {
        setNurses([]);
      }
    } catch (err) {
      console.error("Fetch Nurses Error:", err);
      setError(err.response?.data?.message || "Failed to fetch nurses");
      setNurses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const totalNurses = nurses.length;

  const activeNurses = useMemo(() => {
    return nurses.filter((nurse) => nurse.isActive).length;
  }, [nurses]);

  const inactiveNurses = useMemo(() => {
    return nurses.filter((nurse) => !nurse.isActive).length;
  }, [nurses]);

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const openAddModal = () => {
    setFormData(initialFormData);
    setFormError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (submitting) return;
    setShowAddModal(false);
    setFormError("");
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "employeeId" ? value.toUpperCase() : value,
    }));
  };

  const handleAddNurse = async (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.employeeId.trim()
    ) {
      setFormError("Full name, email, password and employee ID are required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        employeeId: formData.employeeId.trim().toUpperCase(),
        department: formData.department.trim() || "Nursing",
      };

      const res = await axiosInstance.post("/nurses", payload);

      if (res.data?.success) {
        closeAddModal();
        await fetchNurses();
      } else {
        setFormError("Failed to create nurse.");
      }
    } catch (err) {
      console.error("Create Nurse Error:", err);
      setFormError(err.response?.data?.message || "Failed to create nurse");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">Nurses Management</h1>
        <p className="text-slate-500 mt-2">
          View all nurses, their department, contact info, assigned patients and current status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Nurses</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">{totalNurses}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Active Nurses</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{activeNurses}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Inactive Nurses</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">{inactiveNurses}</h2>
        </div>
      </div>

      {/* Nurses List */}
      <SectionCard title="All Nurses">
        <div className="flex justify-end mb-5">
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Add Nurse
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading nurses...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : nurses.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No nurses found.</div>
        ) : (
          <div className="space-y-4">
            {nurses.map((nurse) => (
              <div
                key={nurse._id}
                className="border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:shadow-sm transition"
              >
                {/* Left Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {nurse.fullName}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">Email:</span>{" "}
                      {nurse.email || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Phone:</span>{" "}
                      {nurse.phone || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Employee ID:
                      </span>{" "}
                      {nurse.employeeId || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Department:
                      </span>{" "}
                      {nurse.department || "-"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Assigned Patients:
                      </span>{" "}
                      {nurse.assignedPatientsCount ?? 0}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Created:
                      </span>{" "}
                      {nurse.createdAt
                        ? new Date(nurse.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Right Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(nurse.isActive)}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Add Nurse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add Nurse</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new nurse account for the IV monitoring system.
                </p>
              </div>

              <button
                onClick={closeAddModal}
                className="text-slate-500 hover:text-slate-700 text-xl"
                disabled={submitting}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddNurse} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter nurse full name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. NUR-001"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Nursing"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {submitting ? "Creating Nurse..." : "Create Nurse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NursesPage;